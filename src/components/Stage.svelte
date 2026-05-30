<script lang="ts">
  import type { Scene } from '../lib/types'
  import Canvas from '../visuals/Canvas.svelte'
  import SlowVsDead from '../visuals/SlowVsDead.svelte'

  let { scene }: { scene: Scene } = $props()

  const visual = $derived(scene.visual ?? 'canvas')
</script>

<div class="canvas">
  {#if visual === 'canvas'}
    <Canvas {scene} />
  {:else if visual === 'slow-vs-dead'}
    <SlowVsDead />
  {:else}
    <div class="placeholder">
      <span>:: {visual} ::</span>
      <span class="sub">bespoke visual — not yet built</span>
    </div>
  {/if}
</div>

<style>
  .canvas {
    position: relative;
    min-width: 0;
    min-height: 0;
    padding: 1rem 1.5rem;
    box-shadow: inset -1px 0 0 rgba(24, 24, 24, 0.08);
  }
  .canvas :global(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
  .placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    height: 100%;
    color: var(--ink-faint);
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 14px;
  }
  .placeholder .sub {
    font-size: 12px;
    letter-spacing: 0.1em;
  }
</style>
