<script lang="ts">
  import type { Scene } from '../lib/types'
  import SceneBlock from './Scene.svelte'

  let { scenes, activeIndex }: { scenes: Scene[]; activeIndex: number } =
    $props()
</script>

<main class="essay">
  {#each scenes as scene, i (scene.id)}
    <SceneBlock {scene} active={i === activeIndex} />
  {/each}
</main>

<style>
  .essay {
    overflow-y: auto;
    padding: 3rem 2.5rem 6rem;
    scroll-behavior: smooth;
    box-shadow: inset -1px 0 0 rgba(24, 24, 24, 0.08);
  }
  .essay::-webkit-scrollbar {
    width: 0;
  }
</style>
