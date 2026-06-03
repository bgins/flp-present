<script lang="ts">
  // lemma2-sxs (scene: lemma2). Two adjacent initial configurations differing
  // only in p₃'s input register; the identical schedule σ (with p₃ crashed)
  // runs the same on both and reaches the same decision — so the assumed
  // 0-valent / 1-valent labels can't both hold. Bespoke geometry per
  // sketches/03-lemma2-sidebyside.html. The two columns are identical up to a
  // +400 x-shift, so one column group is rendered twice. Sketch font sizes
  // kept (legibility pass is separate); &#160; holds gaps Svelte would trim.
  const columns = [
    {
      id: 'c0',
      dx: 0,
      tone: 'zero',
      label: 'C₀',
      valent: '0-VALENT',
      x3: '0',
      x3class: 'x0',
    },
    {
      id: 'c1',
      dx: 400,
      tone: 'one',
      label: 'C₁',
      valent: '1-VALENT',
      x3: '1',
      x3class: 'x1',
    },
  ]
</script>

<!-- viewBox padded vs the bare 0 0 800 600. Horizontally (-40, width 880):
     the two-column layout is wide and otherwise reaches within ~54px of the
     canvas edge, crowding the top-right toward the chrome badge; the side
     margin pulls the columns inward. Vertically (height 620): the contra-sub
     bottoms at y≈603, past 600 — in zoom mode the canvas fits to height, so
     anything below 600 was clipped at the footer. 620 contains it with margin. -->
<svg viewBox="-40 0 880 620" preserveAspectRatio="xMidYMid meet">
  <defs>
    <marker
      id="l2arrowhead"
      markerWidth="8"
      markerHeight="8"
      refX="6"
      refY="4"
      orient="auto"
    >
      <path class="l2-ahead" d="M 0,0 L 7,4 L 0,8 z" />
    </marker>
  </defs>

  <line class="l2-col-divider" x1="400" y1="20" x2="400" y2="540" />

  {#each columns as col (col.id)}
    <g transform="translate({col.dx} 0)">
      <text class="l2-col-head {col.tone}" x="200" y="30"
        ><tspan class="pre">[ {col.label} — assumed&#160;</tspan><tspan
          class="claim">{col.valent}</tspan
        ><tspan class="pre">&#160;]</tspan></text
      >

      <!-- Initial config: p₁.x = p₂.x = 0; only p₃.x differs (diff-ring). -->
      <path class="l2-channel" d="M 130,100 Q 200,80 270,100" />
      <path class="l2-channel" d="M 130,100 Q 165,150 200,200" />
      <path class="l2-channel" d="M 270,100 Q 235,150 200,200" />

      <g class="l2-proc" transform="translate(130, 100)">
        <circle r="28" />
        <text class="l2-label" y="-10">p₁</text>
        <text class="l2-reg" y="8"><tspan class="x">x</tspan>=0</text>
        <text class="l2-reg" y="20"
          ><tspan class="x">y</tspan>=<tspan class="blank">b</tspan></text
        >
      </g>
      <g class="l2-proc" transform="translate(270, 100)">
        <circle r="28" />
        <text class="l2-label" y="-10">p₂</text>
        <text class="l2-reg" y="8"><tspan class="x">x</tspan>=1</text>
        <text class="l2-reg" y="20"
          ><tspan class="x">y</tspan>=<tspan class="blank">b</tspan></text
        >
      </g>
      <g class="l2-proc faulty" transform="translate(200, 200)">
        <circle class="diff-ring" r="36" />
        <circle r="28" />
        <text class="l2-label" y="-10">p₃</text>
        <text class="l2-reg" y="8"
          ><tspan class="x">x</tspan>=<tspan class={col.x3class}>{col.x3}</tspan
          ></text
        >
        <text class="l2-reg" y="20"
          ><tspan class="x">y</tspan>=<tspan class="blank">b</tspan></text
        >
      </g>

      <!-- Schedule σ — identical in both columns -->
      <rect class="l2-σ-frame" x="60" y="260" width="280" height="200" rx="2" />
      <text class="l2-σ-label" x="200" y="282"
        >schedule&#160;<tspan class="em">σ</tspan>&#160;::&#160;p₃ crashed</text
      >
      <text class="l2-σ-trace" x="78" y="306"
        ><tspan class="n">1</tspan>&#160;·&#160;<tspan class="deliver"
          >deliver</tspan
        >&#160;<tspan class="m">[m₁]</tspan></text
      >
      <text class="l2-σ-trace" x="78" y="328"
        ><tspan class="n">2</tspan>&#160;·&#160;<tspan class="deliver"
          >deliver</tspan
        >&#160;<tspan class="m">[m₂]</tspan></text
      >
      <text class="l2-σ-trace" x="78" y="350"
        ><tspan class="n">3</tspan>&#160;·&#160;<tspan class="step">step</tspan
        >&#160;(<tspan class="pid">p₁</tspan>, ∅)</text
      >
      <text class="l2-σ-trace" x="78" y="372"
        ><tspan class="n">4</tspan>&#160;·&#160;<tspan class="deliver"
          >deliver</tspan
        >&#160;<tspan class="m">[m₃]</tspan></text
      >
      <text class="l2-σ-trace" x="78" y="394"
        ><tspan class="n">5</tspan>&#160;·&#160;<tspan class="step">step</tspan
        >&#160;(<tspan class="pid">p₂</tspan>, ∅)</text
      >
      <text class="l2-σ-trace" x="78" y="416"
        ><tspan class="n">6</tspan>&#160;·&#160;<tspan class="deliver"
          >deliver</tspan
        >&#160;<tspan class="m">[m₄]</tspan></text
      >
      <text class="l2-σ-trace" x="78" y="438"
        ><tspan class="n">⋮</tspan>&#160;·&#160;<tspan class="n"
          >… (p₃ takes no steps)</tspan
        ></text
      >

      <path class="l2-arrow" d="M 200,468 L 200,492" />

      <!-- Both columns reach the SAME decision v — the contradiction. The value
           is left abstract (the paper's "if the value is 1 … otherwise …"): the
           point is the sameness, not a tally. -->
      <g class="l2-decide" transform="translate(200, 522)">
        <rect x="-78" y="-22" width="156" height="48" rx="2" />
        <text class="verb" y="-7">decide</text>
        <text class="val" y="12">v</text>
      </g>
    </g>
  {/each}

  <!-- Contradiction band, spanning both columns. Paper's both-branches line:
       the shared decision is some v; whichever it is, one config is bivalent. -->
  <line class="l2-contra-line" x1="200" y1="566" x2="600" y2="566" />
  <text class="l2-contra-label" x="400" y="580">CONTRADICTION</text>
  <text class="l2-contra-sub" x="400" y="596"
    >same <tspan class="em">σ</tspan>, same observable run, the same decision
    <tspan class="em">v</tspan></text
  >
  <text class="l2-contra-sub" x="400" y="612"
    >if v = 1, <tspan class="em">C₀</tspan> is bivalent · if v = 0,
    <tspan class="em">C₁</tspan> is bivalent</text
  >
</svg>

<style>
  .l2-ahead {
    fill: var(--ink);
  }

  .l2-col-head {
    font-family: 'Geist Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    text-anchor: middle;
    dominant-baseline: middle;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    fill: var(--ink);
  }
  .l2-col-head .pre {
    fill: var(--ink-faint);
  }
  .l2-col-head.zero .claim {
    fill: var(--univalent-0);
  }
  .l2-col-head.one .claim {
    fill: var(--univalent-1);
  }

  .l2-col-divider {
    stroke: var(--ink-faint);
    stroke-width: 1;
  }

  .l2-proc circle {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 2;
  }
  .l2-proc text {
    font-family: 'Geist Mono', monospace;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .l2-proc .l2-label {
    font-size: 13px;
    font-weight: 700;
  }
  .l2-proc .l2-reg {
    font-size: 11px;
    fill: var(--ink-muted);
    letter-spacing: 0.06em;
    /* Alphabetic: the plain `=N` run and styled tspans land on different
       baselines under middle (see memory). */
    dominant-baseline: alphabetic;
  }
  .l2-proc .l2-reg .x {
    fill: var(--ink);
  }
  .l2-proc .l2-reg .blank {
    fill: var(--ink-faint);
    font-weight: 700;
  }
  .l2-proc .l2-reg .x0 {
    fill: var(--univalent-0);
    font-weight: 700;
  }
  .l2-proc .l2-reg .x1 {
    fill: var(--univalent-1);
    font-weight: 700;
  }
  .l2-proc.faulty circle {
    stroke: var(--accent-decide);
    stroke-dasharray: 3 2;
  }
  .l2-proc.faulty .l2-label {
    fill: var(--accent-decide);
  }
  .l2-proc .diff-ring {
    fill: none;
    stroke: var(--bivalent);
    stroke-width: 1.6;
    stroke-dasharray: 4 2;
    opacity: 0.9;
  }

  .l2-channel {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1;
    opacity: 0.5;
  }

  .l2-σ-frame {
    fill: var(--bg-raised);
    fill-opacity: 0.45;
    stroke: var(--ink-faint);
    stroke-width: 1;
    stroke-dasharray: 2 3;
  }
  .l2-σ-label {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    fill: var(--ink-muted);
    text-anchor: middle;
    /* Alphabetic (not middle) baseline: σ falls back to a proportional
       font, and middle-baseline centers each glyph by its own font's
       metrics — floating the σ like a superscript. Alphabetic is the
       shared, font-independent baseline. (y is the baseline.) */
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.16em;
  }
  .l2-σ-label .em {
    fill: var(--ink);
    font-weight: 700;
    /* keep the paper's lowercase σ — the label is otherwise uppercased,
       which would render σ as Σ (summation) and misread. */
    text-transform: none;
  }
  .l2-σ-trace {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    fill: var(--ink);
    dominant-baseline: middle;
  }
  .l2-σ-trace .n {
    fill: var(--ink-faint);
  }
  .l2-σ-trace .deliver {
    fill: var(--bivalent);
    font-weight: 700;
  }
  .l2-σ-trace .step {
    fill: var(--ink-muted);
    font-style: italic;
  }
  .l2-σ-trace .m {
    fill: var(--bivalent);
    font-weight: 700;
  }
  .l2-σ-trace .pid {
    fill: var(--ink);
  }

  .l2-arrow {
    stroke: var(--ink);
    stroke-width: 1.4;
    fill: none;
    marker-end: url(#l2arrowhead);
  }

  .l2-decide rect {
    stroke-width: 2;
    stroke: var(--ink);
    fill: var(--bg-raised);
  }
  .l2-decide text {
    font-family: 'Geist Mono', monospace;
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .l2-decide .verb {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    fill: var(--ink-muted);
  }
  .l2-decide .val {
    font-size: 24px;
    font-weight: 700;
    fill: var(--ink);
  }

  .l2-contra-line {
    stroke: var(--accent-decide);
    stroke-width: 1.6;
    stroke-dasharray: 5 3;
    opacity: 0.85;
  }
  .l2-contra-label {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    fill: var(--accent-decide);
    text-anchor: middle;
    dominant-baseline: middle;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 4;
  }
  .l2-contra-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    fill: var(--ink-muted);
    text-anchor: middle;
    /* Alphabetic baseline — see .l2-σ-label; the contra-sub's σ falls back
       to a proportional font. (y is the baseline.) */
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
  .l2-contra-sub .em {
    fill: var(--ink);
    font-weight: 700;
  }
</style>
