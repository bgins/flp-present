<script lang="ts">
  import { scenes } from './lib/script'

  // Scaffold placeholder. Proves the YAML→types pipeline, font, and
  // palette load. The real three-column shell (AppShell / Essay /
  // Stage / Rail / Controls, per plan §490) replaces this next.
  const scene = scenes[0]
</script>

<main class="scaffold">
  <header class="brand">:: FLP ::</header>
  <p class="count">{scenes.length} scenes loaded</p>

  <section class="scene">
    <div class="head">{scene.head.section} :: {scene.head.topic}</div>
    <p class="quote">{scene.quote.trim()}</p>
    <div class="cite">[ {scene.cite} ]</div>
  </section>
</main>

<style>
  .scaffold {
    max-width: 40rem;
    margin: 4rem auto;
    padding: 0 2rem;
  }
  .brand {
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
  .count {
    margin: 0.5rem 0 3rem;
    font-size: 13px;
    color: var(--ink-muted);
  }
  .head {
    margin-bottom: 1.2rem;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--ink-muted);
  }
  .quote {
    font-style: italic;
    font-size: 19px;
    line-height: 1.65;
  }
  .cite {
    margin-top: 0.8rem;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: var(--ink-muted);
  }
</style>
