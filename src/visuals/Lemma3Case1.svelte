<script lang="ts">
  // lemma3-case1 (scene: lemma3_case1). FLP Lemma 3, Case 1 (p′ ≠ p). The
  // flipping step e′ touches a different process than e, so the two commute
  // (Lemma 1): the left path C₀→e→D₀→e′→D₁ closes with the right path
  // C₀→e′→C₁→e→D₁, i.e. D₁ = e′(D₀). A successor of a 0-valent config is
  // 0-valent, so D₁ can't be the 1-valent image the boundary assumed —
  // contradiction. Reuses the lemma-1 diamond geometry. Proof-plate
  // conventions: bg-raised boxes, semantic valency color, a dashed Lemma-1
  // inference edge, alphabetic baseline for prime/script glyphs, red
  // contradiction band.
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <marker
      id="l3c1arrow"
      markerWidth="8"
      markerHeight="8"
      refX="6.5"
      refY="4"
      orient="auto"
    >
      <path d="M 0,0 L 7,4 L 0,8 z" fill="#181818" />
    </marker>
  </defs>

  <!-- ── EDGES (under the nodes) ── three solid steps + one dashed Lemma-1
       inference (D₀ ⇢ D₁) closing the diamond. Gaps at both ends so the
       arrowheads float just outside the boxes. -->
  <path class="l3c-edge" d="M 352,116 Q 282,188 222,258" marker-end="url(#l3c1arrow)" />
  <path class="l3c-edge" d="M 448,116 Q 518,188 578,260" marker-end="url(#l3c1arrow)" />
  <path class="l3c-edge" d="M 556,324 Q 506,400 448,440" marker-end="url(#l3c1arrow)" />
  <path
    class="l3c-edge infer"
    d="M 226,326 Q 286,400 350,440"
    marker-end="url(#l3c1arrow)"
  />

  <!-- Edge labels, anchored to the OUTSIDE of each curve. -->
  <text class="l3c-elabel out-left" x="272" y="190"
    >e&#160;·&#160;<tspan class="set">p</tspan></text
  >
  <text class="l3c-elabel out-right" x="528" y="190"
    >e′&#160;·&#160;<tspan class="set">p′</tspan></text
  >
  <text class="l3c-elabel out-right" x="522" y="392"
    >e&#160;·&#160;<tspan class="set">p</tspan></text
  >
  <text class="l3c-elabel infer out-left" x="248" y="390"
    ><tspan class="byl">by Lemma 1</tspan>&#160;·&#160;e′</text
  >

  <!-- Center hypothesis: the two steps are on different processes, so commute. -->
  <rect class="l3c-hyp-box" x="298" y="268" width="204" height="48" rx="3" />
  <text class="l3c-hyp-head" x="400" y="287">p ≠ p′</text>
  <text class="l3c-hyp-formula" x="400" y="307">e, e′ commute</text>

  <!-- ── NODES ── -->
  <g class="l3c-config bivalent" transform="translate(400, 84)">
    <rect x="-58" y="-28" width="116" height="56" rx="3" />
    <text class="label" y="-8">C₀</text>
    <text class="badge bivalent" y="13">[ BIVALENT ]</text>
  </g>
  <g class="l3c-config zero" transform="translate(200, 292)">
    <rect x="-58" y="-28" width="116" height="56" rx="3" />
    <text class="label" y="-8">D₀</text>
    <text class="badge zero" y="13">[ 0-VALENT ]</text>
  </g>
  <g class="l3c-config" transform="translate(600, 292)">
    <rect x="-58" y="-26" width="116" height="52" rx="3" />
    <text class="label" y="2">C₁</text>
  </g>

  <!-- D₁ — the assumed-1-valent node (heavy dashes in 1-valent orange, the
       lemma-1 convergence-box treatment): the boundary assumed it 1-valent, but
       D₁ = e′(D₀). The contradiction is carried by the band, not the node. -->
  <g class="l3c-config contra" transform="translate(400, 476)">
    <rect x="-60" y="-30" width="120" height="60" rx="3" />
    <text class="label" y="-9">D₁</text>
    <text class="badge one" y="14">[ 1-VALENT ]</text>
  </g>

  <!-- ── CONTRADICTION band ── -->
  <line class="l3c-contra-line" x1="172" y1="524" x2="628" y2="524" />
  <text class="l3c-contra-label" x="400" y="540">CONTRADICTION</text>
  <text class="l3c-contra-sub" x="400" y="560"
    >A successor of a 0-valent config is 0-valent</text
  >
  <text class="l3c-contra-sub" x="400" y="577"
    >So D₁ = e′(D₀) is 0-valent, not the 1-valent image</text
  >
</svg>

<style>
  .l3c-edge {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.6;
  }
  .l3c-edge.infer {
    stroke: var(--ink-faint);
    stroke-dasharray: 4 3;
  }

  .l3c-elabel {
    font-family: 'Geist Mono', monospace;
    font-size: 15px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    /* Alphabetic: e′ / {p′} carry prime + brace fallback glyphs. */
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 4;
  }
  .l3c-elabel.out-left {
    text-anchor: end;
  }
  .l3c-elabel.out-right {
    text-anchor: start;
  }
  .l3c-elabel .set {
    fill: var(--ink-muted);
    font-weight: 400;
  }
  .l3c-elabel.infer {
    fill: var(--ink-muted);
  }
  .l3c-elabel .byl {
    fill: var(--ink-faint);
    font-weight: 400;
    font-size: 13px;
  }

  .l3c-hyp-box {
    fill: var(--bg-raised);
    fill-opacity: 0.85;
    stroke: var(--ink-faint);
    stroke-width: 1;
    stroke-dasharray: 3 2;
  }
  .l3c-hyp-head {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
  .l3c-hyp-formula {
    font-family: 'Geist Mono', monospace;
    font-size: 15px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }

  .l3c-config rect {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 1.6;
  }
  .l3c-config.zero rect {
    stroke: var(--univalent-0);
  }
  .l3c-config.bivalent rect {
    stroke: var(--bivalent);
  }
  .l3c-config.contra rect {
    stroke: var(--univalent-1);
    stroke-width: 2;
    stroke-dasharray: 4 3;
  }
  .l3c-config text {
    font-family: 'Geist Mono', monospace;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .l3c-config .label {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .l3c-config .badge {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
  }
  .l3c-config .badge.zero {
    fill: var(--univalent-0);
  }
  .l3c-config .badge.one {
    fill: var(--univalent-1);
  }
  .l3c-config .badge.bivalent {
    fill: var(--bivalent);
  }

  .l3c-contra-line {
    stroke: var(--accent-decide);
    stroke-width: 1.6;
    stroke-dasharray: 5 3;
    opacity: 0.85;
  }
  .l3c-contra-label {
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
  .l3c-contra-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
</style>
