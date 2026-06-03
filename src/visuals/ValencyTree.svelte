<!-- valency-tree (scene: valency). V := the set of
     decision values reachable from C, made visible: root C is bivalent, each
     child stays bivalent (the Lemma 3 hint), wedges elide the many stages, and
     the leaves show both 0 and 1 are reachable ⇒ |V| = 2. Bespoke geometry per
     sketches/02-valency-tree.html. Sketch font sizes kept (legibility pass is
     separate); &#160; holds intentional gaps that Svelte would otherwise trim. -->
<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <!-- ROOT: C -->
  <g class="vt-config root bivalent" transform="translate(400, 60)">
    <rect x="-78" y="-34" width="156" height="68" rx="2" />
    <text class="vt-meta" y="-18">configuration</text>
    <text class="vt-label" y="0">C</text>
    <text class="vt-badge" y="18">[ BIVALENT ]</text>
  </g>

  <!-- Branches: root box bottom (y=94) to each L1 child box top (y=184). -->
  <path class="vt-edge" d="M 350,94 Q 250,135 160,184" />
  <path class="vt-edge" d="M 400,94 L 400,184" />
  <path class="vt-edge" d="M 450,94 Q 550,135 640,184" />

  <text class="vt-edge-label" x="210" y="130" text-anchor="end"
    ><tspan class="em">deliver</tspan>&#160;[m₄]</text
  >
  <text class="vt-edge-label" x="416" y="138" text-anchor="start"
    ><tspan class="em">step</tspan>&#160;(p₂, ∅)</text
  >
  <text class="vt-edge-label" x="590" y="130" text-anchor="start"
    ><tspan class="em">deliver</tspan>&#160;[m₅]</text
  >

  <!-- L1 children — each still bivalent (the Lemma 3 hint) -->
  <g class="vt-config bivalent" transform="translate(160, 210)">
    <rect x="-58" y="-26" width="116" height="52" rx="2" />
    <text class="vt-label" y="-8">C₁</text>
    <text class="vt-badge" y="12">[ BIVALENT ]</text>
  </g>
  <g class="vt-config bivalent" transform="translate(400, 210)">
    <rect x="-58" y="-26" width="116" height="52" rx="2" />
    <text class="vt-label" y="-8">C₂</text>
    <text class="vt-badge" y="12">[ BIVALENT ]</text>
  </g>
  <g class="vt-config bivalent" transform="translate(640, 210)">
    <rect x="-58" y="-26" width="116" height="52" rx="2" />
    <text class="vt-label" y="-8">C₃</text>
    <text class="vt-badge" y="12">[ BIVALENT ]</text>
  </g>

  <!-- Wedges — dashed triangles standing in for the many schedules that fan
       out under each Cᵢ before any decision is reached. -->
  <polygon class="vt-wedge" points="160,240 60,410 260,410" />
  <text class="vt-wedge-dots" x="160" y="330">···</text>
  <text class="vt-wedge-sub" x="160" y="370">many stages</text>

  <polygon class="vt-wedge" points="400,240 300,410 500,410" />
  <text class="vt-wedge-dots" x="400" y="330">···</text>
  <text class="vt-wedge-sub" x="400" y="370">many stages</text>

  <polygon class="vt-wedge" points="640,240 540,410 740,410" />
  <text class="vt-wedge-dots" x="640" y="330">···</text>
  <text class="vt-wedge-sub" x="640" y="370">many stages</text>

  <!-- Leaves — two per subtree (a 0 and a 1), so every subtree reaches both. -->
  <g class="vt-leaf zero" transform="translate(80, 450)">
    <rect x="-44" y="-22" width="88" height="44" rx="2" />
    <text class="vt-leaf-glyph" y="-4">0</text>
    <text y="14">decide</text>
  </g>
  <g class="vt-leaf one" transform="translate(240, 450)">
    <rect x="-44" y="-22" width="88" height="44" rx="2" />
    <text class="vt-leaf-glyph" y="-4">1</text>
    <text y="14">decide</text>
  </g>

  <g class="vt-leaf one" transform="translate(320, 450)">
    <rect x="-44" y="-22" width="88" height="44" rx="2" />
    <text class="vt-leaf-glyph" y="-4">1</text>
    <text y="14">decide</text>
  </g>
  <g class="vt-leaf zero" transform="translate(480, 450)">
    <rect x="-44" y="-22" width="88" height="44" rx="2" />
    <text class="vt-leaf-glyph" y="-4">0</text>
    <text y="14">decide</text>
  </g>

  <g class="vt-leaf zero" transform="translate(560, 450)">
    <rect x="-44" y="-22" width="88" height="44" rx="2" />
    <text class="vt-leaf-glyph" y="-4">0</text>
    <text y="14">decide</text>
  </g>
  <g class="vt-leaf one" transform="translate(720, 450)">
    <rect x="-44" y="-22" width="88" height="44" rx="2" />
    <text class="vt-leaf-glyph" y="-4">1</text>
    <text y="14">decide</text>
  </g>

  <!-- V annotation — the punchline -->
  <rect class="vt-V-frame" x="180" y="510" width="440" height="60" rx="2" />
  <text class="vt-V-text" x="400" y="532"
    ><tspan class="pre">V&#160;&#160;=&#160;&#160;&#123;&#160;&#160;</tspan
    ><tspan class="zero">0</tspan><tspan class="pre"
      >&#160;&#160;,&#160;&#160;</tspan
    ><tspan class="one">1</tspan><tspan class="pre">&#160;&#160;&#125;</tspan
    ></text
  >
  <text class="vt-V-text" x="400" y="555"
    ><tspan class="pre">|V|&#160;&#160;=&#160;&#160;2&#160;&#160;</tspan><tspan
      class="arr">→&#160;&#160;</tspan
    ><tspan class="res">BIVALENT</tspan></text
  >
</svg>

<style>
  .vt-config rect {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 1.6;
  }
  .vt-config.root rect {
    stroke: var(--bivalent);
    stroke-width: 2.4;
  }
  .vt-config text {
    font-family: 'Geist Mono', monospace;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .vt-config .vt-label {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .vt-config .vt-meta {
    font-size: 12px;
    fill: var(--ink-muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .vt-config .vt-badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
  }
  .vt-config.bivalent .vt-badge {
    fill: var(--bivalent);
  }

  .vt-edge {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.2;
    opacity: 0.55;
  }
  .vt-edge-label {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    fill: var(--ink-muted);
    dominant-baseline: middle;
    letter-spacing: 0.02em;
  }
  .vt-edge-label .em {
    fill: var(--ink);
    font-weight: 700;
  }

  .vt-wedge {
    fill: var(--ink);
    fill-opacity: 0.025;
    stroke: var(--ink);
    stroke-width: 1;
    stroke-dasharray: 2 3;
    opacity: 0.55;
  }
  .vt-wedge-dots {
    font-family: 'Geist Mono', monospace;
    font-size: 36px;
    font-weight: 700;
    fill: var(--ink-faint);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .vt-wedge-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: middle;
    text-transform: uppercase;
    letter-spacing: 0.2em;
  }

  .vt-leaf rect {
    stroke-width: 1.8;
    fill: var(--bg-raised);
  }
  .vt-leaf.zero rect {
    stroke: var(--univalent-0);
  }
  .vt-leaf.one rect {
    stroke: var(--univalent-1);
  }
  .vt-leaf text {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: middle;
    text-transform: uppercase;
    letter-spacing: 0.14em;
  }
  .vt-leaf.zero text {
    fill: var(--univalent-0);
  }
  .vt-leaf.one text {
    fill: var(--univalent-1);
  }
  .vt-leaf .vt-leaf-glyph {
    font-size: 18px;
    letter-spacing: 0;
  }

  .vt-V-frame {
    fill: none;
    stroke: var(--bivalent);
    stroke-width: 1.4;
    stroke-dasharray: 4 3;
    opacity: 0.7;
  }
  .vt-V-text {
    font-family: 'Geist Mono', monospace;
    font-size: 14px;
    text-anchor: middle;
    dominant-baseline: middle;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 4;
  }
  .vt-V-text .pre {
    fill: var(--ink-muted);
  }
  .vt-V-text .zero {
    fill: var(--univalent-0);
    font-weight: 700;
  }
  .vt-V-text .one {
    fill: var(--univalent-1);
    font-weight: 700;
  }
  .vt-V-text .res {
    fill: var(--bivalent);
    font-weight: 700;
    letter-spacing: 0.08em;
  }
  .vt-V-text .arr {
    fill: var(--ink-faint);
  }
</style>
