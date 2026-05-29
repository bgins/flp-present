<script lang="ts">
  import type { Scene, Valency } from '../lib/types'
  import { sub } from '../lib/format'
  import Essay from './Essay.svelte'
  import Stage from './Stage.svelte'
  import Rail from './Rail.svelte'
  import Controls from './Controls.svelte'

  let {
    scenes,
    activeIndex,
    forward,
    back,
    reset,
  }: {
    scenes: Scene[]
    activeIndex: number
    forward: () => void
    back: () => void
    reset: () => void
  } = $props()

  const scene = $derived(scenes[activeIndex])

  const valencyColor: Record<Valency, string> = {
    bivalent: 'var(--bivalent)',
    'univalent-0': 'var(--univalent-0)',
    'univalent-1': 'var(--univalent-1)',
  }
</script>

<div class="shell">
  <header class="chrome">
    <span class="brand">:: FLP ::</span>
    <span class="chrome-stat">stage <strong>{scene.chrome.stage}</strong></span>
    <span class="sep">::</span>
    <span class="chrome-stat">
      faulty <strong
        >{scene.chrome.faulty ? sub(scene.chrome.faulty) : '—'}</strong
      >
    </span>
    <span
      class="valency-badge"
      style:color={valencyColor[scene.chrome.valency]}
    >
      {scene.chrome.valency}
    </span>
  </header>

  <div class="stage">
    <Essay {scenes} {activeIndex} />
    <Stage {scene} />
    <Rail {scene} />
  </div>

  <Controls {activeIndex} total={scenes.length} {forward} {back} {reset} />
</div>

<style>
  .shell {
    position: relative;
    display: grid;
    grid-template-rows: auto 1fr auto;
    height: 100vh;
    overflow: hidden;
  }

  .chrome {
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    padding: 0.95rem 2rem 0.75rem;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    box-shadow: inset 0 -1px 0 rgba(24, 24, 24, 0.12);
  }
  .brand {
    font-weight: 700;
    letter-spacing: 0.15em;
  }
  .chrome-stat {
    color: var(--ink-muted);
  }
  .chrome-stat strong {
    color: var(--ink);
    font-weight: 600;
  }
  .sep {
    color: var(--ink-faint);
  }
  .valency-badge {
    margin-left: auto;
    padding: 0.22rem 0.65rem;
    border: 1.5px solid currentColor;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.12em;
  }

  .stage {
    display: grid;
    grid-template-columns: 33fr 52fr 15fr;
    min-height: 0;
    overflow: hidden;
  }
</style>
