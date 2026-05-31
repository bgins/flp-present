<script lang="ts">
  // lemma3-set-D (scene: lemma3). C is bivalent; 𝒞 = configs reachable from C
  // without applying e; 𝒟 = e(𝒞). The lemma: 𝒟 contains a bivalent
  // configuration (highlighted) — the adversary's deferral target. Bespoke
  // geometry per sketches/04-lemma3-set-D.html. Math-script 𝒞/𝒟 and ∈/∃ fall
  // back to a proportional font, so symbol-bearing labels use alphabetic
  // baseline (see memory: svelte-svg-text gotchas); &#160; holds gaps.
  type Dot = [number, number, 'zero' | 'one' | 'bivalent']

  // Fan-line endpoints from C (400,62) — the top row of 𝒞 dots.
  const fan: [number, number][] = [
    [130, 145],
    [220, 155],
    [290, 175],
    [360, 145],
    [430, 185],
    [500, 155],
    [570, 175],
    [640, 145],
    [700, 185],
  ]

  // 𝒞: assorted valencies, reachable from C without e.
  const cDots: Dot[] = [
    [130, 145, 'zero'],
    [220, 155, 'one'],
    [290, 175, 'zero'],
    [360, 145, 'bivalent'],
    [430, 185, 'one'],
    [500, 155, 'zero'],
    [570, 175, 'one'],
    [640, 145, 'bivalent'],
    [700, 185, 'zero'],
    [170, 215, 'one'],
    [250, 225, 'zero'],
    [330, 215, 'bivalent'],
    [410, 223, 'one'],
    [490, 215, 'zero'],
    [570, 223, 'one'],
    [660, 215, 'zero'],
  ]

  // 𝒟 = e(𝒞): mostly univalent (assume-for-contradiction); the one bivalent
  // member is drawn separately with an aura at (570, 415).
  const dDots: Dot[] = [
    [130, 385, 'zero'],
    [220, 395, 'one'],
    [290, 415, 'zero'],
    [360, 385, 'one'],
    [430, 425, 'zero'],
    [500, 395, 'one'],
    [640, 385, 'zero'],
    [700, 425, 'one'],
    [170, 455, 'one'],
    [250, 465, 'zero'],
    [330, 455, 'one'],
    [410, 463, 'zero'],
    [490, 455, 'one'],
    [570, 463, 'zero'],
    [660, 455, 'one'],
  ]
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <marker
      id="l3map"
      markerWidth="9"
      markerHeight="9"
      refX="7"
      refY="4.5"
      orient="auto"
    >
      <path d="M 0,0 L 8,4.5 L 0,9 z" fill="#181818" />
    </marker>
    <marker
      id="l3claim"
      markerWidth="9"
      markerHeight="9"
      refX="7"
      refY="4.5"
      orient="auto"
    >
      <path d="M 0,0 L 8,4.5 L 0,9 z" fill="#3030dd" />
    </marker>
  </defs>

  <!-- ROOT: C (bivalent) -->
  <g class="l3-config" transform="translate(400, 38)">
    <rect x="-72" y="-22" width="144" height="44" rx="2" />
    <text class="label" y="-4">C</text>
    <text class="badge" y="12">[ BIVALENT ]</text>
  </g>

  <!-- Faint fan lines from C into 𝒞 -->
  {#each fan as [x, y], i (i)}
    <path class="l3-fan-line" d="M 400,62 L {x},{y}" />
  {/each}

  <!-- ====== 𝒞 region ====== -->
  <rect
    class="l3-region-frame"
    x="60"
    y="105"
    width="680"
    height="170"
    rx="3"
  />
  <text class="l3-region-label" x="78" y="266"
    >𝒞&#160;&#160;<tspan class="pre"
      >·&#160;&#160;reachable from C&#160;&#160;·&#160;&#160;e not yet applied</tspan
    ></text
  >
  {#each cDots as [x, y, v], i (i)}
    <circle class="l3-dot {v}" cx={x} cy={y} r="8" />
  {/each}

  <!-- ====== MAP band: apply e ====== -->
  <line class="l3-map-arrow" x1="200" y1="293" x2="200" y2="343" />
  <line class="l3-map-arrow" x1="600" y1="293" x2="600" y2="343" />
  <text class="l3-map-label" x="400" y="317"
    >apply&#160;&#160;<tspan class="em">e = (p, m)</tspan>&#160;&#160;to each</text
  >
  <text class="l3-map-sub" x="400" y="339">𝒟 := e(𝒞)</text>

  <!-- ====== 𝒟 region ====== -->
  <rect
    class="l3-region-frame"
    x="60"
    y="350"
    width="680"
    height="170"
    rx="3"
  />
  <text class="l3-region-label" x="78" y="511"
    >𝒟 = e(𝒞)&#160;&#160;<tspan class="pre"
      >·&#160;&#160;result of applying e to each member</tspan
    ></text
  >
  {#each dDots as [x, y, v], i (i)}
    <circle class="l3-dot {v}" cx={x} cy={y} r="8" />
  {/each}

  <!-- THE bivalent member — the punchline -->
  <circle class="l3-dot-aura" cx="570" cy="415" r="16" />
  <circle class="l3-dot bivalent-claim" cx="570" cy="415" r="9" />
  <text class="l3-claim-callout" x="570" y="371" text-anchor="middle"
    >∃ bivalent ∈ 𝒟</text
  >
  <path class="l3-claim-arrow" d="M 570,378 L 570,397" />

  <!-- Legend (aligned with its dots, so kept on the middle baseline) -->
  <text class="l3-legend" x="80" y="548">legend ::</text>
  <circle class="l3-dot zero" cx="160" cy="548" r="6" />
  <text class="l3-legend zero" x="174" y="548">0-VALENT</text>
  <circle class="l3-dot one" cx="280" cy="548" r="6" />
  <text class="l3-legend one" x="294" y="548">1-VALENT</text>
  <circle class="l3-dot bivalent" cx="400" cy="548" r="6" />
  <text class="l3-legend biv" x="414" y="548">BIVALENT</text>

  <!-- Adversary takeaway, as a left-aligned bullet. The ▸ is drawn (not a
       text glyph) so its size and vertical centering are font-independent —
       an inline larger glyph baseline-aligns high in Chrome. -->
  <polygon class="l3-mark" points="82,569 82,577 89,573" />
  <text class="l3-legend" x="99" y="574"
    >adversary's move :: pick the schedule landing in the bivalent member</text
  >

  <!-- Separator dividing the diagram (above) from the legend + adversary
       takeaway footer (below). -->
  <line
    x1="60"
    y1="534"
    x2="740"
    y2="534"
    stroke="#a8a39c"
    stroke-width="0.5"
    opacity="0.5"
  />
</svg>

<style>
  .l3-config rect {
    fill: var(--bg-raised);
    stroke: var(--bivalent);
    stroke-width: 2.4;
  }
  .l3-config text {
    font-family: 'Geist Mono', monospace;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .l3-config .label {
    font-size: 16px;
    font-weight: 700;
  }
  .l3-config .badge {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.18em;
    fill: var(--bivalent);
  }

  .l3-region-frame {
    fill: var(--bg-raised);
    fill-opacity: 0.4;
    stroke: var(--ink-faint);
    stroke-width: 1;
    stroke-dasharray: 2 3;
  }
  .l3-region-label {
    font-family: 'Geist Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    fill: var(--ink);
    /* Alphabetic baseline: 𝒞/𝒟 are math-script fallback glyphs; middle
       would float them relative to the Latin run. (y is the baseline.) */
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
  .l3-region-label .pre {
    fill: var(--ink-faint);
    font-weight: 400;
  }

  .l3-fan-line {
    fill: none;
    stroke: var(--ink);
    stroke-width: 0.8;
    opacity: 0.18;
  }

  .l3-dot {
    stroke-width: 1.4;
  }
  .l3-dot.zero {
    fill: var(--univalent-0);
    stroke: var(--univalent-0);
  }
  .l3-dot.one {
    fill: var(--univalent-1);
    stroke: var(--univalent-1);
  }
  .l3-dot.bivalent {
    fill: var(--bg-raised);
    stroke: var(--bivalent);
    stroke-width: 2.2;
  }
  .l3-dot.bivalent-claim {
    fill: var(--bg-raised);
    stroke: var(--bivalent);
    stroke-width: 3;
  }
  .l3-dot-aura {
    fill: none;
    stroke: var(--bivalent);
    stroke-width: 1.2;
    stroke-dasharray: 3 2;
    opacity: 0.6;
  }

  .l3-map-arrow {
    stroke: var(--ink);
    stroke-width: 1.6;
    fill: none;
    marker-end: url(#l3map);
  }
  .l3-map-label {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    /* Alphabetic, not middle: under middle, Chrome re-baselines the styled
       <tspan> (the blue `e = (p, m)`) a few px high even though it's the same
       font. Alphabetic puts every run on the shared baseline. (y = baseline.) */
    dominant-baseline: alphabetic;
    letter-spacing: 0.08em;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 4;
  }
  .l3-map-label .em {
    fill: var(--bivalent);
  }
  .l3-map-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    fill: var(--ink-muted);
    text-anchor: middle;
    /* Alphabetic — contains 𝒟/𝒞 fallback glyphs. */
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }

  .l3-claim-callout {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    fill: var(--bivalent);
    /* Alphabetic — contains ∃ / ∈ / 𝒟 fallback glyphs. */
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 3;
  }
  .l3-claim-arrow {
    fill: none;
    stroke: var(--bivalent);
    stroke-width: 1.4;
    marker-end: url(#l3claim);
  }

  .l3-legend {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    fill: var(--ink-muted);
    dominant-baseline: middle;
    letter-spacing: 0.06em;
  }
  .l3-legend.zero {
    fill: var(--univalent-0);
    font-weight: 700;
  }
  .l3-legend.one {
    fill: var(--univalent-1);
    font-weight: 700;
  }
  .l3-legend.biv {
    fill: var(--bivalent);
    font-weight: 700;
  }
  /* Drawn ▸ bullet for the adversary takeaway (font-independent size + center). */
  .l3-mark {
    fill: var(--bivalent);
  }
</style>
