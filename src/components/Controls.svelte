<script lang="ts">
  import Watermark from './Watermark.svelte'

  let {
    activeIndex,
    total,
    forward,
    back,
    reset,
  }: {
    activeIndex: number
    total: number
    forward: () => void
    back: () => void
    reset: () => void
  } = $props()
</script>

<footer class="controls">
  <button class="ctrl" onclick={back} disabled={activeIndex === 0}
    >◂ back</button
  >
  <button class="ctrl" onclick={forward} disabled={activeIndex === total - 1}
    >▸ forward</button
  >
  <button class="ctrl" onclick={reset}>⟳ reset</button>
  <div class="ctrl-spacer"><Watermark /></div>
  <span class="hint">
    scene <span class="scene-counter">{activeIndex + 1} / {total}</span> :: keys ←
    →
  </span>
</footer>

<style>
  .controls {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.8rem 2rem;
    font-size: 14px;
    box-shadow: inset 0 1px 0 rgba(24, 24, 24, 0.12);
  }
  .ctrl {
    padding: 0.4rem 0.9rem;
    border: 1px solid var(--ink);
    background: transparent;
    cursor: pointer;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.05em;
    color: var(--ink);
  }
  .ctrl:hover:not(:disabled) {
    background: var(--ink);
    color: var(--bg);
  }
  .ctrl:disabled {
    opacity: 0.35;
    cursor: default;
  }
  .ctrl-spacer {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .hint {
    color: var(--ink-muted);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .hint .scene-counter {
    color: var(--ink);
    font-weight: 600;
  }
</style>
