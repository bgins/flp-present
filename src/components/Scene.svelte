<script lang="ts">
  import type { Scene } from '../lib/types'

  let { scene, active = false }: { scene: Scene; active?: boolean } = $props()

  let el = $state<HTMLElement>()

  // Each scene scrolls itself into view when it becomes the active one.
  $effect(() => {
    if (active) el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  })

  // Render `x_p` / `x_{ij}` subscript notation in authored quote/note text as
  // real <sub> elements. Geist Mono has no subscript-LETTER glyphs (a literal
  // `ₚ` falls back to a mismatched font), so we resize the normal glyph
  // instead. The content is ours (script.yaml), so {@html} is safe — we escape
  // HTML metacharacters first.
  function subs(s: string): string {
    return s
      .trim()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/_\{([^}]+)\}/g, '<sub>$1</sub>')
      .replace(/_([A-Za-z0-9]+)/g, '<sub>$1</sub>')
  }
</script>

<section class="scene" class:active bind:this={el}>
  <div class="scene-head">
    <span>{scene.head.section}</span>
    <span class="sep">::</span>
    <span class="topic">{scene.head.topic}</span>
  </div>
  <p class="quote">{@html subs(scene.quote)}</p>
  <div class="cite">[ {scene.cite} ]</div>
  {#if scene.note}
    <div class="note">
      <span class="src">{scene.note.marker}</span>
      {@html subs(scene.note.body)}
    </div>
  {/if}
</section>

<style>
  .scene {
    max-width: 32rem;
    margin: 0 auto 5rem;
    opacity: 0.28;
    transition: opacity 200ms ease;
  }
  .scene:last-child {
    margin-bottom: 50vh;
  }
  .scene.active {
    opacity: 1;
  }

  .scene-head {
    display: flex;
    align-items: baseline;
    gap: 0.6rem;
    margin-bottom: 1.4rem;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--ink-muted);
  }
  .scene-head .sep {
    color: var(--ink-faint);
  }
  .scene-head .topic {
    color: var(--ink);
  }
  .scene.active .scene-head::before {
    content: '▸';
    color: var(--bivalent);
    margin-right: 0.4rem;
    font-size: 14px;
  }

  .quote {
    position: relative;
    font-style: italic;
    font-size: 19px;
    line-height: 1.65;
    color: var(--ink);
    letter-spacing: -0.005em;
  }
  .quote::before {
    content: '»';
    position: absolute;
    left: -1.5rem;
    top: -0.1rem;
    font-style: normal;
    font-weight: 600;
    color: var(--bivalent);
    opacity: 0.55;
    font-size: 22px;
  }
  .quote::after {
    content: ' «';
    font-style: normal;
    font-weight: 600;
    color: var(--bivalent);
    opacity: 0.55;
  }

  .cite {
    margin-top: 0.8rem;
    font-size: 13px;
    font-style: normal;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--ink-muted);
  }

  .note {
    margin-top: 1.3rem;
    padding-left: 1.1rem;
    border-left: 2px solid rgba(48, 48, 221, 0.25);
    font-size: 15px;
    font-style: normal;
    line-height: 1.6;
    color: var(--ink-muted);
  }
  .note .src {
    font-weight: 600;
    color: var(--ink);
  }
</style>
