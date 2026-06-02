# FLP Demo — plan

Interactive visualization of Fischer / Lynch / Paterson (1985),
*"Impossibility of Distributed Consensus with One Faulty Process"*,
for a presentation. The point: make the proof's adversary
construction *visible* — the presenter clicks the right delivery
at each step and the audience watches the system stay bivalent
forever.

## Goals

- **Faithful to the paper.** Use FLP's exact terminology
  (configuration, schedule, valency, etc.) so attendees recognize
  the visualization as a rendering of what they read.
- **Presenter-controllable scheduling.** The whole pedagogy hinges
  on the adversary's choice at each step; the UI must surface
  that choice cleanly.
- **Static-deploy friendly.** One URL, no backend, hostable on
  GitHub Pages or similar. Audience can pull it up after the talk.
- **Projection-friendly.** Light theme, high contrast, large mono
  glyphs.

## Non-goals

- Real networking (no libp2p, no real processes).
- Generality across consensus algorithms — pick one concrete
  algorithm from the paper (or simplest equivalent) and stick to
  it.
- Animation polish beyond what serves the proof's clarity.

## Stack

- **Svelte 5** for reactive bindings (process state ↔ SVG attrs).
- **Vite** dev + build. Static bundle output.
- **TypeScript** throughout — the scene-snapshot schema is a typed
  data contract (`src/lib/types.ts`), validated at build.
- **Build-time YAML** via `@rollup/plugin-yaml`: `src/script.yaml`
  is imported and parsed at build into typed `Scene` objects, no
  runtime fetch (`src/lib/script.ts`).
- **SVG** for the network diagram (scales perfectly on projectors,
  every element is a DOM node we can attach handlers to).
- **No fab, no Tauri.** Different project, different aesthetic
  identity, no offline-binary need.
- **Geist Mono** (or IBM Plex Mono / JetBrains Mono fallback) for
  all text.

## Aesthetic — LOCKED in `sketches/00-canvas-narrated.html`

Light cypherpunk, projection-friendly. Terminal-typographic feel
borrowed from passdemo's chrome bar / verb overlay vocabulary,
combined with academic-paper sensibility (italic quotes,
guillemets, hanging cite tags).

**Palette** (used verbatim in all sketches):

| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#f6f3e9` | Body background (warm off-white, slight cream) |
| `bg-raised` | `#fefdf8` | Process node fills, sidebar surface |
| `ink` | `#181818` | Primary text, borders, channel lines |
| `ink-muted` | `#5a5550` | Secondary text, timestamps, presenter notes |
| `ink-faint` | `#a8a39c` | Tertiary separators, scene-head dividers |
| `bivalent` | `#3030dd` | Bivalent configurations, message text, primary accent |
| `univalent-0` | `#0a7a3a` | 0-univalent / decided-0 / `deliver` verb |
| `univalent-1` | `#b8650a` | 1-univalent / decided-1 / `delay` verb |
| `accent-decide` | `#a51818` | Terminal decision banner, faulty-process indicator |

**Decoration**:

- SVG-noise grain over the body at opacity 0.06 — paper texture.
- Bracket motif: `[`, `]`, `<`, `>`, `::` as visual delimiters,
  especially around scene heads (`:: § 2 :: the buffer`) and
  message IDs (`[m₇]`).
- Hairlines (`inset … rgba(24,24,24,0.08)`) instead of borders
  for column boundaries — the page reads as one continuous
  surface.

**Type** — locked sizes for projection legibility (1080p, ~30 ft):

| Element | Size |
| --- | --- |
| Quote (essay body) | 19px italic, 1.65 line-height |
| Guillemets `»…«` | 22px |
| Note (presenter aside) | 15px |
| Scene head / cite | 13px |
| Chrome bar / controls / buffer-trace rows | 14px |
| Buffer divider / null tag | 12px |
| Process label (in SVG) | 22px |
| Process register (`x=0`, `y=b`) | 11px (scales w/ SVG canvas) |
| Message label id / arrow | 13–14px (scales w/ SVG) |
| Message payload | 12px (scales w/ SVG) |

Geist Mono everywhere. SVG sizes are in viewBox units —
they scale ~1.25× on a 1080p display because the canvas column
is wider than the viewBox.

**Message label rendering** (locked in sketch5):
- Single inline token per channel: `mN::payload ▶` (or `◀ mN::payload` when channel angle would render text upside-down).
- `paint-order: stroke fill` with 2.5px cream stroke for halo —
  channel line shows through gaps between glyphs.
- Tight `::` separator: `letter-spacing: -0.22em`.
- Offset perpendicular to channel: 22px on horizontal channels,
  28px on diagonals (perceptual compensation — horizontal text in
  open space reads as further from the line at equal distance).

## Layout — LOCKED in `sketches/00-canvas-narrated.html` (three-column narrated)

```
┌──────────────────────────────────────────────────────────────────┐
│ :: FLP :: stage 12  ::  faulty p₃            [ bivalent ] badge  │  ← chrome
├──────────────────────┬────────────────────────────┬──────────────┤
│                      │                            │ // buffer  3 │
│  § 2 :: ∅ event      │                            │ [m₃]         │
│   ▸                  │      p₁ ─────── p₂         │   → p₂       │
│                      │       \        /           │   vote 1     │
│  »the event (p,∅)    │        \      /            │ [m₇]         │
│  can always be       │         \    /             │   → p₃       │
│  applied to C…«      │          \  /              │   vote 0     │
│                      │           ●  p₃ (faulty)   │ ...          │
│  [ paper §2 ]        │                            │              │
│                      │                            │ ∅ steps      │
│  ▸ this is the move  │                            │ (p₁,∅)       │
│    the adversary     │                            │ (p₂,∅)       │
│    can always make…  │                            │ (p₃,∅)faulty │
│                      │                            │              │
│  (next scene faded)  │                            │ // trace  12 │
│  ...                 │                            │ 12 delay [m₆]│
│                      │                            │ 11 deliver…  │
├──────────────────────┴────────────────────────────┴──────────────┤
│ ◂ back  ▸ forward  ⏵ play  ⟳ reset       scene 3/5 :: keys ← →   │
└──────────────────────────────────────────────────────────────────┘
```

- **Chrome bar** (top): brand, stage counter, faulty process,
  valency badge. Borderless except for a hairline rule below.
- **Essay column** (~33% width): scrolling list of paper passages.
  Each scene is a quote (italic Geist Mono, hanging guillemets) +
  cite tag + optional presenter note. Inactive scenes faded to
  opacity 0.28; active scene at full opacity with `▸` margin
  marker. No box around scenes — just typographic rhythm.
- **Canvas column** (~52% width): the network SVG at full
  height. Three processes, channels as quadratic Bézier curves,
  inline message tokens (`mN::payload ▶`) along channels with
  cream paint-order halo. Process nodes show both `x` and `y`
  registers per paper §2.
- **Data rail** (~15% width): buffer + trace stacked vertically.
  `// buffer` and `// trace` typographic headers (no panel
  borders). Buffer entries are `[id]` + `→ recipient` + payload
  on two lines. `∅ steps` divider section lists `(p, ∅)` events.
  Trace rows are `stage` + `verb` + `target` with color-coded
  verbs (`deliver` bivalent, `delay` orange, `step` italic muted).
- **Bottom controls**: `◂ back / ▸ forward / ⏵ play / ⟳ reset`.
  In narrated mode, ◂/▸ advance the SCENE — scroll the essay AND
  step the visualization in lockstep. Hint on the right:
  `scene N / M :: keys ← →`.

**Sketch directory layout**:
- `sketches/00-canvas-narrated.html` — the locked design
  reference (formerly `sketch5.html`). Default scene visual:
  full 3-process network in the canvas column.
- `sketches/01-slow-vs-dead.html` — scene 2, two parallel
  networks with identical p₁ observation.
- `sketches/02-valency-tree.html` — scenes 7-8, reachability
  tree making V := {decision values reachable from C} visible.
- `sketches/03-lemma2-sidebyside.html` — scene 9, two adjacent
  initials + identical schedule → same decision → contradiction.
- `sketches/04-lemma3-set-D.html` — scene 10, C → 𝒞 → e → 𝒟
  with the bivalent member of 𝒟 highlighted.
- `sketches/05-construction-queue.html` — scene 11, process
  queue + per-process message order + the head-takes-step rule.
- `archive/sketch1-dashboard.html` … `sketch4-projection-type.html`
  — early-iteration layouts, kept for comparison only.

All sketches share the locked shell from `00-canvas-narrated.html`
(chrome bar, essay column, rail, bottom controls). What varies
per scene is the SVG content in the canvas column.

**Source-control policy.** Sketches are tracked in git as the
current design spec, but on a *retire-when-superseded* rule: once a
sketch is realized as its Svelte component, delete the sketch in
that same commit (e.g. "Canvas.svelte supersedes
sketches/00-canvas-narrated.html"). `main`'s working tree then
shows only live artifacts; the design exploration stays recoverable
from history. This is safe because the durable spec — palette, type
scale, message-rendering math, channel geometry — already lives in
this document, so retiring a sketch's HTML loses nothing
irreplaceable. `archive/` is gitignored: local scratch for rejected
iterations, never part of the public repo.

**Sketch fidelity — spacing.** The sketches define geometry, layout,
palette, and type, but are not pixel-exact for *intra-text spacing*:
raw SVG/HTML collapses runs of whitespace, so the sketches' padding
spaces (column gaps, aligned colons) don't render as authored. The
Svelte ports restore that intended alignment with `&#160;`
(non-breaking space), which both Svelte and SVG preserve. Where this
diverges from the sketch's *rendered* output, the build wins — it's
the alignment the sketch source was reaching for. First instance:
`SlowVsDead`'s p₁ observation boxes, where the `vote` column and the
`clock :` colon now line up with the `from pₙ :` rows (the raw sketch
flattened them). Verify ported text spacing with `element.textContent`,
not by eye.

**Other intentional divergences from the sketches.** Small layout
tweaks made during porting that the sketch didn't have:

- `Lemma3SetD` — the 𝒞 / 𝒟 region-box labels are nudged up ~4px from
  the frame's bottom edge for padding beneath (the sketch placed them
  flush against the border).
- `Lemma3SetD` — the adversary-takeaway line is a left-aligned bullet
  whose `▸` is a **drawn triangle** (`<polygon>`), not a text glyph. The
  sketch used a tiny centered text `▸` that read as a stray speck and (when
  enlarged) baseline-aligned high; a drawn shape gives font-independent
  size and vertical centering.
- `Lemma3SetD` — the faint bottom rule is moved up to sit between the
  diagram and the legend/takeaway footer, as a real section divider; the
  sketch left it at the canvas bottom with nothing below it.
- `Lemma3SetD` — the "apply e = (p, m) to each" label uses an alphabetic
  baseline so the styled `e = (p, m)` run aligns with the rest; under the
  sketch's middle baseline Chrome renders that run raised (superscript-ish),
  even though it's the same font.
- `Canvas` / `SlowVsDead` / `Lemma2Sxs` — process-register lines (`x=0`,
  `y=b`) use an alphabetic baseline so the plain `=N` run sits with the
  styled tspans (under middle, Chrome drops it). Canvas needs the rule
  scoped as `.process-node .process-reg` to outrank `.process-node text`'s
  `dominant-baseline: middle`. Labels also sit a few px higher and the
  registers a few px off the circle bottom, for vertical padding in the
  small (r=28) circles.
- `Lemma2Sxs` — the viewBox is padded to `-40 0 880 620` (from `0 0 800
  600`). The two-column layout is wide; the horizontal margin keeps its
  top-right from crowding the chrome badge, and the extra height keeps the
  bottom contradiction text out of the zoom-mode footer (zoom fits to
  height, so anything past y=600 was clipped).
- `SlowVsDead` — observation rows shift left a few px so the longest one
  ("12 ticks of silence…") clears the box's right edge.

## Data model — script-driven snapshots

The presentation is **scripted**, not simulated. Each scene is a
self-contained snapshot of the world state paired with a paper
passage. The Svelte app reads the script, advances scene-by-scene,
and renders each snapshot directly. No consensus algorithm is
simulated — the proof's argument is what we're visualizing, not
any concrete protocol's runtime behavior.

(Rationale: analysis.md §475-511 — "Don't model a specific
algorithm for Scene A. Use abstract transitions; the proof
argument is what's being visualized.")

**Script format**: YAML. See `src/script.yaml`.

```yaml
scenes:
  - id: <slug>
    head: { section: "§ N", topic: "..." }
    cite: "paper §N"           # or external source
    quote: |
      <paper passage, verbatim>
    note:                      # optional presenter aside
      marker: "▸"              # or "—" for attributions
      body: |
        <secondary-source gloss or framing>

    # Which canvas treatment this scene uses.
    # Default: "canvas" (the 3-process network from
    # sketches/00-canvas-narrated.html). Any other value picks
    # one of the bespoke visualizations.
    visual: canvas
            | slow-vs-dead     # sketches/01
            | valency-tree     # sketches/02
            | lemma2-sxs       # sketches/03
            | lemma3-set-D     # sketches/04
            | construction-q   # sketches/05

    # World snapshot — consumed by the `canvas` visual.
    # Other visuals derive their geometry from the scene's
    # content per their sketch; chrome/processes/buffer may
    # still be set so the chrome bar and rail render.
    chrome:
      stage:   <int>
      valency: bivalent | univalent-0 | univalent-1
      faulty:  <process_id> | null
    processes:
      - { id: p1, x: 0|1, y: b|0|1, pos: [x,y], faulty?: true }
    buffer:                    # multiset of pending pairs
      - { id: mN, from: pX, to: pY, payload: "..." }
    null_steps: [p1, p2, p3]   # (p, ∅) options to surface
    trace:
      - { stage: N, verb: deliver|delay|step, target: "..." }
```

**Scene → visual mapping** (planned):

| Scene id | visual |
| --- | --- |
| `result`                     | `system` (bare processes — progressive reveal) |
| `slow_vs_dead`               | `slow-vs-dead` |
| `process`                    | `process-state` (+ registers) |
| `configuration`              | `buffer-state` (+ empty buffer) |
| `buffer`                     | `message-buffer` (send view) |
| `null_event`                 | `message-receive` (receive view) |
| `admissible`                 | `message-receive` (delivery to nonfaulty p₁) |
| `partial`                    | `correctness` (off-timeline decided config + goalposts rail) |
| `total`                      | `correctness` (off-timeline; adds termination) |
| `valency_def`                | `valency-tree` |
| `valency_intuition`          | `valency-tree` |
| `lemma2`                     | `lemma2-sxs` |
| `lemma1_commutativity`       | `lemma1-commute` |
| `lemma3`                     | `lemma3-set-D` |
| `construction`               | `construction-q` |
| `punchline`                  | `message-buffer` (send — the pile never drains) |
| `window_of_vulnerability`    | `message-buffer` (reuses punchline) |
| `section_4_positive_result`  | `system` (bare-processes stopgap; TODO: §4 initial-clique digraph) |

The channel `Canvas` is now **retired** — no scene uses the `canvas` visual.
`Canvas.svelte` can be deleted once we're sure nothing references it.

**Future changes / scene ideas** (noted, not yet scheduled):

- **`result` deserves a better visual than lone processes.** Three bare
  process circles with no registers/buffer is a weak opening image — the
  processes are properly *introduced* one scene later at `process` (where the
  registers debut), so the bare reveal at `result` carries little. Rethink:
  give `result` a stronger cold-open treatment for the impossibility statement
  (candidate directions TBD), rather than the first step of the
  process→register→buffer reveal ladder.
- **A "references" scene with QR codes.** A late scene (likely near the end)
  with a few QR codes linking to the paper and the secondary analyses we quote
  (Aspnes, Robinson, etc.). Style the QR codes in our design language — paper
  ground, ink modules, bracket/terminal framing — not stock black-on-white.
  Details (which sources, layout, whether it's its own scene or a rail panel)
  to be sorted out later.
- **`b` blank-value color in the `process` rail legend.** The register legend
  renders the blank output value `b` in `--ink-faint` (soft gray). It reads as
  tentative — a placeholder / "candidate" gray rather than a committed semantic
  color, and the same faint ink already does duty as tertiary separators. Give
  `b` ("blank / no decision written yet") a deliberate treatment — possibly its
  own token — kept clear of both the `--bivalent` accent (so it never reads as a
  valency claim) and the plain faint-separator gray. Low-stakes; fold into a
  future color pass. Decided in this thread that `b` must stay register-level,
  not valency-colored (see the legend discussion / analysis.md #10).
  closing contrast: weaken the fault model by one knob and consensus returns.
  `section_4_positive_result` currently is a bare-processes `system` stopgap;
  it becomes **two** bespoke scenes. Both are **outside the impossibility run**
  (a different fault model: **strict majority alive, no crashes *during*
  execution**) — fresh setup, not the message thread.

  Why two scenes: §4 has two distinct ideas, and one scene lets the digraph
  machinery bury the more important "aha." Split **why → how**, mapping to the
  two halves of consensus:

  - **Scene A — "the knob" (why it's possible / TERMINATION).** Quote: Theorem
    2 statement. The direct contrast with the impossibility: *no mid-run crashes
    ⇒ a process can wait for a **majority** and the wait always returns* (the
    alive majority broadcasts, channels are reliable, nobody vanishes mid-step —
    so you never wait on a maybe-dead pivotal process, the slow-vs-dead trap FLP
    exploits). You still can't wait for *everyone* (initially-dead minority), so
    you wait for a majority, not all. Visual: a process gathering a **majority
    quorum** — alive majority answering, initially-dead minority greyed — so a
    decision becomes *safe*, where every prior scene held bivalent. This is the
    higher-impact beat; build it FIRST (and it's the simpler visual).
  - **Scene B — "the clique" (how agreement holds / AGREEMENT).** Quote: the §4
    algorithm. Each process decided on a *different* majority — why do they
    agree? Any two majorities **overlap**; stage-2 exchange + transitive closure
    (G⁺) reveals the same **initial clique** (unique source clique, no incoming
    edges, by the majority property) to everyone; a fixed rule on its values →
    same decision. Visual: the **heard-from digraph** + initial clique
    highlighted → decision. Rail: proof-anatomy panel for the 2-stage algorithm
    (L = ⌈(N+1)/2⌉, hear from L−1, closure, unique clique). analysis.md §444–476.

  Open design specifics (defer to build time): **N = 3** (consistent, simpler)
  vs **5** (L=3, a 3-of-5 clique reads "majority" more clearly — plan.md
  anticipated a 5-process §4 variant); the **decision rule** on the clique's
  values (e.g. min → 0, since the locked p₁=0/p₂=1 clique ties); whether to show
  the **`y → decided` payoff** (recommended — it's the contrast with forever-`b`).
  Does NOT contradict Theorem 1: FLP's adversary needs a *mid-run* crash to
  stall bivalent forever (Lemma 3's deferral); §4 assumes that lever away.

Snapshot-per-scene (no deltas) trades verbosity for
authorability: you can jump to any scene independently, and the
renderer can diff between adjacent scenes if it needs to animate
transitions.

**Process positions** currently live in the script (`pos: [x,y]`
per process) so a future scene could use a different geometry
(e.g. a 5-process variant for Section 4). If we always use the
same 3-process layout, this can move to the renderer as a
canonical constant.

**Trace `target` is a string** (`"m6"`, `"(p2, ∅)"`) so the
renderer doesn't have to know the verb-specific shape ahead of
time.

## Chrome status fields — policy & repair TODO

The chrome bar's `stage` and `faulty` fields describe **what the current scene
is about**, not a complete run log. They assert a run-state only on scenes that
actually depict one; elsewhere they gray or vanish, so the bar never implies the
live run is somewhere it isn't.

- **Stage** — three states (`chrome.stage: number | null`, plus `chrome.muted`):
  - **Crisp** — scene sits on the run's spine and advances it.
  - **Gray** (`muted: true`) — scene is paused on a real run stage to explain
    something, not advancing it.
  - **Hidden** (`stage: null`) — no run stage at all (setup before the run,
    abstract lemmas, the §4 model, the off-timeline correctness scenes).
- **Faulty** — crisp where the crash is doing work in the scene; hidden
  (`faulty: null`) otherwise. The render now hides the field entirely when null,
  so pre-crash scenes no longer show "faulty —" (applied globally already).
- **Valency badge** renders the paper's term ("0-valent" / "1-valent" /
  "bivalent") via a label map, not the data slug.

Mechanism is fully in place (`stage: null` hides, `muted: true` grays,
`faulty: null` hides, label map). **Done:** `partial` / `total` (stage + faulty
hidden, badge 1-valent); `configuration` (crisp `stage 0` — it *is* the initial
config); `admissible` / `construction` / `punchline` / `window` (crisp + faulty,
the crash is the point); intro scenes already dropped "faulty —" via the render
change.

**Repair TODO** (open — overlaps the scenes 9-17 review; just per-scene data):

- `result`, `process`, `slow_vs_dead` — currently crisp `stage 0`. Decide hide
  vs. keep crisp-0 (we kept crisp-0 for `configuration`; these are pre-run, lean
  hide).
- `valency_def`, `valency_intuition` — gray the stage (`muted`, st 7) and set
  `faulty: null` (the crash isn't what those scenes are about).
- `lemma3` — gray the stage (`muted`, st 12) and `faulty: null`.
- `lemma1_commutativity`, `lemma2` — currently crisp `stage 0`; hide
  (`stage: null`) — abstract proof asides.
- `section_4_positive_result` — currently crisp `stage 0`; hide (separate model).

## Interaction model — narrated essay (locked)

The presentation is a **scripted walkthrough**, not a free-form
simulator. The presenter is talking the audience through the
paper; the controls advance both the text and the visualization
in lockstep.

- **Forward / back** (▸ / ◂ or → / ←): advance to the next
  scene. Essay column scrolls (smooth) to bring the new scene
  into the active position; canvas updates to the new scene's
  snapshot (processes / buffer / trace / chrome).
- **Play** (⏵): autoplay through scenes at a steady cadence —
  useful for a hands-off run-through during rehearsal.
- **Reset** (⟳): jump to scene 1.
- **Scene N / M** counter on the right of the control bar.
- **Fullscreen canvas** (`f` / `⤢` button / `Esc`): toggles a zoomed
  mode for far-room viewing. Hides the chrome, controls, and essay so
  the canvas fills the left/top/bottom; the rail stays. A reserved zoom
  footer shows the scene counter (left) + keys (right), with a compact
  valency badge pinned top-left. `← / →` still navigate. This is the
  primary readability lever at long FVD (~30 ft) — the ~2× canvas
  scale-up offsets the distance rather than bumping every font.

**Active scene visual model**: the essay column scrolls smoothly;
the active scene is at full opacity with a `▸` margin marker, all
others at opacity 0.28. Audience attention rides on the active
quote while neighboring scenes stay visible as before/after
context.

**Ad-hoc interaction during Q&A** (stretch, not yet specified):
buffer rows could be clickable to deliver a specific message off-
script, advancing to a synthesized intermediate scene. This gives
the presenter freedom to answer "what if you delivered this
instead?" without breaking the scripted spine.

**No initial-value picking, no autoplay-fairness mode.** Those
were dashboard-mode ideas (sketch.html). The scripted approach
trades flexibility for a tighter talk.

## Pedagogical arc — locked in `script.yaml`

Eighteen scenes covering the punchline arc and the §4 contrast:

1.  **result** — §1 abstract
2.  **slow_vs_dead** — §1 indistinguishability
3.  **process** — §2 registers (x_p, y_p, blank `b`)
4.  **configuration** — §2 the system-snapshot noun
5.  **buffer** — §2 multiset
6.  **null_event** — §2 (p, ∅) (can return ∅ even when buffer has (p, m))
7.  **admissible** — §2 both clauses (p3 turns faulty here)
8.  **partial** — §2 partial correctness: agreement + non-triviality
    (off-timeline; badge 1-valent)
9.  **total** — §2 total correctness: + termination, the bar Theorem 1
    breaks (off-timeline)
10. **valency_def** — §3 V definition (bivalent + univalent)
11. **valency_intuition** — Robinson's "undecided yet"
12. **lemma2** — §3 bivalent initial exists
13. **lemma1_commutativity** — §2 disjoint schedules commute
14. **lemma3** — §3 preservation (the hero stage-12 state)
15. **construction** — §3 stage / queue rule
16. **punchline** — §3 stage 99, still bivalent
17. **window_of_vulnerability** — §1 the folklore vindicated
18. **section_4_positive_result** — §4 same authors, immediate
    contrast: weaken the fault model by one knob, consensus
    returns

The visual punchline: the valency badge sits on `bivalent` from
scene 1 to scene 12. The trace grows; the buffer never empties;
nobody decides.

One optional scene remains commented at the bottom of
script.yaml — `lemma3_case2` (the same-process case of Lemma 3).
Uncomment if talk depth allows.

## Open questions

**Resolved** (by reading the paper + writing analysis.md):

- ~~Abstract vs. specific algorithm?~~ → Abstract / scripted. The
  proof argument is what we're visualizing, not protocol runtime.
- ~~FIFO per channel vs. multiset?~~ → **Multiset** per paper §2
  verbatim ("the message system maintains a multiset, called the
  message buffer"). Already reflected in the buffer panel design.
- ~~Faulty step semantics?~~ → "Faulty" = doesn't take infinitely
  many steps (paper §2). In our viz, presenter marks faulty; from
  that scene on, the process gets a dashed circle and
  `(p, ∅) faulty` in the buffer panel.
- ~~Terminology audit?~~ → Done in analysis.md. We use the
  paper's exact terms: configuration, step, event, schedule,
  run, stage, valency, bivalent, ∅ (we render the paper's `0`
  null marker as `∅` to distinguish from decision value 0).
- ~~Valency computation?~~ → Pre-annotated in script.yaml per
  scene. No runtime exhaustive search needed.
- ~~Should we add a §4 positive-result scene?~~ → **Yes, added.**
  `section_4_positive_result` is now scene 16. It currently falls
  back to the default `canvas` visual; a bespoke §4-protocol
  sketch (initial-clique digraph) is a TODO, noted in the
  scene→visual mapping table.
- ~~Watermark / branding mark?~~ → **Resolved.** Centaur sigil,
  standalone `sketches/centaur.svg`. See the Watermark section.
- ~~Script loader — build plugin or runtime fetch?~~ →
  **Build-time** `@rollup/plugin-yaml`. `script.yaml` moved to
  `src/`, parsed at build into typed `Scene` objects (see Stack).

**Still open** (for the next thread):

- **Scene transition animation policy.** When advancing from
  scene N to scene N+1, should the canvas:
  (a) hard-cut to the new snapshot,
  (b) animate the diff (messages slide in/out, processes recolor),
  (c) animate only specific deltas (faulty mark, valency change)?
  Hard-cut is the simplest and most honest for a scripted talk;
  any animation should serve the proof, not decorate it.
- **Ad-hoc delivery during Q&A.** Should buffer rows be clickable
  in the live app to simulate "what if you delivered this
  instead?" — and if so, how does that interact with the scripted
  next-scene state?
- **Keyboard binding policy.** ← / → for back / forward feels
  obvious. Other keys? (space = next? esc = reset?)
- **Process-position policy.** Currently per-scene in
  script.yaml (`pos: [x, y]`). If every scene uses the same
  3-process layout, hoist to a renderer constant and drop from
  the schema.
- **§4 bespoke visual.** The §4 scene exists but uses the default
  canvas. A dedicated initial-clique-digraph sketch would land
  the positive-result contrast better. Optional polish.

## Status

**Design phase: complete.** Aesthetic, layout, type, message
rendering, and interaction model all locked in
`sketches/00-canvas-narrated.html`. Per-scene custom
visualizations (slow-vs-dead, valency tree, lemma 2 side-by-side,
lemma 3 set 𝒟, construction queue) drafted in
`sketches/01-…05-`. Sixteen-scene narration script drafted in
`script.yaml`. Paper analysis with provenance markers in
`analysis.md`. Watermark (centaur sigil) explored and resolved —
see the Watermark section below.

**Legibility:** applied to the Svelte components (`legibility.md`
has the AVIXA-DISCAS analysis + bump table). SVG sub-labels and
rail text are enlarged and the zoom-mode rail widened; box-filling
headers that couldn't grow were left at or near their original
size. Fullscreen carries the diagram at the ~30-ft FVD (its ~2×
scale-up), so the bumps mainly target the persistent UI and the
smallest sub-labels. Verified by screenshot per visual.

**Build phase: visuals complete.** Svelte 5 + Vite + TypeScript app
under `src/`, build-time YAML → typed `Scene` schema. The three-column
`AppShell` (chrome, essay, stage, rail, controls, watermark) is built
with ← / → scene navigation. Every scene renders: the default `canvas`
visual plus all five bespoke visuals — `slow-vs-dead`, `valency-tree`,
`lemma2-sxs`, `lemma3-set-D`, `construction-q` — each wired through
`scene.visual` (`Stage` dispatches the canvas; `Rail` swaps to a
proof-anatomy panel for slow-vs-dead / lemma2 / lemma3). `npm run lint`,
`check`, and `build` all pass. SVG-text porting gotchas (whitespace,
braces, baselines) are captured in project memory.

**Message-system rollout: complete.** The per-pair channel `Canvas` is retired —
every message-bearing scene uses the by-sender send pool (`message-buffer`) or
the per-recipient receive partition (`message-receive`), with the progressive
intro reveal (`system` → `process-state` → `buffer-state`) and one coherent
single-`vote v` run threaded across all scenes. Design + per-scene buffers in
`plans/message-buffer-visual.md`; project memory `message-buffer-redesign`.

Remaining build work:
- **Brian to review scenes 9-17** next session — valency_def/intuition, lemma2,
  lemma1, lemma3, construction, punchline, window, section_4. He's signed off on
  1-8; the late scenes were rolled out (and the message thread reconciled) but
  not yet eyeballed by him.
- `section_4_positive_result` — currently a bare-processes `system` stopgap;
  wants its bespoke initial-clique digraph + proof-anatomy rail (see the Future
  changes note above).
- `result` cold-open — lone bare processes is a weak opener; rethink (Future
  changes note).
- Autoplay (`⏵`) control — not wired (`Controls` has back/forward/reset).
- Open questions below (transition policy, keyboard beyond ← →).

## Watermark — centaur sigil

A faint centaur mark sits as a watermark on the stage. Standalone
asset: `sketches/centaur.svg`. **Keep it a separate file** — in
the build it becomes a single shared component (one static
centaur for the whole app), not something inlined per scene.

**Decision history:**

- **v1 — "stretch" centaur** (`archive/centaur-stretch.svg`).
  CSS-positioned rects: head/torso/saddle anchored to the right
  edge at fixed pixel offsets, body slats stretching via
  `calc(100% - margin)`. Idea: the centaur's spine becomes the
  horizon line of the page, elongating as the viewport widens.
  Rejected — at wide viewports the aspect drifted toward 8:1 and
  the silhouette read as a horizontal strip / "broken aspect
  ratio" rather than a centaur. The spine effect only registered
  to the designer, not a glancing viewer.
- **v2 — chosen.** Plain `viewBox="0 0 80 28"` SVG that scales
  uniformly (native ~2.86:1 preserved at every width). Consumer
  CSS locks `aspect-ratio: 80/28; height: auto` and tones it down
  to `color: var(--ink-faint); opacity: 0.07` so it blends with
  the paper-noise overlay (`body::before`, opacity 0.06) — reads
  as part of the paper texture, not a deliberately-placed mark.
  This is the current `sketches/centaur.svg`.

**Current sketch state (resolved):**
- `00-canvas-narrated.html` — carries the **v2** centaur in the
  chosen bottom-center placement. This is the canonical shell; its
  watermark IS the spec.
- `01-…05-` — no centaur. Will inherit the shared component.
- Superseded watermark iterations live in `archive/`:
  `00-canvas-narrated-v1-watermark.html` (rejected v1 stretch
  centaur), `00-canvas-narrated-a-footer.html` and `-b-chrome.html`
  (placement experiments — footer-center won, chrome-bar rejected).

**For the build:** one `<Watermark>` (or a static `<img
src="centaur.svg">` / inline SVG) mounted once in
`AppShell.svelte`, positioned bottom-center, styled per v2.
Placement landed on bottom-center; revisit if it competes with
the controls row.

## Repository layout

Paths below are relative to the repo root. The planning docs
(this file, `analysis.md`, `legibility.md`) live under `plans/`;
the Svelte app will live under `src/` + `public/`; the paper,
scene data, and design sketches stay at the root level.

```
flp-demo/
├── plans/            planning + analysis docs (this dir)
├── src/              Svelte app — components/, visuals/, lib/ (skeleton)
├── public/           static assets for the build (empty skeleton)
├── sketches/         locked design reference (HTML mockups)
├── archive/          earlier sketch iterations + rejected centaurs
├── script.yaml       16-scene narration script (final home: see §485)
├── flp.pdf / flp.txt the paper + extract (gitignored — © ACM, local only)
└── guide.md / summary.md  companion deliverable stubs
```

| File | What it is |
| --- | --- |
| `plans/plan.md` | This document. |
| `plans/analysis.md` | Internal analysis of the paper, with provenance markers for every claim. Heavy on terminology, proof structure, and pedagogical framings. **Read this first** when picking up the work in a new thread. |
| `plans/legibility.md` | AVIXA-DISCAS font-size audit + per-selector bump table, against projection legibility for the expected venue (medium conf room, ~12 attendees; FVD revised to ~30 ft). Applied to the Svelte components. |
| `flp.pdf` | The paper (Fischer, Lynch, Paterson 1985, © ACM). **Gitignored** — kept locally, not redistributed; cite the canonical source (see `analysis.md` Sources). |
| `flp.txt` | `pdftotext -layout flp.pdf` extract. **Gitignored** — derivative of the © ACM paper. |
| `script.yaml` | Sixteen-scene narration script. Self-contained world snapshots per scene. |
| `src/` | Svelte app (skeleton: `components/`, `visuals/`, `lib/`). Not yet scaffolded — see Pickup notes §4. |
| `public/` | Static build assets (empty skeleton). |
| `sketches/00-canvas-narrated.html` | Locked aesthetic + layout reference, carrying the chosen v2 centaur watermark (bottom-center). Default scene visual (3-process network). |
| `sketches/01-slow-vs-dead.html` | Scene 2 visual — two parallel networks, identical p₁ observation. |
| `sketches/02-valency-tree.html` | Scenes 7-8 visual — reachability tree showing V = {0,1}. |
| `sketches/03-lemma2-sidebyside.html` | Scene 9 visual — adjacent initials + identical σ → contradiction. |
| `sketches/04-lemma3-set-D.html` | Scene 10 visual — C → 𝒞 → e → 𝒟 with bivalent member highlighted. |
| `sketches/05-construction-queue.html` | Scene 11 visual — process queue + per-process message order. |
| `sketches/centaur.svg` | The watermark sigil (v2, viewBox-scaled). Shared asset for the build. |
| `archive/` | Earlier iterations, comparison only: dashboard / 2-col / 3-col / projection-type sketches; superseded watermark shells (`00-canvas-narrated-v1-watermark.html`, `-a-footer.html`, `-b-chrome.html`); rejected centaurs (`centaur-stretch.svg`, `centaur-*-prototype.svg`). |
| `guide.md` | Companion doc (empty) — guided tour of the paper. |
| `summary.md` | Companion doc (empty) — honest high-level human summary. |

## Pickup notes — for the next thread

1. **Start by re-reading `analysis.md`** to load the paper's
   terminology and pedagogical structure.
2. **Open `sketches/00-canvas-narrated.html` in a browser** alongside
   reading the plan's Aesthetic + Layout sections. The sketch IS
   the design spec — every CSS value and SVG geometry decision is
   locked there, including the chosen v2 centaur watermark.
   Then open `sketches/01-` through `05-` to see the per-scene
   visual treatments.
3. **Read `script.yaml`** to understand the scene-snapshot
   contract, then the "Scene → visual mapping" table above to see
   which scenes use which canvas treatment.
4. **Scaffold the Svelte 5 + Vite project**:
   - Single-page app.
   - YAML loader: build-time `@rollup/plugin-yaml` (chosen);
     `src/script.yaml` parsed at build into typed `Scene` objects.
   - Components:
     - `AppShell.svelte` — chrome bar + 3-column stage + controls.
     - `Essay.svelte` — scrolling scene list, takes `scenes` and
       `activeIndex` props.
     - `Scene.svelte` — one scene block (head, quote, cite, note).
     - `Stage.svelte` — switches on `scene.visual` and mounts one
       of the canvas components below. Always renders the same
       outer `.canvas` wrapper so column geometry stays stable.
     - `visuals/Canvas.svelte` — default SVG network (the
       `canvas` visual). Per `sketches/00-canvas-narrated.html`.
     - `visuals/SlowVsDead.svelte` — `slow-vs-dead`. Per
       `sketches/01-slow-vs-dead.html`.
     - `visuals/ValencyTree.svelte` — `valency-tree`. Per
       `sketches/02-valency-tree.html`.
     - `visuals/Lemma2Sxs.svelte` — `lemma2-sxs`. Per
       `sketches/03-lemma2-sidebyside.html`.
     - `visuals/Lemma3SetD.svelte` — `lemma3-set-D`. Per
       `sketches/04-lemma3-set-D.html`.
     - `visuals/ConstructionQueue.svelte` — `construction-q`. Per
       `sketches/05-construction-queue.html`.
     - `Rail.svelte` — buffer + trace panel, takes
       `buffer / null_steps / trace` from the snapshot. Some
       visuals (lemma2-sxs, slow-vs-dead, lemma3-set-D) replace
       the rail's default contents with a proof-anatomy panel —
       see each sketch for the rail markup variant.
     - `Controls.svelte` — bottom bar; emits `back / forward /
       play / reset` events.
     - `Watermark.svelte` (or a static inline SVG / `<img
       src="centaur.svg">`) — mounted ONCE in `AppShell.svelte`,
       bottom-center, styled per the Watermark section (v2:
       `aspect-ratio: 80/28`, `ink-faint`, `opacity 0.07`). One
       static centaur for the whole app — do not inline per scene.
   - Reactive state in `App.svelte`: load `script.yaml`,
     track `activeIndex`, bind to controls + keyboard, scroll
     essay to active scene, pass active snapshot to canvas/rail.
5. **Resolve open questions above** as they come up — don't try
   to settle them all up front; the simplest defaults are
   probably right (hard-cut transitions, no ad-hoc delivery in
   v1, ← / → keyboard).
6. **Open issue with the message rendering**: in
   `sketches/00-canvas-narrated.html` the message positions and
   rotations are hand-computed per channel. In the live app,
   `(translate, rotate)` will need to be derived from channel
   geometry + perpendicular offset for any channel layout. The
   math is documented in that sketch's SVG comments: tangent
   direction = `P2 - P0` for the quadratic Bézier, normal is 90°
   rotated; outward normal points away from the triangle
   centroid; offset 22px (horizontal) or 28px (diagonal).
