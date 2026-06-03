<script lang="ts">
  // Desktop-only gate. The presentation is a wide three-column layout that
  // can't be experienced on a phone, so on small viewports we swap the whole
  // app for this screen: the paper title, a teaser visual (the admissibility
  // receive rota), a short "open on desktop" note, and the source links.
  // Toggled purely by media query in App.svelte — no resize listener.
  import { scenes } from '../lib/script'
  import MessageReceive from '../visuals/MessageReceive.svelte'

  const teaser = scenes.find((s) => s.id === 'admissible')
</script>

<div class="mobile-gate">
  <header class="mg-head">
    <span class="mg-brand">:: FLP ::</span>
    <span class="mg-tag">desktop only</span>
  </header>

  <main class="mg-body">
    <h1 class="mg-title">
      Impossibility of Distributed Consensus with One Faulty Process
    </h1>
    <p class="mg-byline">Fischer · Lynch · Paterson — 1985</p>

    {#if teaser}
      <div class="mg-viz"><MessageReceive scene={teaser} /></div>
    {/if}

    <p class="mg-msg">
      This visual walkthrough is built for a desktop screen. Open it on a
      larger display to step through the proof.
    </p>

    <nav class="mg-links">
      <a
        href="https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf"
        target="_blank"
        rel="noopener noreferrer">paper</a
      >
      <a
        href="https://github.com/bgins/flp-present"
        target="_blank"
        rel="noopener noreferrer">presentation</a
      >
    </nav>
  </main>
</div>

<style>
  .mobile-gate {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    overflow-y: auto;
    padding: 1.25rem 1.5rem 2.5rem;
    font-family: 'Geist Mono', monospace;
    color: var(--ink);
  }

  .mg-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-bottom: 0.85rem;
    box-shadow: inset 0 -1px 0 rgba(24, 24, 24, 0.12);
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .mg-brand {
    font-weight: 700;
    letter-spacing: 0.15em;
  }
  .mg-tag {
    padding: 0.2rem 0.55rem;
    border: 1.5px solid var(--bivalent);
    color: var(--bivalent);
    font-weight: 700;
    font-size: 12px;
  }

  .mg-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    flex: 1;
    padding-top: 2rem;
  }
  .mg-title {
    font-size: 21px;
    font-weight: 600;
    line-height: 1.3;
    letter-spacing: -0.01em;
    max-width: 22rem;
  }
  .mg-byline {
    margin-top: 0.7rem;
    font-size: 13px;
    color: var(--ink-muted);
  }

  .mg-viz {
    width: 100%;
    max-width: 24rem;
    margin: 1.5rem 0 0.5rem;
  }
  .mg-viz :global(svg) {
    width: 100%;
    height: auto;
    display: block;
  }

  .mg-msg {
    margin-top: 0.5rem;
    font-size: 15px;
    line-height: 1.6;
    color: var(--ink-muted);
    max-width: 22rem;
  }

  .mg-links {
    display: flex;
    gap: 1.5rem;
    margin-top: 1.75rem;
    font-size: 15px;
  }
  .mg-links a {
    color: var(--bivalent);
    text-decoration: none;
    border-bottom: 1px solid currentColor;
    padding-bottom: 1px;
  }
</style>
