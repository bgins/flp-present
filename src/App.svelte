<script lang="ts">
  import { scenes } from './lib/script'
  import AppShell from './components/AppShell.svelte'

  let activeIndex = $state(0)

  function forward() {
    activeIndex = Math.min(activeIndex + 1, scenes.length - 1)
  }
  function back() {
    activeIndex = Math.max(activeIndex - 1, 0)
  }
  function reset() {
    activeIndex = 0
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') forward()
    else if (e.key === 'ArrowLeft') back()
  }
</script>

<svelte:window onkeydown={onKey} />

<AppShell {scenes} {activeIndex} {forward} {back} {reset} />
