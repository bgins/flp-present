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

## Representing the unbounded — receding, fading, glitching pods

Per chamber: a **clear, labelled** message pod near the rim (a real pending
message). Behind it, toward the center, **smaller and fainter** pods — label
still legible at first, then **hiding / glitching the text out** and softly
dissolving into the core. The crisp pods are the actual messages; the fading
tail evokes the buffer's unbounded *capacity* (it could hold arbitrarily many),
not infinitely-many-right-now.

The glitch should read as **light cypherpunk** (per the locked aesthetic, §47),
not heavy noise — a restrained terminal dissolve that sits comfortably next to
the botanical line work and survives 30-ft projection.

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
