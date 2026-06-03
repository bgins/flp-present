<script lang="ts">
  import { sub } from '../lib/format'

  // section4-clique (scene: section_4_clique). §4's positive result, the
  // agreement half. Each process decided on a different majority — why do they
  // agree? Because any two majorities overlap, the stage-2 exchange surfaces the
  // SAME unique initial clique (a source group that heard from no one outside),
  // and a fixed rule on its values gives everyone the same decision. Here the
  // clique is {p1, p2, p3}; p4 and p5 defer to it. All five land on 0. The
  // "overlap is why it's unique" reason + the blockchain hook live in the rail.
  const C = { x: 400, y: 300 }
  const R = 178
  const RN = 40

  type P = { id: string; x: 0 | 1; a: number; clique: boolean }
  const procs: P[] = [
    { id: 'p1', x: 0, a: -90, clique: true }, // top
    { id: 'p2', x: 1, a: -18, clique: true }, // upper right
    { id: 'p3', x: 0, a: 198, clique: true }, // upper left
    { id: 'p4', x: 1, a: 54, clique: false }, // lower right
    { id: 'p5', x: 0, a: 126, clique: false }, // lower left
  ]
  const rad = (d: number) => (d * Math.PI) / 180
  const nodes = procs.map((p) => ({
    ...p,
    cx: C.x + R * Math.cos(rad(p.a)),
    cy: C.y + R * Math.sin(rad(p.a)),
  }))
  const at = (id: string) => nodes.find((n) => n.id === id)!

  // The initial clique is a 3-clique — i.e. a triangle. Draw it through the
  // three node centres (its edges ARE the mutual heard-from links), inscribed
  // in the construction circle that carries all five processes — a Dürer-style
  // triangle-in-a-circle, so every node sits both on the circle and at a
  // triangle vertex. Centroid is for the label.
  const clique = nodes.filter((n) => n.clique)
  const gc = {
    x: clique.reduce((s, n) => s + n.cx, 0) / clique.length,
    y: clique.reduce((s, n) => s + n.cy, 0) / clique.length,
  }
  const cliqueTri = clique.map((n) => `${n.cx},${n.cy}`).join(' ')

  // Influence edges: the clique's decision reaches the deferring processes.
  const edge = (from: string, to: string) => {
    const a = at(from)
    const b = at(to)
    const dx = b.cx - a.cx
    const dy = b.cy - a.cy
    const len = Math.hypot(dx, dy)
    const ux = dx / len
    const uy = dy / len
    return {
      x1: a.cx + ux * RN,
      y1: a.cy + uy * RN,
      x2: b.cx - ux * (RN + 7),
      y2: b.cy - uy * (RN + 7),
    }
  }
  const edges = [edge('p2', 'p4'), edge('p3', 'p5')]
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <marker id="s4c-head" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
      <path d="M 0,0 L 6,3.5 L 0,7 z" fill="#5a5550" />
    </marker>
  </defs>

  <!-- The construction circle carries all five processes; the initial clique is
       the triangle inscribed through three of them. -->
  <circle class="s4c-circ" cx={C.x} cy={C.y} r={R} />
  <polygon class="s4c-hull" points={cliqueTri} />
  <text class="s4c-hull-lab" x={gc.x} y={gc.y - 2}>initial clique</text>
  <text class="s4c-hull-sub" x={gc.x} y={gc.y + 16}>heard from no one outside</text>

  <!-- The clique's decision reaches the deferring processes. -->
  {#each edges as e, i (i)}
    <line
      class="s4c-edge"
      x1={e.x1}
      y1={e.y1}
      x2={e.x2}
      y2={e.y2}
      marker-end="url(#s4c-head)"
    />
  {/each}

  <!-- Processes — all land on the same decision (y = 0). -->
  {#each nodes as n (n.id)}
    <g class="s4c-proc" transform="translate({n.cx},{n.cy})">
      <circle r={RN} />
      <text class="s4c-label" y="-12">{sub(n.id)}</text>
      <text class="s4c-reg" y="6"><tspan class="rk">x</tspan>={n.x}</text>
      <text class="s4c-reg" y="22"
        ><tspan class="rk">y</tspan>=<tspan class="dec">0</tspan></text
      >
    </g>
  {/each}

  <!-- Labels. -->
  <text class="s4c-cap" x={C.x} y="556">agreement</text>
  <text class="s4c-cap-sub" x={C.x} y="574"
    >one initial clique&#160;&#160;·&#160;&#160;so one decision</text
  >
</svg>

<style>
  .s4c-circ {
    fill: none;
    stroke: var(--ink-faint);
    stroke-width: 1;
    opacity: 0.6;
  }
  .s4c-hull {
    fill: var(--univalent-0);
    fill-opacity: 0.08;
    stroke: var(--univalent-0);
    stroke-width: 1.6;
    stroke-opacity: 0.6;
    stroke-linejoin: round;
  }
  .s4c-hull-lab {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    fill: var(--univalent-0);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .s4c-hull-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .s4c-edge {
    stroke: var(--ink);
    stroke-width: 1.4;
    opacity: 0.5;
  }

  .s4c-proc circle {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 2.2;
  }
  .s4c-label {
    font-family: 'Geist Mono', monospace;
    font-size: 19px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .s4c-reg {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
  }
  .s4c-reg .rk {
    fill: var(--ink);
  }
  .s4c-reg .dec {
    fill: var(--univalent-0);
    font-weight: 700;
  }

  .s4c-cap {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-style: italic;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
  }
  .s4c-cap-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    fill: var(--ink-faint);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.13em;
  }
</style>
