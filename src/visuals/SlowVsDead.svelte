<!-- slow-vs-dead (scene: slow_vs_dead). Two parallel networks with a
     byte-identical p₁ observation box — a slow process is indistinguishable
     from a dead one. Bespoke geometry per sketches/01-slow-vs-dead.html.
     Font sizes are left at sketch values; the app-wide legibility pass is a
     separate task. -->
<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <!-- Center vertical divider -->
  <line class="sd-col-divider" x1="400" y1="20" x2="400" y2="540" />

  <!-- LEFT: SLOW world (p₃ alive, just quiet) -->
  <text class="sd-col-head slow" x="200" y="36"
    ><tspan class="pre">[ world A —&#160;</tspan><tspan class="claim"
      >SLOW</tspan
    ><tspan class="pre">&#160;]</tspan></text
  >

  <path class="sd-channel" d="M 100,130 Q 200,108 300,130" />
  <path class="sd-channel muted" d="M 100,130 Q 150,200 200,260" />
  <path class="sd-channel muted" d="M 300,130 Q 250,200 200,260" />

  <g class="sd-proc" transform="translate(100, 130)">
    <circle r="28" />
    <text class="label" y="-6">p₁</text>
    <text class="reg" y="8"><tspan class="x">x</tspan>=0</text>
    <text class="reg" y="20"
      ><tspan class="x">y</tspan>=<tspan class="blank">b</tspan></text
    >
  </g>
  <g class="sd-proc" transform="translate(300, 130)">
    <circle r="28" />
    <text class="label" y="-6">p₂</text>
    <text class="reg" y="8"><tspan class="x">x</tspan>=1</text>
    <text class="reg" y="20"
      ><tspan class="x">y</tspan>=<tspan class="blank">b</tspan></text
    >
  </g>
  <g class="sd-proc slow" transform="translate(200, 260)">
    <circle r="32" />
    <text class="label" y="-6">p₃</text>
    <text class="reg" y="8"><tspan class="x">x</tspan>=0</text>
    <text class="reg" y="20"
      ><tspan class="x">y</tspan>=<tspan class="blank">b</tspan></text
    >
  </g>
  <text class="sd-tag slow" x="200" y="316"
    ><tspan class="br">[&#160;</tspan><tspan class="v">alive · quiet</tspan
    ><tspan class="br">&#160;]</tspan></text
  >

  <!-- p₁'s observation box (LEFT). &#160; (non-breaking space) holds the
       column gaps — plain spaces at tspan boundaries get trimmed by Svelte. -->
  <rect class="sd-obs-frame" x="32" y="346" width="336" height="184" rx="2" />
  <text class="sd-obs-head" x="200" y="372"
    ><tspan>p₁'s observation</tspan><tspan class="em"
      >&#160;·&#160;what's been received</tspan
    ></text
  >
  <text class="sd-obs-row" x="72" y="402"
    ><tspan class="who">from p₃ :&#160;</tspan><tspan class="id">[m₁]</tspan
    ><tspan class="pl">&#160;&#160;vote 0</tspan></text
  >
  <text class="sd-obs-row" x="72" y="424"
    ><tspan class="who">from p₃ :&#160;</tspan><tspan class="id">[m₂]</tspan
    ><tspan class="pl">&#160;&#160;vote 0</tspan></text
  >
  <text class="sd-obs-row" x="72" y="446"
    ><tspan class="who">from p₂ :&#160;</tspan><tspan class="id">[m₃]</tspan
    ><tspan class="pl">&#160;&#160;vote 1</tspan></text
  >
  <text class="sd-obs-row" x="72" y="478"
    ><tspan class="who">from p₃ :&#160;</tspan><tspan class="silence"
      >… (none since)</tspan
    ></text
  >
  <text class="sd-obs-row" x="72" y="504"
    ><tspan class="who">clock&#160;&#160;&#160;:&#160;</tspan><tspan
      class="silence">12 ticks of silence from p₃</tspan
    ></text
  >

  <!-- RIGHT: DEAD world (p₃ crashed) -->
  <text class="sd-col-head dead" x="600" y="36"
    ><tspan class="pre">[ world B —&#160;</tspan><tspan class="claim"
      >DEAD</tspan
    ><tspan class="pre">&#160;]</tspan></text
  >

  <path class="sd-channel" d="M 500,130 Q 600,108 700,130" />
  <path class="sd-channel muted" d="M 500,130 Q 550,200 600,260" />
  <path class="sd-channel muted" d="M 700,130 Q 650,200 600,260" />

  <g class="sd-proc" transform="translate(500, 130)">
    <circle r="28" />
    <text class="label" y="-6">p₁</text>
    <text class="reg" y="8"><tspan class="x">x</tspan>=0</text>
    <text class="reg" y="20"
      ><tspan class="x">y</tspan>=<tspan class="blank">b</tspan></text
    >
  </g>
  <g class="sd-proc" transform="translate(700, 130)">
    <circle r="28" />
    <text class="label" y="-6">p₂</text>
    <text class="reg" y="8"><tspan class="x">x</tspan>=1</text>
    <text class="reg" y="20"
      ><tspan class="x">y</tspan>=<tspan class="blank">b</tspan></text
    >
  </g>
  <g class="sd-proc dead" transform="translate(600, 260)">
    <circle r="32" />
    <text class="label" y="-6">p₃</text>
    <text class="reg" y="8"><tspan class="x">x</tspan>=0</text>
    <text class="reg" y="20"
      ><tspan class="x">y</tspan>=<tspan class="blank">b</tspan></text
    >
  </g>
  <text class="sd-tag dead" x="600" y="316"
    ><tspan class="br">[&#160;</tspan><tspan class="v">crashed</tspan><tspan
      class="br">&#160;]</tspan
    ></text
  >

  <!-- p₁'s observation box (RIGHT) — byte-identical contents to LEFT -->
  <rect class="sd-obs-frame" x="432" y="346" width="336" height="184" rx="2" />
  <text class="sd-obs-head" x="600" y="372"
    ><tspan>p₁'s observation</tspan><tspan class="em"
      >&#160;·&#160;what's been received</tspan
    ></text
  >
  <text class="sd-obs-row" x="472" y="402"
    ><tspan class="who">from p₃ :&#160;</tspan><tspan class="id">[m₁]</tspan
    ><tspan class="pl">&#160;&#160;vote 0</tspan></text
  >
  <text class="sd-obs-row" x="472" y="424"
    ><tspan class="who">from p₃ :&#160;</tspan><tspan class="id">[m₂]</tspan
    ><tspan class="pl">&#160;&#160;vote 0</tspan></text
  >
  <text class="sd-obs-row" x="472" y="446"
    ><tspan class="who">from p₂ :&#160;</tspan><tspan class="id">[m₃]</tspan
    ><tspan class="pl">&#160;&#160;vote 1</tspan></text
  >
  <text class="sd-obs-row" x="472" y="478"
    ><tspan class="who">from p₃ :&#160;</tspan><tspan class="silence"
      >… (none since)</tspan
    ></text
  >
  <text class="sd-obs-row" x="472" y="504"
    ><tspan class="who">clock&#160;&#160;&#160;:&#160;</tspan><tspan
      class="silence">12 ticks of silence from p₃</tspan
    ></text
  >

  <!-- ≡ bridging the two observation boxes -->
  <text class="sd-eq" x="400" y="438">≡</text>

  <!-- Bottom banner -->
  <rect class="sd-banner-bg" x="40" y="548" width="720" height="46" rx="2" />
  <text class="sd-banner-text" x="400" y="564">indistinguishable from p₁</text>
  <text class="sd-banner-sub" x="400" y="587"
    >∴ p₁ <tspan class="em">cannot wait</tspan> for p₃ — there is no time at which
    silence becomes evidence of death</text
  >
</svg>

<style>
  .sd-col-head {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: middle;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    fill: var(--ink);
  }
  .sd-col-head .pre {
    fill: var(--ink-faint);
  }
  .sd-col-head.slow .claim {
    fill: var(--bivalent);
  }
  .sd-col-head.dead .claim {
    fill: var(--accent-decide);
  }

  .sd-col-divider {
    stroke: var(--ink-faint);
    stroke-width: 1;
    opacity: 0.7;
  }

  .sd-channel {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.2;
    opacity: 0.55;
  }
  .sd-channel.muted {
    opacity: 0.18;
    stroke-dasharray: 2 3;
  }

  .sd-proc circle {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 2;
  }
  .sd-proc text {
    font-family: 'Geist Mono', monospace;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .sd-proc .label {
    font-size: 16px;
    font-weight: 700;
  }
  .sd-proc .reg {
    font-size: 9px;
    fill: var(--ink-muted);
    letter-spacing: 0.06em;
  }
  .sd-proc .reg .x {
    fill: var(--ink);
  }
  .sd-proc .reg .blank {
    fill: var(--bivalent);
    font-weight: 700;
  }

  .sd-proc.slow circle {
    stroke: var(--bivalent);
  }
  .sd-proc.slow .label {
    fill: var(--bivalent);
  }

  .sd-proc.dead circle {
    stroke: var(--accent-decide);
    stroke-dasharray: 3 2;
    opacity: 0.85;
  }
  .sd-proc.dead .label {
    fill: var(--accent-decide);
  }

  .sd-tag {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: middle;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 4;
  }
  .sd-tag .br {
    fill: var(--ink-faint);
    font-weight: 400;
  }
  .sd-tag.slow .v {
    fill: var(--bivalent);
  }
  .sd-tag.dead .v {
    fill: var(--accent-decide);
  }

  .sd-obs-frame {
    fill: var(--bg-raised);
    fill-opacity: 0.55;
    stroke: var(--ink-faint);
    stroke-width: 1;
    stroke-dasharray: 2 3;
  }
  .sd-obs-head {
    font-family: 'Geist Mono', monospace;
    font-size: 10.5px;
    font-weight: 700;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: middle;
    text-transform: uppercase;
    letter-spacing: 0.18em;
  }
  .sd-obs-head .em {
    fill: var(--ink);
  }
  .sd-obs-row {
    font-family: 'Geist Mono', monospace;
    font-size: 11.5px;
    fill: var(--ink);
    dominant-baseline: middle;
  }
  .sd-obs-row .who {
    fill: var(--ink-muted);
  }
  .sd-obs-row .id {
    fill: var(--bivalent);
    font-weight: 700;
  }
  .sd-obs-row .pl {
    fill: var(--ink);
    opacity: 0.78;
  }
  .sd-obs-row .silence {
    fill: var(--ink-faint);
    font-style: italic;
  }

  .sd-banner-bg {
    fill: var(--bg-raised);
    fill-opacity: 0.7;
    stroke: var(--bivalent);
    stroke-width: 1.4;
    stroke-dasharray: 5 3;
  }
  .sd-banner-text {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    fill: var(--bivalent);
    text-anchor: middle;
    dominant-baseline: middle;
    text-transform: uppercase;
    letter-spacing: 0.24em;
  }
  .sd-banner-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    fill: var(--ink-muted);
    text-anchor: middle;
    /* Alphabetic: the bold `em` raises under middle (see memory). */
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
  .sd-banner-sub .em {
    fill: var(--ink);
    font-weight: 700;
  }

  .sd-eq {
    font-family: 'Geist Mono', monospace;
    font-size: 22px;
    font-weight: 700;
    fill: var(--bivalent);
    text-anchor: middle;
    dominant-baseline: middle;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 5;
  }
</style>
