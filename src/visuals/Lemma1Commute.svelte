<script lang="ts">
  // lemma1-commute (scene: lemma1_commutativity). FLP Lemma 1 — the diamond /
  // commutativity property: from a configuration C, two schedules σ₁ and σ₂
  // whose process sets are DISJOINT commute, so σ₂∘σ₁ and σ₁∘σ₂ both reach the
  // same configuration C₃. Framed as schedules (per the verbatim lemma), with
  // the disjoint process sets as the hypothesis. Designed directly in Svelte
  // (no sketch) following the bespoke-visual conventions. σ / ∩ / ∅ / ≡ are
  // fallback glyphs and literal { } are Svelte delimiters — see analysis.md
  // §154 and memory: svelte-svg-text gotchas.
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <marker
      id="l1arrow"
      markerWidth="8"
      markerHeight="8"
      refX="6.5"
      refY="4"
      orient="auto"
    >
      <path d="M 0,0 L 7,4 L 0,8 z" fill="#181818" />
    </marker>
  </defs>

  <!-- ── EDGES (drawn first, under the nodes) ──
       σ₁ and σ₂ each appear twice — once on each path — so the two orders
       (σ₂∘σ₁ on the left, σ₁∘σ₂ on the right) both land on C₃. Gentle Q-curves
       that stop short of the boxes (gap at both ends) so arrowheads float just
       outside the target rather than piercing under it — cf. lemma2/lemma3. -->
  <path class="l1-edge" d="M 362,120 Q 296,184 244,270" marker-end="url(#l1arrow)" />
  <path class="l1-edge" d="M 438,120 Q 504,184 556,270" marker-end="url(#l1arrow)" />
  <path class="l1-edge" d="M 244,330 Q 294,410 358,468" marker-end="url(#l1arrow)" />
  <path class="l1-edge" d="M 556,330 Q 506,410 442,468" marker-end="url(#l1arrow)" />

  <!-- Labels sit to the OUTSIDE of each edge (anchored away from the diamond
       center) so they don't overlap the arrows. -->
  <text class="l1-edge-label s1 out-left" x="286" y="196"
    >σ₁&#160;·&#160;<tspan class="set">&#123;p₁&#125;</tspan></text
  >
  <text class="l1-edge-label s2 out-right" x="514" y="196"
    >σ₂&#160;·&#160;<tspan class="set">&#123;p₂&#125;</tspan></text
  >
  <text class="l1-edge-label s2 out-left" x="286" y="404">σ₂</text>
  <text class="l1-edge-label s1 out-right" x="514" y="404">σ₁</text>

  <!-- ── HYPOTHESIS (center of the diamond) ── -->
  <rect class="l1-hyp-box" x="284" y="276" width="232" height="48" rx="3" />
  <text class="l1-hyp-head" x="400" y="295">disjoint process sets</text>
  <text class="l1-hyp-formula" x="400" y="316"
    ><tspan class="set">&#123;p₁&#125;</tspan>&#160;∩&#160;<tspan class="set"
      >&#123;p₂&#125;</tspan
    >&#160;=&#160;∅</text
  >

  <!-- ── NODES ── -->
  <g class="l1-config" transform="translate(400, 90)">
    <rect x="-50" y="-24" width="100" height="48" rx="3" />
    <text class="label" y="0">C</text>
  </g>
  <g class="l1-config" transform="translate(200, 300)">
    <rect x="-50" y="-24" width="100" height="48" rx="3" />
    <text class="label" y="0">C₁</text>
  </g>
  <g class="l1-config" transform="translate(600, 300)">
    <rect x="-50" y="-24" width="100" height="48" rx="3" />
    <text class="label" y="0">C₂</text>
  </g>

  <!-- C₃ — the convergence: both orders land here. A single dotted box (no
       solid border, no separate aura) marks it as the meeting point — neutral
       emphasis, no hue. Sits a bit higher than the symmetric point so the
       labels below it have padding. -->
  <g class="l1-config result" transform="translate(400, 498)">
    <rect x="-50" y="-24" width="100" height="48" rx="3" />
    <text class="label" y="0">C₃</text>
  </g>
  <text class="l1-conv" x="400" y="560">≡&#160;same configuration</text>
  <text class="l1-conv-sub" x="400" y="578">σ₁, σ₂ commute · order doesn't matter</text>
</svg>

<style>
  .l1-edge {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.6;
  }

  .l1-edge-label {
    font-family: 'Geist Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    /* Alphabetic: σ is a fallback glyph; middle would float it (see memory). */
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
    /* Halo so the label stays readable near an edge. */
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 4;
  }
  .l1-edge-label.out-left {
    text-anchor: end;
  }
  .l1-edge-label.out-right {
    text-anchor: start;
  }
  .l1-edge-label .set {
    fill: var(--ink-muted);
    font-weight: 400;
  }

  .l1-hyp-box {
    fill: var(--bg-raised);
    fill-opacity: 0.85;
    stroke: var(--ink-faint);
    stroke-width: 1;
    stroke-dasharray: 3 2;
  }
  .l1-hyp-head {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.18em;
  }
  .l1-hyp-formula {
    font-family: 'Geist Mono', monospace;
    font-size: 15px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    /* Alphabetic: contains ∩ / ∅ fallback glyphs. */
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
  .l1-hyp-formula .set,
  .l1-edge-label .set {
    fill: var(--ink);
  }

  .l1-config rect {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 1.5;
  }
  .l1-config text {
    font-family: 'Geist Mono', monospace;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .l1-config .label {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  /* C₃'s emphasis is neutral (a dotted border, not a hue): it marks the
     convergence point without implying a valency or reusing a schedule color. */
  .l1-config.result rect {
    stroke: var(--ink);
    stroke-width: 1.6;
    stroke-dasharray: 4 3;
  }

  .l1-conv {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    /* Alphabetic: ≡ is a fallback glyph. */
    dominant-baseline: alphabetic;
    letter-spacing: 0.06em;
  }
  .l1-conv-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
</style>
