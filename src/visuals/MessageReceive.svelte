<script lang="ts">
  // message-receive (prototype on scene: null_event). The RECEIVE side: a
  // process pulls ANY pending message addressed to it — or ∅ — from the
  // unordered multiset. The chamber holds:
  //   • indistinct background "bubbles" that grow center→edge in the SAME
  //     proportions as the send circles — the unbounded storage bubbling forth
  //     from the convergence (centre);
  //   • a few DISTINCT, uniform-size candidates at varied radii (edge or
  //     centre), pushing the bubbles aside but leaving their proportions;
  //   • ∅ as just another candidate circle (internal slash).
  // receive = a STRAIGHT arrow from each candidate (well separated so the
  // arrows don't stack); the SELECTED one is solid — here ∅, even though
  // messages are pending (the null_event point). See
  // plans/message-buffer-visual.md. Scene-driven.
  import type { Scene } from '../lib/types'
  import { sub } from '../lib/format'

  let { scene }: { scene: Scene } = $props()

  const C = { x: 400, y: 286 }
  const R = 95
  const CAND_R = 11

  type V = { x: number; y: number }
  const dir = (a: number): V => ({ x: Math.sin(a), y: -Math.cos(a) })
  const at = (p: V, d: V, s: number): V => ({ x: p.x + d.x * s, y: p.y + d.y * s })
  const rot = (d: V, deg: number): V => {
    const r = (deg * Math.PI) / 180
    return { x: d.x * Math.cos(r) - d.y * Math.sin(r), y: d.x * Math.sin(r) + d.y * Math.cos(r) }
  }

  const n = $derived(scene.processes.length)
  const procs = $derived(
    scene.processes.map((p, i) => {
      const d = dir((i * 2 * Math.PI) / n)
      return {
        id: p.id,
        faulty: p.faulty,
        x: p.x,
        y: p.y,
        d,
        node: at(C, d, R + 110),
        msgs: scene.buffer.filter((m) => m.to === p.id),
      }
    }),
  )
  const dividers = $derived(
    scene.processes.map((_, i) => at(C, dir(((i + 0.5) * 2 * Math.PI) / n), R)),
  )

  // Receiver = the process with the most pending messages — the strongest
  // "candidates present, yet ∅ selected."
  const receiver = $derived([...procs].sort((a, b) => b.msgs.length - a.msgs.length)[0])

  // Candidates per chamber: each pending message as a uniform distinct circle,
  // spread angularly (for separate straight arrows) at varied radii. The
  // receiver also gets a ∅ candidate, marked selected.
  const candAngles = (k: number): number[] =>
    k <= 1 ? [0] : k === 2 ? [-24, 24] : k === 3 ? [-32, 0, 32] : [-36, -12, 12, 36]
  const candRadii = [66, 44, 60, 46]

  type Cand = { x: number; y: number; kind: 'msg' | 'null'; label: string; selected: boolean }
  const chambers = $derived(
    procs.map((p) => {
      const isRcv = receiver && p.id === receiver.id
      const items: { kind: 'msg' | 'null'; label: string; selected: boolean }[] =
        p.msgs.map((m) => ({ kind: 'msg' as const, label: sub(m.id), selected: false }))
      // ∅ is just another candidate, placed at the centre of the group.
      if (isRcv) items.splice(Math.floor(items.length / 2), 0, { kind: 'null', label: '∅', selected: true })
      const angs = candAngles(items.length)
      const cands: Cand[] = items.map((it, j) => ({
        ...it,
        ...at(C, rot(p.d, angs[j]), candRadii[j % candRadii.length]),
      }))
      return { proc: p, isRcv, cands }
    }),
  )
  const allCands = $derived(chambers.flatMap((c) => c.cands))

  // Background bubbles — grow center→edge (send proportions), pushed aside by
  // candidates but keeping their size.
  const bgPattern: [number, number][] = [
    [24, -16], [24, 16],
    [44, -28], [44, -6], [44, 18], [44, 34],
    [66, -32], [66, -10], [66, 12], [66, 34],
  ]
  const bgSize = (rad: number) => rad * 0.11 + 2.2
  const bubbles = $derived(
    chambers.flatMap(({ proc, cands }) =>
      bgPattern
        .map(([rad, ang]) => {
          const pos = at(C, rot(proc.d, ang), rad)
          const br = bgSize(rad)
          const clash = cands.some((c) => Math.hypot(c.x - pos.x, c.y - pos.y) < CAND_R + br + 3)
          return clash ? null : { ...pos, br }
        })
        .filter((b): b is { x: number; y: number; br: number } => b !== null),
    ),
  )

  // Straight receive arrows from each candidate to the receiver (stop short).
  const arrows = $derived.by(() => {
    if (!receiver) return []
    const to = receiver.node
    const rcv = chambers.find((c) => c.isRcv)
    return (rcv?.cands ?? []).map((c) => {
      const dx = to.x - c.x
      const dy = to.y - c.y
      const len = Math.hypot(dx, dy) || 1
      return {
        x1: c.x,
        y1: c.y,
        x2: to.x - (dx / len) * 52,
        y2: to.y - (dy / len) * 52,
        selected: c.selected,
      }
    })
  })
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <marker id="mr-cand" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
      <path d="M 0,0 L 6,3.5 L 0,7 z" fill="#a8a39c" />
    </marker>
    <marker id="mr-deliver" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
      <path d="M 0,0 L 6,3.5 L 0,7 z" fill="#5a5550" />
    </marker>
  </defs>

  <!-- ── CONSTRUCTION ── -->
  <circle class="mr-rim" cx={C.x} cy={C.y} r={R} />
  <circle class="mr-core" cx={C.x} cy={C.y} r="13" />
  <circle class="mr-center" cx={C.x} cy={C.y} r="1.4" />
  {#each dividers as dv, i (i)}
    <line class="mr-divider" x1={C.x} y1={C.y} x2={dv.x} y2={dv.y} />
  {/each}

  <!-- Background storage — bubbling forth from the convergence, growing out. -->
  {#each bubbles as b, i (i)}
    <circle class="mr-pack" cx={b.x} cy={b.y} r={b.br} />
  {/each}

  <!-- Receive arrows (straight): faint = candidate, solid = selected (∅). -->
  {#each arrows as a, i (i)}
    <line
      class="mr-arrow"
      class:selected={a.selected}
      x1={a.x1}
      y1={a.y1}
      x2={a.x2}
      y2={a.y2}
      marker-end={a.selected ? 'url(#mr-deliver)' : 'url(#mr-cand)'}
    />
  {/each}

  <!-- Candidates (uniform size): a circle whose label is its identity — a
       message id, or ∅ for the null candidate. -->
  {#each allCands as c, i (i)}
    <circle class="mr-cand-pod" cx={c.x} cy={c.y} r={CAND_R} />
    <text class="mr-cand-label" class:nullglyph={c.kind === 'null'} x={c.x} y={c.y}
      >{c.label}</text
    >
  {/each}

  <!-- Processes around the rim. -->
  {#each procs as p (p.id)}
    <g
      class="mr-proc"
      class:faulty={p.faulty}
      class:receiver={receiver && p.id === receiver.id}
      transform="translate({p.node.x},{p.node.y})"
    >
      <circle r="44" />
      <text class="mr-proc-label" y="-14">{sub(p.id)}</text>
      <text class="mr-reg" y="12"><tspan class="rk">x</tspan>={p.x}</text>
      <text class="mr-reg" y="29"
        ><tspan class="rk">y</tspan>=<tspan class="rb">{p.y}</tspan></text
      >
    </g>
  {/each}

  <!-- Caption. -->
  <text class="mr-cap" x={C.x} y="500">receive</text>
  <text class="mr-cap-sub" x={C.x} y="518"
    >pull any pending message or&#160;∅</text
  >
</svg>

<style>
  .mr-rim {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.6;
  }
  .mr-core {
    fill: none;
    stroke: var(--ink-faint);
    stroke-width: 0.8;
    stroke-dasharray: 2 3;
  }
  .mr-center {
    fill: var(--ink-faint);
  }
  .mr-divider {
    stroke: var(--ink-faint);
    stroke-width: 0.8;
  }

  .mr-pack {
    fill: none;
    stroke: var(--ink-faint);
    stroke-width: 0.8;
    opacity: 0.3;
  }
  .mr-cand-pod {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 1.3;
  }
  .mr-cand-label {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .mr-arrow {
    fill: none;
    stroke: var(--ink-faint);
    stroke-width: 1;
    stroke-dasharray: 3 3;
  }
  /* Selection is shown by line quality (solid + a gentle tonal step), not by
     weight — Dürer-style restraint. */
  .mr-arrow.selected {
    stroke: var(--ink-muted);
    stroke-width: 1.2;
    stroke-dasharray: none;
  }

  .mr-proc circle {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 2.2;
  }
  .mr-proc.receiver circle {
    stroke-width: 2.8;
  }
  .mr-proc-label {
    font-family: 'Geist Mono', monospace;
    font-size: 22px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .mr-reg {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    fill: var(--ink-muted);
    text-anchor: middle;
    /* Alphabetic: the plain `=N` run + styled tspans misalign under middle. */
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
  .mr-reg .rk {
    fill: var(--ink);
  }
  .mr-reg .rb {
    fill: var(--bivalent);
    font-weight: 700;
  }
  .mr-proc.faulty circle {
    stroke: var(--accent-decide);
    stroke-dasharray: 4 3;
  }
  .mr-proc.faulty .mr-proc-label,
  .mr-proc.faulty .mr-reg .rk {
    fill: var(--accent-decide);
  }

  .mr-cap {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-style: italic;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
  }
  .mr-cap-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    fill: var(--ink-faint);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.13em;
  }
</style>
