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
    zoomed,
    forward,
    back,
    reset,
    toggleZoom,
  }: {
    scenes: Scene[]
    activeIndex: number
    zoomed: boolean
    forward: () => void
    back: () => void
    reset: () => void
    toggleZoom: () => void
  } = $props()

  const scene = $derived(scenes[activeIndex])

  // Visuals that fill the canvas and carry no data rail — the canvas expands
  // into the rail's column (the infinite-run config-stack scenes).
  const railless = $derived(
    scene.visual === 'config-stack' || scene.visual === 'config-stack-crash'
  )

  const valencyColor: Record<Valency, string> = {
    bivalent: 'var(--bivalent)',
    'univalent-0': 'var(--univalent-0)',
    'univalent-1': 'var(--univalent-1)',
  }

  // Paper's terms for the badge: "0-valent" / "1-valent", not the data slugs.
  const valencyLabel: Record<Valency, string> = {
    bivalent: 'bivalent',
    'univalent-0': '0-valent',
    'univalent-1': '1-valent',
  }
</script>

<div class="shell" class:zoomed>
  <header class="chrome">
    <span class="brand">:: FLP ::</span>
    {#if scene.chrome.stage !== null}
      <span class="chrome-stat" class:muted={scene.chrome.muted}
        >stage <strong>{scene.chrome.stage}</strong></span
      >
    {/if}
    {#if scene.chrome.faulty}
      {#if scene.chrome.stage !== null}<span class="sep">::</span>{/if}
      <span class="chrome-stat"
        >faulty <strong>{sub(scene.chrome.faulty)}</strong></span
      >
    {/if}
    <span
      class="valency-badge"
      style:color={valencyColor[scene.chrome.valency]}
    >
      {valencyLabel[scene.chrome.valency]}
    </span>
  </header>

  <div class="stage" class:railless>
    {#if !zoomed}
      <Essay {scenes} {activeIndex} />
    {/if}
    <Stage {scene} />
    {#if !railless}
      <Rail {scene} />
    {/if}
  </div>

  {#if !zoomed}
    <Controls
      {activeIndex}
      total={scenes.length}
      {forward}
      {back}
      {reset}
      {toggleZoom}
    />
  {:else}
    <footer class="zoom-footer">
      <span>
        scene
        <span class="zoom-counter">{activeIndex + 1} / {scenes.length}</span>
      </span>
      <span class="zoom-title">{scene.head.topic}</span>
      <span>keys ← → · esc</span>
    </footer>
  {/if}

  {#if zoomed}
    <span class="zoom-badge" style:color={valencyColor[scene.chrome.valency]}>
      {valencyLabel[scene.chrome.valency]}
    </span>
  {/if}
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
  /* Paused on a real run stage but not advancing it — de-emphasized. */
  .chrome-stat.muted {
    opacity: 0.4;
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
  .stage.railless {
    grid-template-columns: 33fr 67fr;
  }

  /* Fullscreen-canvas mode (Option A): chrome hidden via CSS; essay and
     controls aren't rendered. Canvas fills left/top/bottom; rail stays. */
  .shell.zoomed .chrome {
    display: none;
  }
  .shell.zoomed .stage {
    grid-template-columns: 1fr 18rem;
  }
  .shell.zoomed .stage.railless {
    grid-template-columns: 1fr;
  }
  .zoom-badge {
    position: absolute;
    top: 0.7rem;
    left: 1rem;
    z-index: 60;
    padding: 0.22rem 0.65rem;
    border: 1.5px solid currentColor;
    background: var(--bg);
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  /* In-flow footer row in zoom (reserves space so the canvas doesn't
     extend under it): keys left, scene counter right. */
  .zoom-footer {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 0.65rem 1.5rem;
    box-shadow: inset 0 1px 0 rgba(24, 24, 24, 0.12);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink-muted);
  }
  .zoom-footer > :first-child {
    justify-self: start;
  }
  .zoom-footer > :last-child {
    justify-self: end;
  }
  /* The scene title, centered — the only place it surfaces in fullscreen,
     where the essay (and its head) is hidden. */
  .zoom-title {
    justify-self: center;
    color: var(--ink);
    font-weight: 600;
  }
  .zoom-counter {
    color: var(--ink);
    font-weight: 600;
  }
</style>
