<script lang="ts">
  import type { Scene, Verb } from '../lib/types'
  import { sub, formatTarget } from '../lib/format'

  let { scene }: { scene: Scene } = $props()

  const visual = $derived(scene.visual ?? 'canvas')

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
  {#if visual === 'slow-vs-dead'}
    <div class="rail-head">
      <span class="prefix">//</span><span>world A</span>
    </div>
    <div class="rail-kv">
      <span class="k">p₃</span><span class="v slow">alive · slow</span>
    </div>
    <div class="rail-kv">
      <span class="k">future</span><span class="v">may speak again</span>
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>world B</span>
    </div>
    <div class="rail-kv">
      <span class="k">p₃</span><span class="v dead">crashed</span>
    </div>
    <div class="rail-kv">
      <span class="k">future</span><span class="v">will not speak</span>
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>p₁'s view</span>
    </div>
    <div class="rail-kv">
      <span class="k">inbox</span><span class="v same">identical</span>
    </div>
    <div class="rail-kv">
      <span class="k">clock</span><span class="v same">identical</span>
    </div>
    <div class="rail-kv">
      <span class="k">∴</span><span class="v same">same</span>
    </div>

    <div class="rail-head"><span class="prefix">//</span><span>note</span></div>
    <div class="rail-note">
      this is the practical intuition behind the impossibility. Every
      <span class="em">safe</span> protocol can wait; FLP says some adversary makes
      that wait infinite.
    </div>
  {:else if visual === 'lemma2-sxs'}
    <div class="rail-head">
      <span class="prefix">//</span><span>setup</span>
    </div>
    <div class="rail-note">
      assume every initial is univalent.&#160;<span class="em">⇒</span
      >&#160;adjacent C₀ (0-valent) and C₁ (1-valent) exist, differing only in
      <span class="em">p₃.x</span>.
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>config Δ</span>
    </div>
    <div class="rail-kv">
      <span class="k">p₁.x</span><span class="v">0 = 0</span>
    </div>
    <div class="rail-kv">
      <span class="k">p₂.x</span><span class="v">0 = 0</span>
    </div>
    <div class="rail-kv">
      <span class="k">p₃.x</span><span class="v"
        ><span class="v zero">0</span>&#160;≠&#160;<span class="v one">1</span
        ></span
      >
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>schedule σ</span>
    </div>
    <div class="rail-kv">
      <span class="k">faulty</span><span class="v">p₃</span>
    </div>
    <div class="rail-kv">
      <span class="k">steps</span><span class="v">none from p₃</span>
    </div>
    <div class="rail-kv">
      <span class="k">decides</span><span class="v zero">0</span>
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>result</span>
    </div>
    <div class="rail-kv">
      <span class="k">C₀ →</span><span class="v zero">0 ✓</span>
    </div>
    <div class="rail-kv">
      <span class="k">C₁ →</span><span class="v zero">0 ✗</span>
    </div>
    <div class="rail-kv">
      <span class="k"></span><span class="v contra">∴ ⊥</span>
    </div>
  {:else if visual === 'lemma3-set-D'}
    <div class="rail-head">
      <span class="prefix">//</span><span>definitions</span>
    </div>
    <div class="rail-defs">
      <p>
        <span class="term">C</span> <span class="muted">— bivalent config</span>
      </p>
      <p>
        <span class="term">e</span>
        <span class="muted">= (p, m), applicable to C</span>
      </p>
      <p>
        <span class="term">𝒞</span>
        <span class="muted">— configs reachable from C without applying e</span>
      </p>
      <p><span class="term">𝒟</span> <span class="muted">= e(𝒞)</span></p>
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>claim</span>
    </div>
    <div class="rail-note">
      <span class="em">𝒟</span> contains a <span class="em">bivalent</span>
      configuration.
    </div>

    <div class="rail-head"><span class="prefix">//</span><span>why</span></div>
    <div class="rail-note">
      assume not. Then every D ∈ 𝒟 is univalent, with both 0-valent and 1-valent
      members. Pick neighbors C₀, C₁ ∈ 𝒞 whose images differ in valency — Lemma
      1 commutativity (Case 1) or a deciding-run argument (Case 2) gives a
      contradiction.
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>consequence</span>
    </div>
    <div class="rail-note">
      the adversary can <span class="em">defer e</span> through a schedule that lands
      in the bivalent member of 𝒟 — and the system stays undecided.
    </div>
  {:else}
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
  {/if}
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

  /* slow-vs-dead comparison panel */
  .rail-kv {
    display: grid;
    grid-template-columns: 5rem 1fr;
    column-gap: 0.4rem;
    font-size: 13px;
    padding: 0.18rem 0;
    align-items: baseline;
  }
  .rail-kv .k {
    color: var(--ink-faint);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 11px;
  }
  .rail-kv .v {
    color: var(--ink);
  }
  .rail-kv .v.slow {
    color: var(--bivalent);
    font-weight: 600;
  }
  .rail-kv .v.dead {
    color: var(--accent-decide);
    font-weight: 600;
  }
  .rail-kv .v.same {
    color: var(--bivalent);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    font-size: 12px;
  }
  .rail-kv .v.zero {
    color: var(--univalent-0);
    font-weight: 600;
  }
  .rail-kv .v.one {
    color: var(--univalent-1);
    font-weight: 600;
  }
  .rail-kv .v.contra {
    color: var(--accent-decide);
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
  .rail-note {
    font-size: 13px;
    line-height: 1.55;
    color: var(--ink-muted);
    margin-bottom: 0.6rem;
  }
  .rail-note .em {
    color: var(--ink);
    font-weight: 600;
  }

  /* lemma3-set-D definitions panel */
  .rail-defs {
    font-size: 12px;
    line-height: 1.6;
    color: var(--ink);
  }
  .rail-defs p {
    margin: 0.15rem 0;
  }
  .rail-defs .term {
    color: var(--bivalent);
    font-weight: 700;
  }
  .rail-defs .muted {
    color: var(--ink-muted);
  }
</style>
