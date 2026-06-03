<script lang="ts">
  import type { Scene, Verb } from '../lib/types'
  import { sub } from '../lib/format'

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

    <div class="rail-head">
      <span class="prefix">//</span><span>the bind</span>
    </div>
    <div class="rail-note">
      There's no bound on how long a message can take. A slow p₃ looks
      <span class="em">identical</span> to a dead one. Wait, and you might wait forever.
      Act, and you might have quit on a live process. No timeout is long enough to
      be sure.
    </div>
  {:else if visual === 'process-state'}
    <div class="rail-head">
      <span class="prefix">//</span><span>registers</span>
    </div>
    <div class="rail-defs">
      <p>
        <span class="term">x<sub>p</sub></span>
        <span class="muted">— input · the value p proposes, fixed</span>
      </p>
      <p>
        <span class="term">y<sub>p</sub></span>
        <span class="muted">— output · p's decision</span>
      </p>
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>output values</span>
    </div>
    <div class="rail-legend">
      <div class="leg-row">
        <span class="leg-sym blank">b</span>
        <span class="leg-desc">blank — no decision written yet, every y starts here</span>
      </div>
      <div class="leg-row">
        <span class="leg-sym"
          ><span class="zero">0</span>&#160;/&#160;<span class="one">1</span></span
        >
        <span class="leg-desc">a decision — written once, never changes</span>
      </div>
    </div>
  {:else if visual === 'valency-tree'}
    <div class="rail-head">
      <span class="prefix">//</span><span>theorem 1</span>
    </div>
    <div class="rail-note">
      No consensus protocol is totally correct in spite of one fault.
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>valency</span>
    </div>
    <div class="rail-defs">
      <p>
        <span class="term">bivalent</span>
        <span class="muted">— both 0 and 1 stay reachable</span>
      </p>
      <p>
        <span class="term">univalent</span>
        <span class="muted">— locked to one value, even while y<sub>p</sub> is blank</span>
      </p>
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>the proof</span>
    </div>
    <div class="rail-defs">
      <p>
        <span class="term">Lemma 2</span>
        <span class="muted">— a bivalent initial exists</span>
      </p>
      <p>
        <span class="term">Construction</span>
        <span class="muted">— keep it bivalent forever</span>
      </p>
    </div>
  {:else if visual === 'correctness'}
    {#if scene.id === 'partial'}
      <div class="rail-head">
        <span class="prefix">//</span><span>partial correctness</span>
      </div>
      <div class="rail-defs">
        <p>
          <span class="term">agreement</span>
          <span class="muted">— no config has two decision values</span>
        </p>
        <p>
          <span class="term">non-trivial</span>
          <span class="muted">— both 0 and 1 stay reachable</span>
        </p>
      </div>
      <div class="rail-head">
        <span class="prefix">//</span><span>accessible</span>
      </div>
      <div class="rail-note">Reachable from an initial config.</div>
    {:else}
      <div class="rail-head">
        <span class="prefix">//</span><span>total correctness</span>
      </div>
      <div class="rail-defs">
        <p>
          <span class="term">agreement</span>
          <span class="muted">— no config has two decision values</span>
        </p>
        <p>
          <span class="term">non-trivial</span>
          <span class="muted">— both 0 and 1 stay reachable</span>
        </p>
        <p>
          <span class="term">terminating</span>
          <span class="muted">— every admissible run decides</span>
        </p>
      </div>
      <div class="rail-head">
        <span class="prefix">//</span><span>admissible</span>
      </div>
      <div class="rail-note">
        At most one process is faulty, and every message to a live process is
        eventually delivered.
      </div>
      <div class="rail-head">
        <span class="prefix">//</span><span>deciding run</span>
      </div>
      <div class="rail-note">A run where some process actually decides.</div>
    {/if}
  {:else if visual === 'references'}
    <div class="rail-head">
      <span class="prefix">//</span><span>links</span>
    </div>
    <div class="ref-links">
      <a
        class="ref-link"
        href="https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="rl-title">paper</span><span class="rl-sub"
          >JACM 1985 · full text</span
        >
      </a>
      <a
        class="ref-link"
        href="https://www.the-paper-trail.org/post/2008-08-13-a-brief-tour-of-flp-impossibility/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="rl-title">a tour</span><span class="rl-sub"
          >Robinson · the Paper Trail</span
        >
      </a>
      <a
        class="ref-link"
        href="https://www.cs.yale.edu/homes/aspnes/pinewiki/FischerLynchPaterson.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="rl-title">notes</span><span class="rl-sub"
          >Aspnes · Yale</span
        >
      </a>
      <a
        class="ref-link"
        href="https://github.com/bgins/flp-present"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span class="rl-title">presentation</span><span class="rl-sub"
          >bgins/flp-present</span
        >
      </a>
    </div>
  {:else if visual === 'lemma1-commute'}
    <div class="rail-head">
      <span class="prefix">//</span><span>definitions</span>
    </div>
    <div class="rail-defs">
      <p>
        <span class="term">σ</span>
        <span class="muted">— a schedule (a sequence of steps)</span>
      </p>
      <p>
        <span class="term">P(σ)</span>
        <span class="muted">— the processes σ touches</span>
      </p>
      <p>
        <span class="term">disjoint</span>
        <span class="muted">— P(σ₁) ∩ P(σ₂) = ∅</span>
      </p>
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>claim</span>
    </div>
    <div class="rail-note">
      <span class="em">σ₁</span> and <span class="em">σ₂</span> commute:
      σ₂(σ₁(C)) = σ₁(σ₂(C)) = <span class="em">C₃</span>.
    </div>

    <div class="rail-head"><span class="prefix">//</span><span>why</span></div>
    <div class="rail-note">
      A step depends only on the process's own state and the messages addressed
      to it. Disjoint schedules never touch the same process, so they can run in
      any order and produce the same result.
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>Lemma 3</span>
    </div>
    <div class="rail-note">
      Uses commutativity to swap two events on different processes.
    </div>
  {:else if visual === 'lemma2-sxs'}
    <div class="rail-head">
      <span class="prefix">//</span><span>setup</span>
    </div>
    <div class="rail-note">
      Assume no bivalent initial. By partial correctness, C₀ is 0-valent and C₁
      is 1-valent, differing only in <span class="em">p₃</span>.
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>inputs</span>
    </div>
    <div class="rail-kv">
      <span class="k">p₁</span><span class="v">0 = 0</span>
    </div>
    <div class="rail-kv">
      <span class="k">p₂</span><span class="v">1 = 1</span>
    </div>
    <div class="rail-kv">
      <span class="k">p₃</span><span class="v"
        ><span class="v zero">0</span>&#160;≠&#160;<span class="v one">1</span
        ></span
      >
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>schedule <span class="sig">σ</span></span>
    </div>
    <div class="rail-kv">
      <span class="k">faulty</span><span class="v">p₃</span>
    </div>
    <div class="rail-kv">
      <span class="k">steps</span><span class="v">same steps, none from p₃</span>
    </div>
    <div class="rail-kv">
      <span class="k">decides</span><span class="v">v</span>
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>result</span>
    </div>
    <div class="rail-note">
      ∴ one of <span class="em">C₀</span>, <span class="em">C₁</span> is bivalent.
      <span class="contra">⊥</span>
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
      Assume not. Then every D ∈ 𝒟 is univalent, with both 0-valent and 1-valent
      members. Take neighbors C₀, C₁ ∈ 𝒞 whose images differ in valency. Lemma 1
      swaps the two events (Case 1, different processes), or a deciding run (Case
      2) gives the contradiction.
    </div>

    <div class="rail-head">
      <span class="prefix">//</span><span>consequence</span>
    </div>
    <div class="rail-note">
      The adversary can <span class="em">defer e</span> through a schedule that lands
      in the bivalent member of 𝒟, so the system stays undecided.
    </div>
  {:else if visual === 'lemma3-case1'}
    <div class="rail-head">
      <span class="prefix">//</span><span>case 1</span>
    </div>
    <div class="rail-note">
      e and e′ run on different processes, so by Lemma 1 they commute. That makes
      <span class="em">D₁ = e′(D₀)</span>, a successor of the 0-valent D₀.
    </div>
    <div class="rail-head">
      <span class="prefix">//</span><span>result</span>
    </div>
    <div class="rail-note">
      A successor of a 0-valent config is 0-valent. So D₁ cannot be 1-valent.
      <span class="contra">⊥</span>
    </div>
  {:else if visual === 'lemma3-case2'}
    <div class="rail-head">
      <span class="prefix">//</span><span>case 2</span>
    </div>
    <div class="rail-note">
      e and e′ run on the same process p. A deciding run σ keeps p silent, so
      <span class="em">A</span> is univalent.
    </div>
    <div class="rail-head">
      <span class="prefix">//</span><span>result</span>
    </div>
    <div class="rail-note">
      σ keeps D₀ 0-valent at E₀ and D₁ 1-valent at E₁. By Lemma 1, A reaches
      both, so A is bivalent too. <span class="contra">⊥</span>
    </div>
  {:else}
    <div class="rail-head">
      <span class="prefix">//</span><span>buffer</span>
      <span class="count">{scene.buffer.length}</span>
    </div>
    {#each scene.buffer as m (m.id)}
      <div class="b-row">
        <span class="id">[{m.id[0]}<sub>{m.id.slice(1)}</sub>]</span>
        <span
          ><span class="meta">to {sub(m.to)}</span><span class="pl"
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
        <span class="m"
          >{#if /^m\d+$/.test(t.target)}[{t.target[0]}<sub
              >{t.target.slice(1)}</sub
            >]{:else}{sub(t.target)}{/if}</span
        >
      </div>
    {/each}

    {#if scene.id === 'buffer'}
      <div class="rail-head">
        <span class="prefix">//</span><span>protocol</span>
      </div>
      <div class="rail-note">
        We use a simple voting protocol, but FLP holds for any
        distributed consensus protocol. In our protocol, each process
        broadcasts its vote when it wants.
      </div>
    {/if}
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
    font-size: 15px;
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
  /* keep the paper's lowercase σ in an otherwise-uppercased head */
  .rail-head .sig {
    text-transform: none;
  }

  .b-row {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: 0.5rem;
    padding: 0.3rem 0;
    align-items: baseline;
    font-size: 15px;
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
    font-size: 14px;
  }

  .b-div {
    margin: 0.7rem 0 0.4rem;
    font-size: 14px;
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
    font-size: 15px;
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
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .t-row {
    display: grid;
    grid-template-columns: 1.6rem 4rem 1fr;
    column-gap: 0.45rem;
    padding: 0.2rem 0;
    align-items: baseline;
    font-size: 15px;
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
    font-size: 15px;
    padding: 0.18rem 0;
    align-items: baseline;
  }
  .rail-kv .k {
    color: var(--ink-faint);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 13px;
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
    font-size: 14px;
  }
  .rail-kv .v.zero {
    color: var(--univalent-0);
    font-weight: 600;
  }
  .rail-kv .v.one {
    color: var(--univalent-1);
    font-weight: 600;
  }
  .rail-note {
    font-size: 14px;
    line-height: 1.55;
    color: var(--ink-muted);
    margin-bottom: 0.6rem;
  }
  .rail-note .em {
    color: var(--ink);
    font-weight: 600;
  }
  .rail-note .contra {
    color: var(--accent-decide);
    font-weight: 700;
  }

  /* references — clickable links list */
  .ref-links {
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }
  .ref-link {
    text-decoration: none;
    color: var(--ink);
  }
  .ref-link .rl-title {
    display: block;
    font-size: 15px;
    font-weight: 600;
  }
  .ref-link .rl-sub {
    display: block;
    font-size: 12px;
    color: var(--ink-muted);
  }
  .ref-link:hover .rl-title {
    color: var(--bivalent);
  }

  /* lemma3-set-D definitions panel */
  .rail-defs {
    font-size: 14px;
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

  /* process-state register legend */
  .rail-legend {
    font-size: 14px;
    line-height: 1.5;
  }
  .leg-row {
    display: grid;
    grid-template-columns: 3rem 1fr;
    column-gap: 0.5rem;
    padding: 0.28rem 0;
    align-items: baseline;
  }
  .leg-sym {
    font-weight: 700;
    color: var(--ink);
    font-variant-numeric: tabular-nums;
  }
  .leg-sym.blank {
    color: var(--ink-faint);
  }
  .leg-sym .zero {
    color: var(--univalent-0);
  }
  .leg-sym .one {
    color: var(--univalent-1);
  }
  .leg-desc {
    color: var(--ink-muted);
  }
</style>
