<script lang="ts">
  import type { Scene, Verb } from '../lib/types'
  import { sub, formatTarget } from '../lib/format'

  let { scene }: { scene: Scene } = $props()

  // Newest trace entries on top.
  const traceRows = $derived([...scene.trace].reverse())

  function verbColor(v: Verb): string {
    return v === 'deliver'
      ? 'var(--bivalent)'
      : v === 'delay'
        ? 'var(--univalent-1)'
        : 'var(--ink-muted)'
  }
</script>

<aside class="rail">
  <div class="rail-head">
    <span class="prefix">//</span><span>buffer</span>
    <span class="count">{scene.buffer.length}</span>
  </div>
  {#each scene.buffer as m (m.id)}
    <div class="b-row">
      <span class="id">[{sub(m.id)}]</span>
      <span
        ><span class="meta">→ {sub(m.to)}</span><span class="pl"
          >{m.payload}</span
        ></span
      >
    </div>
  {/each}

  <div class="b-div">∅ steps</div>
  {#each scene.null_steps as pid (pid)}
    <div class="b-null" class:faulty={pid === scene.chrome.faulty}>
      ({sub(pid)}, ∅){#if pid === scene.chrome.faulty}<span class="tag"
          >faulty</span
        >{/if}
    </div>
  {/each}

  <div class="rail-head">
    <span class="prefix">//</span><span>trace</span>
    <span class="count">{scene.chrome.stage}</span>
  </div>
  {#each traceRows as t (t.stage)}
    <div class="t-row">
      <span class="n">{t.stage}</span>
      <span
        class="v"
        class:step={t.verb === 'step'}
        style:color={verbColor(t.verb)}>{t.verb}</span
      >
      <span class="m">{formatTarget(t.target)}</span>
    </div>
  {/each}
</aside>

<style>
  .rail {
    overflow-y: auto;
    padding: 1.5rem 1.25rem 4rem;
    min-height: 0;
  }
  .rail::-webkit-scrollbar {
    width: 0;
  }

  .rail-head {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: var(--ink-muted);
    margin: 1.6rem 0 0.7rem;
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
  }
  .rail-head:first-child {
    margin-top: 0;
  }
  .rail-head .prefix {
    color: var(--ink-faint);
  }
  .rail-head .count {
    color: var(--ink);
    margin-left: auto;
    font-variant-numeric: tabular-nums;
  }

  .b-row {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 0.5rem;
    padding: 0.3rem 0;
    align-items: baseline;
    font-size: 14px;
  }
  .b-row .id {
    color: var(--bivalent);
    font-weight: 600;
  }
  .b-row .meta {
    color: var(--ink-muted);
  }
  .b-row .pl {
    display: block;
    color: var(--ink);
    opacity: 0.78;
    font-size: 13px;
  }

  .b-div {
    margin: 0.7rem 0 0.4rem;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
    color: var(--ink-faint);
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .b-div::before,
  .b-div::after {
    content: '';
    flex: 1;
    border-top: 1px dashed rgba(24, 24, 24, 0.18);
  }

  .b-null {
    font-size: 14px;
    padding: 0.22rem 0;
    color: var(--ink);
    opacity: 0.85;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .b-null.faulty {
    opacity: 0.4;
  }
  .b-null .tag {
    color: var(--accent-decide);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .t-row {
    display: grid;
    grid-template-columns: 1.6rem 4rem 1fr;
    column-gap: 0.45rem;
    padding: 0.2rem 0;
    align-items: baseline;
    font-size: 14px;
  }
  .t-row .n {
    color: var(--ink-faint);
    font-variant-numeric: tabular-nums;
    text-align: right;
  }
  .t-row .v {
    font-weight: 600;
  }
  .t-row .v.step {
    font-style: italic;
  }
  .t-row .m {
    color: var(--bivalent);
    font-weight: 600;
  }
</style>
