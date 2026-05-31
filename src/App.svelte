<script lang="ts">
  import { scenes } from './lib/script'
  import AppShell from './components/AppShell.svelte'

  let activeIndex = $state(0)
  let zoomed = $state(false)

  function forward() {
    activeIndex = Math.min(activeIndex + 1, scenes.length - 1)
  }
  function back() {
    activeIndex = Math.max(activeIndex - 1, 0)
  }
  function reset() {
    activeIndex = 0
  }
  function toggleZoom() {
    zoomed = !zoomed
  }

  // Latch the toggle keys' physical down-state so a held key fires exactly
  // once. We can't trust e.repeat here (unreliable), so we clear the latch
  // on keyup instead.
  let escDown = false
  let fDown = false

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === 'Escape') escDown = false
    else if (e.key === 'f' || e.key === 'F') fDown = false
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') forward()
    else if (e.key === 'ArrowLeft') back()
    else if (e.key === 'f' || e.key === 'F') {
      if (fDown) return
      fDown = true
      toggleZoom()
    }
    else if (e.key === 'Escape') {
      // Held Esc fires once (latch); release Esc and press again to toggle
      // again. Shift+Esc toggles zoom (undocumented, personal shortcut);
      // plain Esc exits (the UI-advertised way out of fullscreen).
      if (escDown) return
      escDown = true
      if (e.shiftKey) toggleZoom()
      else zoomed = false
    }
  }
</script>

<svelte:window onkeydown={onKey} onkeyup={onKeyUp} />

<AppShell
  {scenes}
  {activeIndex}
  {zoomed}
  {forward}
  {back}
  {reset}
  {toggleZoom}
/>
