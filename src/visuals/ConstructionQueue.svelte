<script lang="ts">
  // construction-q (scene: construction). The stage rule made mechanical: a
  // rotating process queue (head takes a step), per-process message queues in
  // earliest-first order, and the footer spelling out the stage / rotation /
  // admissibility. Bespoke geometry per sketches/05-construction-queue.html.
  // Tspan-heavy + fallback-glyph labels use alphabetic baseline (see memory:
  // svelte-svg-text gotchas); &#160; holds gaps in literal template text.
  const slots = [
    { x: 180, label: 'p₁', cls: 'head', top: 'HEAD ▶', bot: 'this stage' },
    { x: 400, label: 'p₂', cls: '', top: '·', bot: 'next' },
    { x: 620, label: 'p₃', cls: 'faulty', top: '·', bot: '[ faulty ]' },
  ]

  type Msg = [string, string] // [id, payload]
  // Queues are per-recipient, earliest-first (analysis.md §250). Single `vote v`
  // throughout, consistent with the run: p₁ only ever hears p₂'s `vote 1`, p₂
  // only ever hears p₁'s `vote 0` (each keeps receiving the opposite — which is
  // why neither converges). p₃ is faulty, so its queue (the opening m2·m4·m6,
  // still there) is never received and only grows.
  const columns: {
    x: number
    label: string
    faulty: boolean
    msgs: Msg[]
    elide: string
  }[] = [
    {
      x: 180,
      label: "p₁'s queue",
      faulty: false,
      msgs: [
        ['m8', 'vote 1'],
        ['m10', 'vote 1'],
        ['m12', 'vote 1'],
      ],
      elide: '⋮',
    },
    {
      x: 400,
      label: "p₂'s queue",
      faulty: false,
      msgs: [
        ['m9', 'vote 0'],
        ['m11', 'vote 0'],
        ['m13', 'vote 0'],
      ],
      elide: '⋮',
    },
    {
      x: 620,
      label: "p₃'s queue",
      faulty: true,
      msgs: [
        ['m2', 'vote 0'],
        ['m4', 'vote 1'],
        ['m6', 'vote 0'],
      ],
      elide: '⋮  (never received)',
    },
  ]
  const msgRowY = [270, 310, 346]
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <!-- ── PROCESS QUEUE ── -->
  <text class="cq-section-head" x="40" y="40"
    ><tspan class="prefix">//&#160;</tspan><tspan>process queue</tspan></text
  >
  <line class="cq-rule-line" x1="40" y1="48" x2="760" y2="48" />

  {#each slots as s (s.label)}
    <g class="cq-slot {s.cls}" transform="translate({s.x}, 110)">
      <rect x="-66" y="-44" width="132" height="88" rx="3" />
      <text class="badge" y="-26">{s.top}</text>
      <text class="label" y="2">{s.label}</text>
      <text class="badge" y="26">{s.bot}</text>
    </g>
  {/each}

  <text class="cq-rot-label" x="400" y="177"
    >↻ HEAD steps · rotates to back of queue</text
  >

  <line class="cq-rule-line" x1="40" y1="194" x2="760" y2="194" />

  <!-- ── PER-PROCESS MESSAGE QUEUES ── -->
  <text class="cq-section-head" x="40" y="210"
    ><tspan class="prefix">//&#160;</tspan><tspan>per-process pending</tspan
    ><tspan class="em">&#160;&#160;·&#160;&#160;earliest-first ordering</tspan
    ></text
  >

  {#each columns as col (col.x)}
    <text class="cq-col-head" class:faulty={col.faulty} x={col.x} y="242"
      ><tspan class="pre">[&#160;</tspan>{col.label}<tspan class="pre"
        >&#160;]</tspan
      ></text
    >
    {#each col.msgs as [id, pl], r (id)}
      <g
        class="cq-msg"
        class:earliest={!col.faulty && r === 0}
        class:faulty={col.faulty}
        transform="translate({col.x}, {msgRowY[r]})"
      >
        <rect x="-72" y="-16" width="144" height="32" rx="2" />
        <text class="id" x="-60" y="0"
          >[{id[0]}<tspan class="cq-num">{id.slice(1)}</tspan>]</text
        >
        <text class="pl" x="-22" y="0">{pl}</text>
      </g>
    {/each}
    <text class="cq-elide" x={col.x} y="382">{col.elide}</text>
  {/each}

  <line class="cq-rule-line" x1="40" y1="430" x2="760" y2="430" />

  <!-- ── STAGE RULE FOOTER ── -->
  <text class="cq-section-head" x="40" y="459"
    ><tspan class="prefix">//&#160;</tspan><tspan>this stage's step</tspan
    ></text
  >
  <rect class="cq-rule-box" x="40" y="475" width="720" height="115" rx="3" />

  <text class="cq-rule-text" x="62" y="500"
    ><tspan class="step">stage 12 ::</tspan><tspan
      >&#160;&#160;HEAD =&#160;</tspan
    ><tspan class="pid">p₁</tspan><tspan
      >&#160;&#160;takes a step&#160;&#160;·&#160;&#160;</tspan
    ><tspan class="verb-recv">receives</tspan><tspan>&#160;&#160;</tspan><tspan
      class="em">[m₈]</tspan
    ><tspan>&#160;&#160;(its earliest)&#160;&#160;·&#160;&#160;</tspan><tspan
      class="verb-rot">rotates to back</tspan
    ></text
  >

  <text class="cq-rule-text" x="62" y="524"
    ><tspan class="step">stage 13 ::</tspan><tspan
      >&#160;&#160;queue becomes&#160;&#160;</tspan
    ><tspan class="arr">[&#160;</tspan><tspan class="pid">p₂</tspan><tspan
      class="arr">&#160;&#160;</tspan
    ><tspan class="pid">p₃</tspan><tspan class="arr">&#160;&#160;</tspan><tspan
      class="pid">p₁</tspan
    ><tspan class="arr">&#160;]</tspan></text
  >

  <text class="cq-rule-text" x="62" y="556"
    ><tspan class="step">why it's admissible ::</tspan><tspan
      >&#160;&#160;every nonfaulty&#160;</tspan
    ><tspan class="pid">p</tspan><tspan
      >&#160;&#160;reaches HEAD infinitely often</tspan
    ></text
  >
  <text class="cq-rule-text" x="62" y="578"
    ><tspan class="arr">&#160;&#160;⇒&#160;&#160;</tspan><tspan
      >every message is eventually delivered</tspan
    ></text
  >
</svg>

<style>
  .cq-section-head {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    fill: var(--ink-muted);
    /* Alphabetic: styled tspans (prefix/em) baseline-shift under middle. */
    dominant-baseline: alphabetic;
  }
  .cq-section-head .prefix {
    fill: var(--ink-faint);
  }
  .cq-section-head .em {
    fill: var(--ink);
    font-weight: 700;
  }

  .cq-rule-line {
    stroke: var(--ink-faint);
    stroke-width: 0.8;
    stroke-dasharray: 1.5 2.5;
    opacity: 0.8;
  }

  /* Process-queue slots */
  .cq-slot rect {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 1.5;
  }
  .cq-slot.head rect {
    stroke: var(--bivalent);
    stroke-width: 2.4;
  }
  .cq-slot.faulty rect {
    stroke: var(--accent-decide);
    stroke-dasharray: 3 2;
  }
  .cq-slot text {
    font-family: 'Geist Mono', monospace;
    text-anchor: middle;
    dominant-baseline: middle;
    fill: var(--ink);
  }
  .cq-slot .label {
    font-size: 18px;
    font-weight: 700;
  }
  .cq-slot .badge {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    fill: var(--ink-muted);
    text-transform: uppercase;
  }
  .cq-slot.head .badge {
    fill: var(--bivalent);
  }
  .cq-slot.faulty .label {
    fill: var(--accent-decide);
  }
  .cq-slot.faulty .badge {
    fill: var(--accent-decide);
  }

  .cq-rot-label {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    fill: var(--ink-muted);
    text-anchor: middle;
    /* Alphabetic: the ↻ is a fallback glyph. */
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 3;
  }

  /* Per-process message columns */
  .cq-col-head {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    text-anchor: middle;
    /* Alphabetic: bracket tspans baseline-shift under middle. */
    dominant-baseline: alphabetic;
    letter-spacing: 0.06em;
    fill: var(--ink);
  }
  .cq-col-head .pre {
    fill: var(--ink-faint);
  }
  .cq-col-head.faulty {
    fill: var(--accent-decide);
  }

  .cq-msg rect {
    fill: var(--bg-raised);
    stroke: var(--ink-faint);
    stroke-width: 1;
  }
  .cq-msg.earliest rect {
    stroke: var(--bivalent);
    stroke-width: 2;
  }
  .cq-msg.faulty rect {
    stroke: var(--accent-decide);
    stroke-dasharray: 2 2;
    opacity: 0.6;
  }
  .cq-msg text {
    font-family: 'Geist Mono', monospace;
    dominant-baseline: middle;
  }
  .cq-msg .id {
    font-size: 13px;
    font-weight: 700;
    fill: var(--bivalent);
  }
  /* Real subscript (normal digits, smaller + lowered) so two-digit ids stay
     tight, instead of floaty full-width Unicode subscript glyphs. */
  .cq-num {
    font-size: 0.72em;
    baseline-shift: -0.34em;
  }
  .cq-msg .pl {
    font-size: 13px;
    fill: var(--ink);
    opacity: 0.78;
  }
  .cq-msg.faulty .id {
    fill: var(--accent-decide);
    opacity: 0.6;
  }
  .cq-msg.faulty .pl {
    fill: var(--ink-muted);
    opacity: 0.5;
  }

  .cq-elide {
    font-family: 'Geist Mono', monospace;
    font-size: 14px;
    fill: var(--ink-faint);
    text-anchor: middle;
    dominant-baseline: middle;
  }

  /* Stage-rule footer */
  .cq-rule-box {
    fill: var(--bg-raised);
    fill-opacity: 0.6;
    stroke: var(--bivalent);
    stroke-width: 1.4;
    stroke-dasharray: 4 3;
    opacity: 0.95;
  }
  .cq-rule-text {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    fill: var(--ink);
    /* Alphabetic: many styled tspans per line would baseline-shift under middle. */
    dominant-baseline: alphabetic;
  }
  .cq-rule-text .step {
    fill: var(--ink-muted);
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.18em;
  }
  .cq-rule-text .em {
    fill: var(--bivalent);
    font-weight: 700;
  }
  .cq-rule-text .pid {
    fill: var(--ink);
    font-weight: 700;
  }
  .cq-rule-text .verb-recv {
    fill: var(--bivalent);
    font-weight: 700;
  }
  .cq-rule-text .verb-rot {
    fill: var(--ink-muted);
    font-style: italic;
  }
  .cq-rule-text .arr {
    fill: var(--ink-faint);
  }
</style>
