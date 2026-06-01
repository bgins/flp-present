<script lang="ts">
  // message-buffer (prototype on scene: buffer). FLP's message system: one
  // circular buffer (the single multiset) chambered by destination. This is a
  // SEND/state view: each chamber shows one circle per pending message (cap 4),
  // in fixed equally-spaced slots receding inward and fading by depth — crisp →
  // lighter → glitching (grains away) → text-gone ring — so the stack reads
  // "smaller and more indistinct toward the centre." Processes send INTO the
  // pool — generic in-streams converging on the centre (send is
  // an event/inflow; the buffer entry stores only (destination, value), no
  // sender). No ∅ here: null is receive-produced, so it belongs in the receive
  // representation (`null_event`), not the send view. No per-channel queues
  // (analysis.md §66). Light-cypherpunk + botanical-plate (plan.md §47;
  // plans/message-buffer-visual.md). Scene-driven.
  import type { Scene } from '../lib/types'
  import { sub } from '../lib/format'

  let { scene }: { scene: Scene } = $props()

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
        d,
        node: at(C, d, R + 110),
        sendFrom: at(C, d, R + 76), // just inside the node
        sendTo: at(C, d, R + 8), // just outside the rim (arrow points inward)
        msgs: scene.buffer.filter((m) => m.to === p.id),
      }
    }),
  )

  const dividers = $derived(
    scene.processes.map((_, i) => at(C, dir(((i + 0.5) * 2 * Math.PI) / n), R)),
  )

  // One circle per pending message (cap 4), filling slots outer → inner. Each
  // slot fades by depth: 0 crisp → 1 lighter → 2 glitching → 3 text-gone ring.
  type Pod = { x: number; y: number; r: number; slot: number; label: string }
  const pods = $derived.by(() => {
    const out: Pod[] = []
    for (const p of procs) {
      const m = Math.min(p.msgs.length, 4)
      for (let j = 0; j < m; j++) {
        const pos = at(C, p.d, slotPos[j])
        out.push({ ...pos, r: slotSize[j], slot: j, label: sub(p.msgs[j].id) })
      }
    }
    return out
  })
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <!-- Grain-dissolve for the fading label (matches the paper noise). -->
    <filter id="mbf-grain" x="-40%" y="-40%" width="180%" height="180%">
      <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="2" stitchTiles="stitch" result="noise" />
      <feColorMatrix
        in="noise"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 2 -0.55"
        result="mask"
      />
      <feComposite in="SourceGraphic" in2="mask" operator="in" />
    </filter>
    <!-- Send inflow arrowhead. -->
    <marker id="mbf-in" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
      <path d="M 0,0 L 6,3.5 L 0,7 z" fill="#a8a39c" />
    </marker>
  </defs>

  <!-- ── CONSTRUCTION ── -->
  <circle class="mbf-rim" cx={C.x} cy={C.y} r={R} />
  <circle class="mbf-core" cx={C.x} cy={C.y} r="13" />
  <circle class="mbf-center" cx={C.x} cy={C.y} r="1.4" />
  {#each dividers as dv, i (i)}
    <line class="mbf-divider" x1={C.x} y1={C.y} x2={dv.x} y2={dv.y} />
  {/each}

  <!-- Send: each process feeds the one pool — streams converge on the centre. -->
  {#each procs as p (p.id)}
    <line
      class="mbf-send"
      x1={p.sendFrom.x}
      y1={p.sendFrom.y}
      x2={p.sendTo.x}
      y2={p.sendTo.y}
      marker-end="url(#mbf-in)"
    />
  {/each}

  <!-- A circle per pending message, receding & fading inward (max 4 shown). -->
  {#each pods as pod, i (i)}
    <circle class="mbf-pod s{pod.slot}" cx={pod.x} cy={pod.y} r={pod.r} />
    {#if pod.slot === 2}
      <text class="mbf-label s2" x={pod.x} y={pod.y} filter="url(#mbf-grain)">{pod.label}</text>
    {:else if pod.slot < 2}
      <text class="mbf-label s{pod.slot}" x={pod.x} y={pod.y}>{pod.label}</text>
    {/if}
  {/each}

  <!-- Processes around the rim. -->
  {#each procs as p (p.id)}
    <g
      class="mbf-proc"
      class:faulty={p.faulty}
      transform="translate({p.node.x},{p.node.y})"
    >
      <circle r="32" />
      <text class="mbf-proc-label" y="0">{sub(p.id)}</text>
    </g>
  {/each}

  <!-- Caption. -->
  <text class="mbf-cap" x={C.x} y="500">the message buffer</text>
  <text class="mbf-cap-sub" x={C.x} y="522">sends converge into one multiset</text>
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
  .mbf-divider {
    stroke: var(--ink-faint);
    stroke-width: 0.8;
  }
  .mbf-send {
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
  .mbf-label.s0 {
    fill: var(--ink);
    font-size: 11px;
  }
  .mbf-label.s1 {
    fill: var(--ink-muted);
    font-size: 9.5px;
  }
  .mbf-label.s2 {
    fill: var(--ink-faint);
    font-size: 8px;
  }

  .mbf-proc circle {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 2.2;
  }
  .mbf-proc-label {
    font-family: 'Geist Mono', monospace;
    font-size: 18px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .mbf-proc.faulty circle {
    stroke: var(--accent-decide);
    stroke-dasharray: 4 3;
  }
  .mbf-proc.faulty .mbf-proc-label {
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
