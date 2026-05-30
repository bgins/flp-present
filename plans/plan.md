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
| `result`                     | `canvas` |
| `slow_vs_dead`               | `slow-vs-dead` |
| `process`                    | `canvas` |
| `configuration`              | `canvas` |
| `buffer`                     | `canvas` |
| `null_event`                 | `canvas` |
| `admissible`                 | `canvas` |
| `correctness`                | `canvas` |
| `valency_def`                | `valency-tree` |
| `valency_intuition`          | `valency-tree` |
| `lemma2`                     | `lemma2-sxs` |
| `lemma1_commutativity`       | `canvas` (TODO: bespoke commute sketch) |
| `lemma3`                     | `lemma3-set-D` |
| `construction`               | `construction-q` |
| `punchline`                  | `canvas` |
| `window_of_vulnerability`    | `canvas` (reuses punchline state) |
| `section_4_positive_result`  | `canvas` (TODO: §4 protocol sketch) |

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

Seventeen scenes covering the punchline arc and the §4 contrast:

1.  **result** — §1 abstract
2.  **slow_vs_dead** — §1 indistinguishability
3.  **process** — §2 registers (x_p, y_p, blank `b`)
4.  **configuration** — §2 the system-snapshot noun
5.  **buffer** — §2 multiset
6.  **null_event** — §2 (p, ∅) (can return ∅ even when buffer has (p, m))
7.  **admissible** — §2 both clauses (p3 turns faulty here)
8.  **correctness** — §2 the goalposts: agreement + both outcomes
    reachable + termination under one fault
9.  **valency_def** — §3 V definition (bivalent + univalent)
10. **valency_intuition** — Robinson's "undecided yet"
11. **lemma2** — §3 bivalent initial exists
12. **lemma1_commutativity** — §2 disjoint schedules commute
13. **lemma3** — §3 preservation (the hero stage-12 state)
14. **construction** — §3 stage / queue rule
15. **punchline** — §3 stage 99, still bivalent
16. **window_of_vulnerability** — §1 the folklore vindicated
17. **section_4_positive_result** — §4 same authors, immediate
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
- **Apply legibility bumps.** Per `legibility.md`'s per-selector
  table. Decide whether to bump the sketches (to re-verify by
  screenshot) or only the Svelte components during the build.

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

**Legibility:** audited but not yet applied. `legibility.md` has
the AVIXA-DISCAS analysis and a per-selector bump table; the
sketches still carry the original (pre-bump) sizes. Apply the
bumps as part of the build, or to the sketches first if we want
to re-screenshot-verify.

**Build phase: scaffolded.** Svelte 5 + Vite + TypeScript project in
place under `src/`, with the build-time YAML pipeline parsing
`src/script.yaml` into the typed `Scene` schema and a placeholder
`App.svelte` rendering scene 1. `npm run check` and `npm run build`
both pass. Next: the component tree (`AppShell` three-column shell →
`visuals/Canvas` → scene navigation), per Pickup notes §4.

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
| `plans/legibility.md` | AVIXA-DISCAS font-size audit + per-selector bump table, against projection legibility for the expected venue (medium conf room, ~12 attendees, ~15-ft FVD). Not yet applied. |
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
