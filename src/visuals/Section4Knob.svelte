<script lang="ts">
  import { sub } from '../lib/format'

  // section4-knob (scene: section_4_knob). §4's positive result, the
  // termination half: with no crashes during the run and a strict majority
  // alive, a process waits for a MAJORITY (not everyone) and the wait always
  // returns — so a decision becomes safe. Five processes; the alive majority
  // (3 of 5) report in to the quorum hub, which decides; the initially-dead
  // minority (2) are greyed and simply not needed. The decided value is shown
  // in the univalent-0 colour — the badge finally leaves bivalent. A fresh
  // setup outside the impossibility run (no message buffer).
  const C = { x: 400, y: 300 }
  const R = 178 // pentagon radius
  const RN = 40 // node radius
  const RH = 38 // hub radius

  type P = { id: string; x: 0 | 1; alive: boolean; a: number }
  // Pentagon, point up. Alive majority across the top, dead pair at the bottom.
  const procs: P[] = [
    { id: 'p1', x: 0, alive: true, a: -90 }, // top
    { id: 'p2', x: 1, alive: true, a: -18 }, // upper right
    { id: 'p3', x: 0, alive: true, a: 198 }, // upper left
    { id: 'p4', x: 1, alive: false, a: 54 }, // lower right
    { id: 'p5', x: 0, alive: false, a: 126 }, // lower left
  ]

  const rad = (d: number) => (d * Math.PI) / 180
  const nodes = procs.map((p) => ({
    ...p,
    cx: C.x + R * Math.cos(rad(p.a)),
    cy: C.y + R * Math.sin(rad(p.a)),
  }))

  // Report-in line from an alive node's edge to the hub's edge.
  const links = nodes
    .filter((n) => n.alive)
    .map((n) => {
      const dx = C.x - n.cx
      const dy = C.y - n.cy
      const len = Math.hypot(dx, dy)
      const ux = dx / len
      const uy = dy / len
      return {
        x1: n.cx + ux * RN,
        y1: n.cy + uy * RN,
        x2: C.x - ux * (RH + 8),
        y2: C.y - uy * (RH + 8),
      }
    })
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <marker id="s4-head" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
      <path d="M 0,0 L 6,3.5 L 0,7 z" fill="#5a5550" />
    </marker>
  </defs>

  <!-- Report-in lines: the alive majority answering the quorum. -->
  {#each links as l, i (i)}
    <line
      class="s4-link"
      x1={l.x1}
      y1={l.y1}
      x2={l.x2}
      y2={l.y2}
      marker-end="url(#s4-head)"
    />
  {/each}

  <!-- The quorum hub: a majority answered, so it decides. -->
  <circle class="s4-hub" cx={C.x} cy={C.y} r={RH} />
  <text class="s4-decide-val" x={C.x} y={C.y - 2}>0</text>
  <text class="s4-decide-lab" x={C.x} y={C.y + 18}>decide</text>

  <!-- Processes. -->
  {#each nodes as n (n.id)}
    <g class="s4-proc" class:dead={!n.alive} transform="translate({n.cx},{n.cy})">
      <circle r={RN} />
      <text class="s4-label" y="-8">{sub(n.id)}</text>
      <text class="s4-reg" y="14"><tspan class="rk">x</tspan>={n.x}</text>
      {#if !n.alive}
        <text class="s4-dead-tag" y={RN + 18}>initially dead</text>
      {/if}
    </g>
  {/each}

  <!-- Labels. -->
  <text class="s4-cap" x={C.x} y="556">termination</text>
  <text class="s4-cap-sub" x={C.x} y="574"
    >wait for a majority, not everyone&#160;&#160;·&#160;&#160;the wait always returns</text
  >
</svg>

<style>
  .s4-link {
    stroke: var(--ink);
    stroke-width: 1.4;
    opacity: 0.55;
  }

  .s4-hub {
    fill: var(--bg-raised);
    stroke: var(--univalent-0);
    stroke-width: 2.6;
  }
  .s4-decide-val {
    font-family: 'Geist Mono', monospace;
    font-size: 26px;
    font-weight: 700;
    fill: var(--univalent-0);
    text-anchor: middle;
    dominant-baseline: alphabetic;
  }
  .s4-decide-lab {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    fill: var(--univalent-0);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  .s4-proc circle {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 2.2;
  }
  .s4-proc.dead circle {
    fill: var(--bg);
    stroke: var(--ink-faint);
    stroke-dasharray: 4 3;
  }
  .s4-label {
    font-family: 'Geist Mono', monospace;
    font-size: 20px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .s4-reg {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
  }
  .s4-reg .rk {
    fill: var(--ink);
  }
  .s4-proc.dead .s4-label,
  .s4-proc.dead .s4-reg,
  .s4-proc.dead .s4-reg .rk {
    fill: var(--ink-faint);
  }
  .s4-dead-tag {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    fill: var(--ink-faint);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .s4-cap {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-style: italic;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
  }
  .s4-cap-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    fill: var(--ink-faint);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.13em;
  }
</style>
