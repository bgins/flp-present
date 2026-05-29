<!-- The centaur sigil, mounted once in the controls bar's center spacer
     (per sketches/00-canvas-narrated.html). v2 watermark: viewBox-scaled,
     ink-faint at 0.07 so it reads as part of the paper texture. -->
<svg class="centaur-sigil" viewBox="0 0 80 28" role="img" aria-label="centaur">
  <g fill="currentColor">
    <rect x="60" y="2" width="6" height="2" />
    <rect x="55" y="5.5" width="14" height="2" />
    <rect x="47" y="9" width="26" height="2" />
    <rect x="10" y="12.5" width="60" height="2" />
    <rect x="6" y="16" width="68" height="2" />
    <rect x="12" y="19.5" width="1.5" height="7" />
    <rect x="20" y="19.5" width="1.5" height="7" />
    <rect x="56" y="19.5" width="1.5" height="7" />
    <rect x="64" y="19.5" width="1.5" height="7" />
  </g>
</svg>

<style>
  .centaur-sigil {
    display: block;
    width: clamp(72px, 7vw, 130px);
    height: auto;
    aspect-ratio: 80 / 28;
    color: var(--ink-faint);
    opacity: 0.07;
    pointer-events: none;
  }
  @media (max-width: 700px) {
    .centaur-sigil {
      display: none;
    }
  }
</style>
