<script lang="ts">
  // message-receive. The RECEIVE side: the pool resolved into per-recipient
  // chambers, and the scene's last trace event picks what's depicted —
  //   • step (p, ∅)  → p reaches in and is handed ∅ though messages pend
  //                    (null_event): ∅ is a candidate, selected (solid arrow);
  //   • deliver mN   → mN's recipient receives it (admissible): the real
  //                    message is selected, no ∅.
  // The receiver is always NONFAULTY; a faulty process's chamber is EXEMPT
  // (greyed, dashed) — its messages can never be received. Each chamber also
  // holds indistinct background "bubbles" (the unbounded storage) and its
  // distinct candidates at varied radii. The SELECTED candidate gets a solid
  // arrow to the receiver; the rest are faint. See
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

  // The receive view depicts the scene's LAST trace event:
  //   deliver mN  → mN's recipient receives it (a real delivery — admissible)
  //   step (p, ∅) → p reaches in and is handed ∅ (null_event)
  const lastEvent = $derived(scene.trace[scene.trace.length - 1])
  const isDelivery = $derived(lastEvent?.verb === 'deliver')
  const deliveredMsg = $derived(
    isDelivery ? scene.buffer.find((m) => m.id === lastEvent?.target) : undefined,
  )
  // Receiver: the delivery's recipient, or the ∅-step's process — falling back
  // to the most-pending process. Never the faulty one (its mail is exempt and
  // it isn't taking steps).
  const receiverId = $derived(
    isDelivery ? deliveredMsg?.to : lastEvent?.target.match(/\((p\d+)/)?.[1],
  )
  const receiver = $derived(
    procs.find((p) => p.id === receiverId && !p.faulty) ??
      [...procs].filter((p) => !p.faulty).sort((a, b) => b.msgs.length - a.msgs.length)[0],
  )

  // Candidates per chamber: each pending message as a uniform distinct circle,
  // spread angularly (for separate straight arrows) at varied radii. The
  // receiver also gets a ∅ candidate, marked selected.
  // The 4th candidate sits up and slightly left (42°, radius 55 — out along its
  // spoke, deeper into the chamber) so its arrow to the receiver passes clear
  // of the 3rd candidate's circle while staying off the partition line.
  const candAngles = (k: number): number[] =>
    k <= 1 ? [0] : k === 2 ? [-24, 24] : k === 3 ? [-32, 0, 32] : [-36, -12, 12, 42]
  const candRadii = [66, 44, 60, 55]

  type Item = { kind: 'msg' | 'null'; label: string; selected: boolean; exempt: boolean }
  type Cand = Item & { x: number; y: number }
  const chambers = $derived(
    procs.map((p) => {
      const isRcv = receiver && p.id === receiver.id
      // A faulty process's chamber is EXEMPT — its messages never get received.
      const items: Item[] = p.msgs.map((m) => ({
        kind: 'msg' as const,
        label: sub(m.id),
        selected: isRcv && isDelivery && m.id === deliveredMsg?.id,
        exempt: !!p.faulty,
      }))
      // ∅ is a candidate only for the receiver in a null event (not a delivery).
      if (isRcv && !isDelivery)
        items.splice(Math.floor(items.length / 2), 0, {
          kind: 'null',
          label: '∅',
          selected: true,
          exempt: false,
        })
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
    [44, -28], [44, -6], [44, 18], [44, 42],
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

  <!-- Receive arrows (straight): faint = candidate, solid = selected (the
       delivered message, or ∅ for a null event). -->
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
       message id, or ∅ for the null candidate. Faulty chambers are exempt
       (greyed, dashed): their messages can never be received. -->
  {#each allCands as c, i (i)}
    <circle class="mr-cand-pod" class:exempt={c.exempt} cx={c.x} cy={c.y} r={CAND_R} />
    <text
      class="mr-cand-label"
      class:nullglyph={c.kind === 'null'}
      class:exempt={c.exempt}
      x={c.x}
      y={c.y}>{c.label}</text
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
    >{isDelivery
      ? 'delivered to a nonfaulty process'
      : 'pull any pending message or ∅'}</text
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
  /* Exempt = addressed to the faulty process: stuck, never received. Greyed and
     dashed, echoing the faulty node's own dashed circle. */
  .mr-cand-pod.exempt {
    stroke: var(--ink-faint);
    stroke-dasharray: 3 2.5;
  }
  .mr-cand-label {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .mr-cand-label.exempt {
    fill: var(--ink-faint);
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
