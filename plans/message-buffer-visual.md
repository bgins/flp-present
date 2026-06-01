# FLP demo — symbolic visual language for the message system

Research + design notes for re-representing FLP's message buffer. Started
May 2026. Prototype lives in `src/visuals/MessageBuffer.svelte` (wired to the
`buffer` scene; uncommitted). See also `plan.md` (Aesthetic §47) and the
`message-buffer-redesign` project memory.

## Why we're doing this

The default `Canvas` draws a channel for every process pair and pins each
message onto a sender→recipient edge. FLP's model has **no topology and no
sender**: the message system is **one central multiset** of `(destination,
value)` pairs, and `receive(p)` returns any pending pair for `p` **or** the
null marker ∅ (`analysis.md §66`). The `buffer` scene's own note even says
"one pool — not a queue per channel," so the old canvas contradicted the
script. We're fixing the representation, and taking the chance to move from a
literal CS analogy (a box of chips) to a **symbolic** vocabulary.

Fidelity guardrails for any symbolic move:

- **Per-process chambers are fine** — a chamber = "messages addressed to p,"
  the natural partition of the one multiset by destination, which is exactly
  what `receive(p)` filters on. The sin we removed was per-*(sender,recipient)*
  FIFO lanes. Keep each chamber an **unordered** cluster (adversary plucks
  *any* one, not a queue front) inside **one** organism.
- **The buffer is genuinely unbounded** — a process can send arbitrarily many
  messages and take infinitely many steps. Evoke *boundless capacity*, not a
  tank that fills.
- **∅ is buffer-produced, not sent.** Processes send only *real* messages
  (`send(p, m)` puts a real `(p, m)` in the buffer). ∅ is what `receive(p)`
  returns when the message system hands over nothing, and it is **always
  available** — the event `(p, ∅)` is applicable to *any* configuration, even
  when a message for `p` is pending (the system may withhold delivery a finite
  number of times). So ∅ belongs on the **receive** side, as the buffer's
  ever-available "nothing" — never on the send streams, and not literally a
  stored item. (This withholding is the slow-vs-dead intuition in primitive
  form.)

## The symbolic turn — tease the bounds between math and botany

Brian's framing: a single central circle with internal pods, one (or more) per
process, with the unbounded store evoked rather than enumerated. The brief was
to **hint** at a citrus cross-section without drawing literal fruit — geometry
on the surface, botany as an after-image.

### Art-historical grounding

The tradition of deriving organic form from geometric construction (several of
whom were mathematicians):

- **Villard de Honnecourt** (13th-c. portfolio) — figures, animals, and plants
  built over a visible geometric armature. The medieval habit of
  construction-lines-under-nature.
- **Albrecht Dürer**, *Underweysung der Messung* (1525) — compass-and-
  straightedge construction made explicit; he was a serious geometer *and* the
  meticulous nature-observer of the watercolor turf/plant studies. The "into
  math as well" exemplar.
- **Medieval rota diagrams** (Isidore of Seville, Hildegard of Bingen) — a
  circle divided into radial segments to hold categories. Our structural
  template: the buffer as a *rota* whose wedges are the per-process chambers.
- **The vesica piscis / mandorla** — the almond as *pure geometry* (the lens
  where two circles meet) that also reads as a seed or leaf. Our "tease the
  bounds" primitive: the message-seed is simultaneously a construction and an
  organic form.
- **Ernst Haeckel**, *Kunstformen der Natur* (1904) — later, but the
  north star for radial natural symmetry drawn with geometric precision.

What we borrow: the **rota's radial chambering** (structure) + **Dürer's
visible construction** (the math layer) + the **vesica-almond as seed**
(organic-from-geometric) + **botanical-plate line economy** (no color, fine
ink, a specimen caption).

## The chosen language — the buffer as a rota

- **Compass circle** = the one multiset buffer (a single organism). Drawn with
  a visible center dot; a faint dashed **open core** at the middle signals the
  unbounded interior (no back wall).
- **Radial chamber walls** divide it into one wedge per process — the
  destination partition (a rota, not per-channel queues).
- **Vesica-almond seeds** = messages, sitting along each wedge's axis.
- **Stems** (dashed) tie each process node to its chamber — "p draws from its
  chamber of the one buffer."
- **Specimen caption** — *"fig. — the message buffer / one multiset · chambered
  by destination"* — the academic-plate voice.

Seed counts are **exact** (the real buffer state: e.g. p₁ has 2 pending, p₂ 1,
p₃ 0). Abundance/unboundedness is carried by the receding device below, not by
faking extra messages.

## Representing the unbounded — receding, fading pods

Per sender stream: a **clear, labelled** message pod near the rim (a real
pending message). Behind it, toward the core, **smaller and fainter** pods —
the label fades **a level at each depth** (ink → muted → faint → spent ring,
the deepest unlabelled) and the pod recedes, softly dissolving into the core.
The crisp pods are the actual messages; the fading tail evokes the buffer's
unbounded *capacity* (it could hold arbitrarily many), not
infinitely-many-right-now.

**Glitch dropped (May 2026).** An earlier version grained the deep label out
with an feTurbulence "glitch" (light-cypherpunk dissolve). It read as a foreign
vocabulary next to the botanical line work, and the body already carries a
paper-grain overlay for patina. Replaced with one more **fade level** — cleaner,
more legible at 30 ft, more minimal. The fade alone carries the dissolve.

**Option 3 (adopted):** render one crisp seed with its faint **generating
arcs** — the two circles whose lens is the vesica — so the geometry behind the
organic shape literally shows through (Dürer/Villard).

## Symbol alphabet & legend (open thread)

Once the buffer goes symbolic, the symbols want to become a reusable *alphabet*
used app-wide, not one-off marks. Brian raised: could the message/buffer
symbols appear as labels in the rail, or in a legend?

- **∅ is already shared** — the rail writes `(p, ∅)` and the trace uses it, and
  the canvas now draws the ∅ glyph. One concept, two registers; the lever is
  making them *feel* identical (same slash, weight). Lean into it.
- **The message has two registers that don't yet rhyme** — `[mₙ]` brackets in
  the rail/chrome (the locked "bracket motif") vs. the circular pod on the
  canvas. Unifying means choosing how hard to push.
- **Legend (low risk, recommended first).** A compact key — likely in the rail
  — decoding the alphabet. Going abstract *raises* a legend's value; it's the
  natural artifact of having symbols. Entries to include: the message pod,
  the **∅** null mark, `→` addressed-to, the receding/grain dissolve =
  unbounded, the converging **send** streams, and **the centre dotted circle**
  (the open core where the send streams converge / the buffer's unbounded
  interior — needs its meaning pinned: convergence point *and* boundless core).
- **Pod glyphs *as* rail labels (radical).** Mirror the canvas exactly. Unifies
  hard but fights the rail's dense terminal-text scannability — prototype one
  row before committing the panel.
- **Framing:** the real move is codifying a symbol alphabet (message, ∅,
  process, buffer, valency colors) applied consistently across *every* visual —
  a deliberate project-level pass (like the legibility pass). The legend is its
  public face. Lean: legend first; ∅ already unifies quietly; "pod-glyphs in
  the rail" is a later, deliberate call.

## Open questions / scope

- **Proportion.** The buffer currently dominates and the processes read as
  secondary satellites. For the `buffer` *scene* that's arguably right (the
  buffer is the subject), but for the eventual **default canvas** the processes
  are the agents and should hold more weight. Rebalance within this visual is
  cheap; a true process **restyle** is a separate, larger scope — process nodes
  appear in nearly every visual (Canvas, slow-vs-dead, lemma2, …), so a new
  process identity ripples everywhere. Decide deliberately.
- **receive / ∅ semantics.** Static form first; then a seed loosed from a
  chamber toward its process = `receive` returns a message, and a chamber that
  stays shut while time passes = ∅. ∅ becomes the visual star on `null_event`.
- **∅ placement — decided.** No ∅ in the send/buffer view (null is
  receive-produced). The buffer scene's receding pods are now plain *capacity
  rings* (the unbounded well), not nulls; an empty chamber (p₃) is just an empty
  well. ∅ appears only in the **receive** representation (`null_event`),
  interspersed with messages in a delay sequence.
- **Null glyph — decided (option b).** A message-sized circle with the slash
  *inside* (no jut) — so pods are uniform and line up cleanly in receive
  sequences (the jutting-∅ overlapped neighbours). A pod's *content* carries its
  meaning: a label = message, an internal slash = ∅. (To be applied when we
  build the receive view.)
- **Promotion to default canvas.** This is Option 1 from the redesign
  discussion — once the language is settled, replace the channel-based default.
- **Legibility.** Re-audit at 30 ft once the form is locked (the glitching
  labels especially).

## The running example (one consensus run)

A single thread of messages runs through every message-bearing scene so the
buffer is always *meaningful* and *continuous*, not freshly invented per slide.

**Premise.** Three processes vote: **p₁ = 0, p₂ = 1, p₃ = 0**. They run a
broadcast-vote protocol — each process keeps re-sending its own value to the
others. The adversary reorders and delays delivery and eventually crashes p₃,
so the processes never converge and every `y` register stays `b`. Both values
0 and 1 stay in flight forever → the configuration stays **bivalent**. Message
ids (m1, m2, …) climb with time.

The protocol is **not from the paper** (FLP is protocol-agnostic) — it's the
simplest illustration that keeps both values in flight forever.

**One message type — `vote v`.** Every pending message is a `vote v`,
v ∈ {0, 1}. The carried value is just the **sender's vote**, so the payload is
fully determined by `from`:

| sender | vote |
|--------|------|
| p₁     | 0    |
| p₂     | 1    |
| p₃     | 0    |

Duplicates are fine and expected (p₂ keeps re-sending `vote 1`); they're what
keeps the buffer non-empty forever. No `echo`/`prop`/relay types — one alphabet.

**Send and receive show the one pool two different ways** (revised May 2026
after the by-destination send view confused who-sent-what):

- **Send view (`buffer`) — by SENDER, no partitions.** It shows the *act* of
  sending. Each process streams its sent messages **inward, converging on the
  unbounded core** (the dashed central well); pods recede and dissolve as they
  enter storage. The pool is **undifferentiated** — no chamber walls. p₁'s
  inflow carries its four sends, p₂'s carries two, p₃ is silent. The buffer
  forgets the sender the moment a message lands, so this sender-grouping is a
  property of the *send event*, not stored state.
- **Receive view (`null_event`) — by RECIPIENT, partitioned.** The same pool
  **resolved into per-recipient wedges** — the natural partition `receive(p)`
  filters on. A process reaches into *its* wedge and pulls a pending message
  **or ∅**. The partition is how receive *sees* the pool, not intrinsic
  structure (the multiset has none).

So partitions appear **only** on receive, where they're meaningful. Recipients
are legible on send via the **rail** (`[mₙ] to pₓ : vote v` — the
`(destination, value)` pair), and via the receive view's wedges. The earlier
mistake was drawing destination chambers on the *send* view: p's full chamber
plus p's inward arrow read as "p sent these," when a chamber is p's *inbox*.

**Progressive reveal across the intro** — each scene adds exactly the layer its
quote introduces:

| scene           | visual          | shows                                       |
|-----------------|-----------------|---------------------------------------------|
| `result`        | `system`        | bare processes p₁ p₂ p₃                     |
| `process`       | `process-state` | + registers x, y                            |
| `configuration` | `buffer-state`  | + the empty pool (rim + dashed core)        |
| `buffer`        | `message-buffer`| send: by-sender streams converging into pool |
| `null_event`    | `message-receive`| receive: pool partitioned by recipient, pull/∅ |

Implemented with two flags on the rota (`MessageBuffer`): `showRegisters`,
`showBuffer`.

**Per-scene buffer (the run).** Ids/stages already form one continuous trace;
payloads follow the sender-vote rule above.

Protocol (illustrative): each process, **whenever it is scheduled**,
re-broadcasts its vote to the two others (no clocks → no timeouts; it re-sends
because nothing has decided). The adversary picks who runs and **withholds
delivery**, so sends pile up. p₁ is the annoying retrier, p₂ polite, p₃ quiet.

| scene | stage | view (canvas) | rail buffer — from → to · vote |
|---|---|---|---|
| `buffer` | 3 | **send** (message-buffer) | m1 p1→p2·0, m2 p1→p3·0, m3 p2→p1·1, m4 p2→p3·1, m5 p1→p2·0, m6 p1→p3·0 |
| `null_event` | 4 | **receive**, ∅ selected | *(same six)* |
| `admissible` | 7 | **receive** · deliver **m3** | m2·m4·m6 →p3 ⟂, m3 p2→p1·1 (delivered), m5 p1→p2·0 (pending) |
| `correctness` | 7 | **receive** (reuse admissible) | *(same as admissible)* |
| `valency_def`, `valency_intuition` | 7 | valency-tree (buffer rail) | *(same st7 set: m2·m3·m4·m5·m6)* |
| `lemma3` | 12 | lemma3-set-D | *proof-anatomy rail — no buffer (dormant data synced to construction)* |
| `construction` | 12 | construction-q (buffer rail) | m2·m4·m6 →p3 ⟂, m8 p2→p1·1, m9 p1→p2·0 — queues: p₁ all ·1, p₂ all ·0, p₃ stuck |
| `punchline` | 99 | **send** | m96 p2→p3·1 ⟂, m97 p2→p1·1, m98 p1→p2·0 |
| `window_of_vulnerability` | 99 | **send** (reuse punchline) | *(same as punchline)* |

⟂ = **stuck**: addressed to the faulty p₃, exempt from delivery — never drains.
`slow_vs_dead`, `lemma1`, `lemma2` use proof-anatomy rails (no buffer) and sit
outside the run (stage 0 / empty). `section_4_positive_result` is a separate
positive result — see plan.md's scene note.

**`buffer` (send, stage 3):** the scheduler interleaves **p₁ → p₂ → p₁** (a
live run). p₁ broadcasts (m1, m2), p₂ broadcasts (m3, m4), p₁ **retries**
(m5, m6) → p₁ owns four {m1, m2, m5, m6}, p₂ two {m3, m4}, p₃ silent. A
broadcast step sends to *both* peers (one step = a finite set). Pods are ranged
by **recency** — the most recent send sits crisp at the rim, earlier sends have
sunk deeper (the first-sent reached the pool first, so it's deepest/smallest,
dissolving into the core). On p₁'s inflow the retry (m5, m6) is crisp at the rim
and the first broadcast (m1, m2) has sunk through the fade — crisp → lighter →
faint → spent ring. The rail (id order + destination) and the trace log
(p₁→p₂→p₁) carry the precise send order. Interleaving the ids reads more
like a live system at low tracing cost — the rail (id order + destination) and
the trace log (p₁→p₂→p₁) keep the precise order. Both values in flight → bivalent.

**`null_event` (receive, stage 4):** same six-message pool, resolved by
recipient. p₃'s inbox is fullest — m2, m6 (p₁'s votes ·0) and m4 (p₂'s vote ·1),
both values — yet `receive(p₃)` returns **∅**. Receiver = most-pending process;
3 candidates + ∅ = 4, within the receive layout's angle budget. Thematically
p₃ — the quiet sender about to go faulty — is also starved on receive (the
slow-vs-dead seed).

**Post-crash — the live p₁↔p₂ channel (stages 5+).** p₃ takes its last step at
stage 4 (the ∅) and crashes; from stage 5 it is faulty and never steps again.
That collapses the run to **one live exchange, p₁↔p₂**: p₁ keeps sending its
`vote 0` to p₂, p₂ keeps sending its `vote 1` to p₁, so p₁'s inbox always holds
an inbound 1 and p₂'s an inbound 0 — **both values circulate forever → the
configuration stays bivalent.** The adversary merely orders these p₁↔p₂
deliveries to keep it so (Lemma 3 / the construction in action).

**Why the buffer grows without bound.** p₁ and p₂ can't tell p₃ is dead from
merely slow, so they keep broadcasting to it — and every `→ p₃` message is
**never delivered** (p₃ faulty ⇒ exempt). They accumulate forever: the unbounded
buffer *and* the slow-vs-dead point, made concrete by the same run. At
`admissible` (just after the crash) we show the **actual** stuck set — m2, m4,
m6, the three `→ p₃` sends from the opening, all accounted for. Later (st12,
st99) the pile has grown past listing, so those snapshots show **one
representative stuck `→ p₃` message (⟂) plus the live p₁↔p₂ pair**; the send
view's receding/fading dissolve carries the "arbitrarily many" the rail can't list.

**View per scene (the rule: the moment is a send or a receive).**

- `admissible` — the quote is about messages being *received*, so the **receive**
  view delivers **m3** to nonfaulty **p₁** — the very vote p₁ has been holding
  since the `buffer` scene (sent there, still pending at `null_event`, received
  here): the delivery *pays off* a message the audience has watched, rather than
  conjuring a new one. p₃'s chamber holds m2·m4·m6 as **exempt** stuck pods
  (greyed, no arrow); m5 is still pending for p₂. Trace ends on `deliver m3`.
  `MessageReceive` reads all of this from the scene's last trace event (verb
  `deliver` → delivery mode; recipient = receiver; faulty chambers exempt) —
  **implemented**.
- `correctness` — same stage-7 snapshot; attention is on the quote, so it reuses
  admissible's receive view.
- `punchline` / `window` — the pile that never drains; show the **send** view
  (p₁, p₂ still broadcasting into the pool, p₃ dark), reinforcing "it never
  ends." Trace ends on a send `step`.

**The rail is in sync at every stage.** The buffer+trace rail renders on
`buffer`, `null_event`, `admissible`, `correctness`, `valency_*`, `construction`,
`punchline`, `window` — each now lists the run's messages above, ids climbing
with the stage, both values always present. The proof-anatomy scenes
(`slow_vs_dead`, `lemma1`, `lemma2`, `lemma3`) swap the rail for their argument
panel, so they show no buffer — their dormant scene-data buffers can stay as-is.

**Status.** Thread consistent end-to-end. Stage-7 wired (`admissible` delivers
m3; `correctness` reuses it; `valency_*` rail-synced); `MessageReceive` is
last-trace-event driven. `construction` rebuilt — canvas queues + rail re-derived
to the run (m2·m4·m6 still stuck, m8/m9 live), `lemma3`'s dormant data synced.
`punchline`/`window` (st99) wired to the **send** view (live pair + stuck-p₃
rep, ids climb). `section_4` is outside the run → bare-processes `system` stopgap
(bespoke §4 visual + proof-anatomy rail still TODO — see plan.md). **The channel
`Canvas` is now retired** (no scene uses it).

**Subscript rendering.** Ids render the digits as a real subscript — normal,
cell-filling glyphs (smaller + `baseline-shift: -0.34em`, the font's true-sub
level) via SVG `<tspan>` on the canvas and HTML `<sub>` in the rail — *not* the
full-width Unicode subscript glyphs, which read spaced ("m8 4") for multi-digit
ids. See the `svelte-svg-text` memory.
