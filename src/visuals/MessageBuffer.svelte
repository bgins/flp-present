<script lang="ts">
  // message-buffer (scene: buffer). FLP's message system is ONE multiset — no
  // topology, no stored sender (analysis.md §66-70). This is the SEND view: it
  // shows the *act* of sending, organised by SENDER. Each process streams its
  // sent messages inward, CONVERGING on the unbounded core (the dashed central
  // well); pods recede & fade as they enter storage — crisp → lighter → faint
  // → spent ring (the label fades a level at each depth). No partitions here: the
  // pool is undifferentiated on send. The per-recipient partition is a RECEIVE
  // concern and lives in `MessageReceive` (null_event) — it's how receive(p)
  // sees the pool, not an intrinsic structure. So: send = converge into the
  // pool (by sender); receive = the pool resolved into per-recipient wedges.
  // ∅ is receive-produced (never on send). Recipients show in the rail (the
  // (destination, value) pair). Light-cypherpunk + botanical-plate (plan.md
  // §47; plans/message-buffer-visual.md). Scene-driven.
  import type { Scene } from '../lib/types'
  import { sub } from '../lib/format'

  // op: 'send' shows the converging send streams; 'state' is a static
  // configuration view (no operation flow) — e.g. the `configuration` scene.
  // showBuffer / showRegisters drive the intro's progressive reveal:
  //   result        → showBuffer=false, showRegisters=false  (bare processes)
  //   process       → showBuffer=false                       (+ registers)
  //   configuration → (defaults)                             (+ the buffer)
  let {
    scene,
    op = 'send',
    showBuffer = true,
    showRegisters = true,
  }: {
    scene: Scene
    op?: 'send' | 'state'
    showBuffer?: boolean
    showRegisters?: boolean
  } = $props()

  const C = { x: 400, y: 286 }
  const R = 95
  // Up to 4 pods per chamber, shrinking inward with EQUAL edge-to-edge padding.
  // Centres are derived from the radii + gap so consecutive circles never
  // overlap and the gap between them stays constant.
  const slotSize = [11, 8.5, 6, 4] // circle radius, shrinking inward
  const slotGap = 5 // constant padding between consecutive circles
  const slotPos = (() => {
    let edge = 89 // slot 0's outer edge, just inside the rim (R = 95)
    return slotSize.map((r) => {
      const c = edge - r
      edge = c - r - slotGap
      return c
    })
  })()

  type V = { x: number; y: number }
  const dir = (a: number): V => ({ x: Math.sin(a), y: -Math.cos(a) })
  const at = (p: V, d: V, s: number): V => ({ x: p.x + d.x * s, y: p.y + d.y * s })

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
        // The sender's inflow: from just inside its node to ~8px off the rim
        // (same arrowhead gap MessageReceive leaves at the process circle).
        // The head points inward — "sent into the pool" — but stays outside
        // the rim; the pods' own inward dissolve carries the descent into the
        // unbounded core.
        streamFrom: at(C, d, R + 70),
        streamTo: at(C, d, R + 8),
        // Pods are grouped by SENDER on the send view (the act of sending).
        msgs: scene.buffer.filter((m) => m.from === p.id),
      }
    }),
  )

  // One circle per pending message (cap 4), filling slots outer → inner, fading
  // by depth: 0 crisp → 1 lighter → 2 faint → 3 spent ring. Ordered by recency:
  // the MOST RECENT send sits crisp at the rim, and earlier sends have sunk
  // deeper (the first-sent reached the pool first, so it's the deepest/smallest,
  // dissolving into the core). So we walk the sender's messages newest → oldest.
  type Pod = { x: number; y: number; r: number; slot: number; label: string }
  const pods = $derived.by(() => {
    const out: Pod[] = []
    for (const p of procs) {
      const recent = [...p.msgs].reverse() // newest first → outer slot
      const m = Math.min(recent.length, 4)
      for (let j = 0; j < m; j++) {
        const pos = at(C, p.d, slotPos[j])
        // Keep the raw id; the label renders the digits as a real (cell-filling)
        // subscript tspan, not floaty full-width Unicode subscript glyphs.
        out.push({ ...pos, r: slotSize[j], slot: j, label: recent[j].id })
      }
    }
    return out
  })
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <!-- Send inflow arrowhead. -->
    <marker id="mbf-in" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
      <path d="M 0,0 L 6,3.5 L 0,7 z" fill="#a8a39c" />
    </marker>
  </defs>

  <!-- ── THE POOL ── (one undifferentiated multiset; no partitions on send) -->
  {#if showBuffer}
    <circle class="mbf-rim" cx={C.x} cy={C.y} r={R} />
    <circle class="mbf-core" cx={C.x} cy={C.y} r="13" />
    <circle class="mbf-center" cx={C.x} cy={C.y} r="1.4" />

    <!-- Send: each sender streams its messages inward, converging on the
         unbounded core. Quiet senders (no messages) show no stream. -->
    {#if op === 'send'}
      {#each procs as p (p.id)}
        {#if p.msgs.length}
          <line
            class="mbf-stream"
            x1={p.streamFrom.x}
            y1={p.streamFrom.y}
            x2={p.streamTo.x}
            y2={p.streamTo.y}
            marker-end="url(#mbf-in)"
          />
        {/if}
      {/each}
    {/if}

    <!-- One pod per sent message, ranged along the sender's inflow, receding &
         fading toward the core: crisp → lighter → faint → spent ring (the
         label fades out a level at each depth, no glitch; max 4 shown). -->
    {#each pods as pod, i (i)}
      <circle class="mbf-pod s{pod.slot}" cx={pod.x} cy={pod.y} r={pod.r} />
      {#if pod.slot < 3}
        <text
          class="mbf-label s{pod.slot}"
          x={pod.x}
          y={pod.y}
          style:font-size="{pod.r}px"
          >{pod.label[0]}<tspan class="mbf-num">{pod.label.slice(1)}</tspan></text
        >
      {/if}
    {/each}
  {/if}

  <!-- Processes around the rim, each carrying its registers (its state). -->
  {#each procs as p (p.id)}
    <g
      class="mbf-proc"
      class:faulty={p.faulty}
      transform="translate({p.node.x},{p.node.y})"
    >
      <circle r="44" />
      <text class="mbf-proc-label" y={showRegisters ? -14 : 0}>{sub(p.id)}</text>
      {#if showRegisters}
        <text class="mbf-reg" y="12"><tspan class="rk">x</tspan>={p.x}</text>
        <text class="mbf-reg" y="29"
          ><tspan class="rk">y</tspan>=<tspan class="rb">{p.y}</tspan></text
        >
      {/if}
    </g>
  {/each}

  <!-- Caption (only once the buffer rota is on screen). -->
  {#if showBuffer}
    <text class="mbf-cap" x={C.x} y="500"
      >{op === 'state' ? 'a configuration' : 'the message buffer'}</text
    >
    <text class="mbf-cap-sub" x={C.x} y="518"
      >{op === 'state'
        ? 'process states + message buffer'
        : 'sends converge into one multiset'}</text
    >
  {/if}
</svg>

<style>
  .mbf-rim {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.6;
  }
  .mbf-core {
    fill: none;
    stroke: var(--ink-faint);
    stroke-width: 0.8;
    stroke-dasharray: 2 3;
  }
  .mbf-center {
    fill: var(--ink-faint);
  }
  .mbf-stream {
    stroke: var(--ink-faint);
    stroke-width: 1;
  }

  /* Pods recede by slot: crisp → lighter → glitching → text-gone empty ring. */
  .mbf-pod {
    fill: var(--bg-raised);
  }
  .mbf-pod.s0 {
    stroke: var(--ink);
    stroke-width: 1.3;
  }
  .mbf-pod.s1 {
    stroke: var(--ink-muted);
    stroke-width: 1;
  }
  .mbf-pod.s2 {
    stroke: var(--ink-faint);
    stroke-width: 0.8;
  }
  .mbf-pod.s3 {
    fill: none;
    stroke: var(--ink-faint);
    stroke-width: 0.6;
  }
  .mbf-label {
    font-family: 'Geist Mono', monospace;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: middle;
  }
  /* Real subscript: normal digits (they fill their cells, so multi-digit ids
     stay tight) at reduced size, lowered — not the floaty full-width Unicode
     subscript glyphs that read as "m8 4". */
  .mbf-num {
    font-size: 0.72em;
    /* Lowered to the font's true-subscript level so it matches the Unicode
       subscripts (process ids, ∅) and the rail's <sub> — not a raised look. */
    baseline-shift: -0.34em;
  }
  /* Size is set inline = the pod radius, so the label scales in step with the
     circle (constant padding as the stack recedes). Slot only sets the fade. */
  .mbf-label.s0 {
    fill: var(--ink);
  }
  .mbf-label.s1 {
    fill: var(--ink-muted);
  }
  .mbf-label.s2 {
    fill: var(--ink-faint);
  }

  .mbf-proc circle {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 2.2;
  }
  .mbf-proc-label {
    font-family: 'Geist Mono', monospace;
    font-size: 22px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .mbf-reg {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    fill: var(--ink-muted);
    text-anchor: middle;
    /* Alphabetic: the plain `=N` run + styled tspans misalign under middle. */
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
  .mbf-reg .rk {
    fill: var(--ink);
  }
  .mbf-reg .rb {
    fill: var(--bivalent);
    font-weight: 700;
  }
  .mbf-proc.faulty circle {
    stroke: var(--accent-decide);
    stroke-dasharray: 4 3;
  }
  .mbf-proc.faulty .mbf-proc-label,
  .mbf-proc.faulty .mbf-reg .rk {
    fill: var(--accent-decide);
  }

  .mbf-cap {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-style: italic;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
  }
  .mbf-cap-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    fill: var(--ink-faint);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.13em;
  }
</style>
