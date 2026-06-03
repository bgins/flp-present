<script lang="ts">
  // lemma3-case2 (scene: lemma3_case2). FLP Lemma 3, Case 2 (p′ = p), the
  // paper's Fig. 3 as a 2-row commutative grid. Top row = the boundary in 𝒞:
  // D₀ = e(C₀) is 0-valent, C₀ is bivalent, D₁ = e(e′(C₀)) is 1-valent. The
  // deciding run σ (p silent) maps each straight down: it PRESERVES the
  // univalent D's (E₀ = σ(D₀) is 0-valent, E₁ = σ(D₁) is 1-valent) but
  // COLLAPSES bivalent C₀ to univalent A = σ(C₀) (the run decides). Then by
  // Lemma 1 the grid commutes — e(A) = σ(D₀) = E₀ and e(e′(A)) = σ(D₁) = E₁ —
  // so A, reached on a deciding run (univalent), also reaches both 0 and 1
  // (bivalent). Contradiction. Proof-plate conventions: bg-raised boxes,
  // semantic valency color, red contradiction band, alphabetic σ/prime glyphs.
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <defs>
    <marker
      id="l3c2arrow"
      markerWidth="8"
      markerHeight="8"
      refX="6.5"
      refY="4"
      orient="auto"
    >
      <path d="M 0,0 L 7,4 L 0,8 z" fill="#181818" />
    </marker>
  </defs>

  <!-- ── σ verticals (the deciding run, p silent) — top row mapped straight
       down to the bottom row. -->
  <path class="l3d-edge" d="M 120,159 L 120,329" marker-end="url(#l3c2arrow)" />
  <path class="l3d-edge" d="M 400,159 L 400,329" marker-end="url(#l3c2arrow)" />
  <path class="l3d-edge" d="M 680,159 L 680,329" marker-end="url(#l3c2arrow)" />

  <text class="l3d-elabel astart" x="140" y="250"
    ><tspan class="em">σ</tspan></text
  >
  <text class="l3d-elabel astart" x="420" y="244"
    ><tspan class="em">σ</tspan></text
  >
  <text class="l3d-elabel astart" x="420" y="262"
    ><tspan class="set">p silent</tspan></text
  >
  <text class="l3d-elabel aend" x="660" y="250"
    ><tspan class="em">σ</tspan></text
  >

  <!-- ── e / e′ horizontals. Left edge is e; the right edge is e′ then e
       through an intermediate config — the named boundary neighbor C₁ on top,
       its unlabeled σ-image (○) on the bottom. -->
  <path class="l3d-edge" d="M 342,130 L 180,130" marker-end="url(#l3c2arrow)" />
  <path class="l3d-edge" d="M 458,130 L 620,130" marker-end="url(#l3c2arrow)" />
  <path class="l3d-edge" d="M 342,358 L 180,358" marker-end="url(#l3c2arrow)" />
  <path class="l3d-edge" d="M 458,358 L 620,358" marker-end="url(#l3c2arrow)" />

  <text class="l3d-elabel" x="260" y="116">e</text>
  <text class="l3d-elabel" x="540" y="116"
    >e′&#160;·&#160;<tspan class="set">C₁</tspan>&#160;·&#160;e</text
  >
  <text class="l3d-elabel" x="260" y="380">e</text>
  <text class="l3d-elabel" x="540" y="380"
    >e′&#160;·&#160;<tspan class="set">○</tspan>&#160;·&#160;e</text
  >

  <!-- ── TOP ROW — the boundary in 𝒞. -->
  <g class="l3d-config zero" transform="translate(120, 130)">
    <rect x="-56" y="-27" width="112" height="54" rx="3" />
    <text class="label" y="-8">D₀</text>
    <text class="badge zero" y="13">[ 0-VALENT ]</text>
  </g>
  <g class="l3d-config bivalent" transform="translate(400, 130)">
    <rect x="-56" y="-27" width="112" height="54" rx="3" />
    <text class="label" y="-8">C₀</text>
    <text class="badge bivalent" y="13">[ BIVALENT ]</text>
  </g>
  <g class="l3d-config one" transform="translate(680, 130)">
    <rect x="-56" y="-27" width="112" height="54" rx="3" />
    <text class="label" y="-8">D₁</text>
    <text class="badge one" y="13">[ 1-VALENT ]</text>
  </g>

  <!-- ── A's reachable neighborhood is bivalent: from A, both a 0-valent (E₀)
       and a 1-valent (E₁) are reachable. A faded, sparse blue frame around the
       bottom row — the bivalence that contradicts A's deciding-run univalence.
       Drawn before the boxes so it reads as enclosing them. -->
  <rect class="l3d-biv-box" x="46" y="302" width="708" height="122" rx="8" />
  <text class="l3d-biv-label" x="400" y="408">bivalent</text>

  <!-- ── BOTTOM ROW — after the deciding run σ. A is the contradiction node. -->
  <g class="l3d-config zero" transform="translate(120, 358)">
    <rect x="-56" y="-27" width="112" height="54" rx="3" />
    <text class="label" y="-8">E₀</text>
    <text class="badge zero" y="13">[ 0-VALENT ]</text>
  </g>
  <g class="l3d-config contra" transform="translate(400, 358)">
    <rect x="-56" y="-27" width="112" height="54" rx="3" />
    <text class="label" y="-8">A</text>
    <text class="badge contra" y="13">[ UNIVALENT ]</text>
  </g>
  <g class="l3d-config one" transform="translate(680, 358)">
    <rect x="-56" y="-27" width="112" height="54" rx="3" />
    <text class="label" y="-8">E₁</text>
    <text class="badge one" y="13">[ 1-VALENT ]</text>
  </g>

  <!-- ── CONTRADICTION band ── A is univalent by the deciding run, bivalent by
       its two successors. -->
  <line class="l3d-contra-line" x1="122" y1="446" x2="678" y2="446" />
  <text class="l3d-contra-label" x="400" y="462">CONTRADICTION</text>
  <text class="l3d-contra-sub" x="400" y="481"
    >A is reached on a deciding run, so it is univalent</text
  >
  <text class="l3d-contra-sub" x="400" y="498"
    >but it reaches both 0 and 1, so it is bivalent</text
  >
</svg>

<style>
  .l3d-edge {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.6;
  }

  .l3d-elabel {
    font-family: 'Geist Mono', monospace;
    font-size: 15px;
    font-weight: 700;
    fill: var(--ink);
    text-anchor: middle;
    /* Alphabetic: σ / e′ carry fallback + prime glyphs. */
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 4;
  }
  .l3d-elabel .em {
    fill: var(--ink);
    font-weight: 700;
  }
  .l3d-elabel .set {
    fill: var(--ink-muted);
    font-weight: 400;
  }
  .l3d-elabel.astart {
    text-anchor: start;
  }
  .l3d-elabel.aend {
    text-anchor: end;
  }

  .l3d-config rect {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 1.6;
  }
  .l3d-config.bivalent rect {
    stroke: var(--bivalent);
  }
  .l3d-config.zero rect {
    stroke: var(--univalent-0);
  }
  .l3d-config.one rect {
    stroke: var(--univalent-1);
  }
  .l3d-config.contra rect {
    stroke: var(--accent-decide);
    stroke-width: 2;
    stroke-dasharray: 4 3;
  }
  .l3d-config text {
    font-family: 'Geist Mono', monospace;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .l3d-config .label {
    font-size: 17px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
  .l3d-config .badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.1em;
  }
  .l3d-config .badge.bivalent {
    fill: var(--bivalent);
  }
  .l3d-config .badge.zero {
    fill: var(--univalent-0);
  }
  .l3d-config .badge.one {
    fill: var(--univalent-1);
  }
  .l3d-config .badge.contra {
    fill: var(--accent-decide);
  }

  .l3d-biv-box {
    fill: none;
    stroke: var(--bivalent);
    stroke-width: 1.2;
    stroke-dasharray: 2 6;
    opacity: 0.5;
  }
  .l3d-biv-label {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    fill: var(--bivalent);
    opacity: 0.85;
    text-anchor: middle;
    dominant-baseline: alphabetic;
    letter-spacing: 0.18em;
  }

  .l3d-contra-line {
    stroke: var(--accent-decide);
    stroke-width: 1.6;
    stroke-dasharray: 5 3;
    opacity: 0.85;
  }
  .l3d-contra-label {
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
  .l3d-contra-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    fill: var(--ink-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    letter-spacing: 0.04em;
  }
</style>
