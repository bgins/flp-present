# FLP — analysis

Working notes on Fischer / Lynch / Paterson (1985),
*"Impossibility of Distributed Consensus with One Faulty Process"*,
combined with secondary readings cited at the end. Written for our
visualization's didactic needs — heavy on terminology, proof
structure, and common misreadings worth flagging in the talk.

## Provenance markers

This document is annotated so we can audit later. Every
substantive claim is tagged with where it came from:

- **[paper §N]** — drawn from the FLP paper itself, with section
  reference. The PDF (`flp.pdf`) and pdftotext extract (`flp.txt`)
  are kept locally only — gitignored, not redistributed (© ACM).
  See the Primary citation under Sources for the canonical reference.
- **[paper, verbatim]** — direct quote from the paper.
- **[Robinson]** — Henry Robinson, *A Brief Tour of FLP
  Impossibility* (Paper Trail blog, 2008). Verbatim quotes in
  quote marks.
- **[Aspnes]** — James Aspnes' Yale pinewiki entry on
  FischerLynchPaterson. Verbatim quotes in quote marks.
- **[Wirz]** — Chris Wirz, *The Impossibility of Distributed
  Consensus: Understanding the FLP Result*.
- **[web search]** — fact surfaced by the search-result summary
  (not yet verified against a primary source — flag for
  follow-up before citing in the talk).
- **[synth]** — my own framing or interpretation, built from the
  paper + sources but not directly attributable.
- **[training]** — claim drawn from my training data, not
  verified against any cited source in this session. Treat
  carefully and verify before relying on for the talk.

When a paragraph mixes sources, attribution tags appear inline at
the relevant claim.

## The result, in one sentence

**[synth, paraphrasing paper §1 + abstract]** In a purely
asynchronous distributed system with reliable message delivery,
no deterministic consensus protocol can guarantee termination if
even one process may crash.

**[synth]** The surprising part: the channels are *reliable*.
**[paper §1, verbatim]** "we assume that the message system is
reliable — it delivers all messages correctly and exactly once."
**[synth]** The only failure mode is a process that stops taking
steps; even this minimal fault model defeats any deterministic
protocol.

## The model

(Terminology entirely from **[paper §2]** unless otherwise noted.)

- **Process** `p`: deterministic automaton with possibly
  infinitely many states **[paper §1]**. Each has:
  - **Input register** `x_p` ∈ {0, 1} — the proposed value
    **[paper §2]**
  - **Output register** `y_p` ∈ {`b`, 0, 1}, where `b` is the
    blank initial value **[paper §2, verbatim "the output
    register starts with value b"]**. **Write-once** once a
    decision is made **[paper §2, verbatim "the output register is
    'write-once'"]**.
  - Internal storage (unbounded), program counter **[paper §2]**.
- **Message buffer**: a **multiset** (NOT per-channel FIFO) of
  sent-but-undelivered `(destination, value)` pairs **[paper §2,
  verbatim "The message system maintains a multiset, called the
  message buffer"]**.
- `send(p, m)`: places `(p, m)` in the buffer **[paper §2]**.
- `receive(p)`: returns either some `m` (deleting `(p, m)` from
  the buffer) OR the **special null marker ∅** without modifying
  the buffer **[paper §2, verbatim "returns the special null
  marker 0 and leaves the buffer unchanged"]**. (The paper uses
  the numeral `0` for the null marker; **[synth]** I use `∅` here
  to distinguish from the decision value 0.)
- **Configuration** `C`: internal state of every process + buffer
  contents **[paper §2]**.
- **Initial configuration**: every process at its initial state,
  buffer empty **[paper §2]**.
- **Step**: primitive step by a single process p, two phases
  **[paper §2]**:
  - Phase 1: `receive(p)` yields `m ∈ M ∪ {∅}`.
  - Phase 2: depending on internal state + m, p transitions to
    new state + sends a finite set of messages.
- **Event** `e = (p, m)`: completely determines a step (process is
  deterministic) **[paper §2, verbatim "the step is completely
  determined by the pair e = (p, m)"]**. `e(C)` = config after
  applying `e`.
- **Key point [paper §2]**: `(p, ∅)` is always applicable to any
  C — verbatim "the event (p, 0) can always be applied to C, so
  it is always possible for a process to take another step."
- **Schedule** `σ`: a finite or infinite sequence of events
  applicable in turn from C **[paper §2]**. **Run** = the
  corresponding sequence of steps **[paper §2]**. `σ(C)` =
  resulting config.
- **Reachable** / **accessible**: paper's terms for "can get
  to." All configs hereafter assumed accessible **[paper §2,
  verbatim "Hereafter, all configurations mentioned are assumed
  to be accessible"]**.

### Correctness conditions

**[paper §2]** throughout.

- **Partial correctness**:
  1. No accessible configuration has more than one decision
     value. **[paper §2, verbatim]**
  2. For each v ∈ {0, 1}, some accessible configuration has
     decision value v. **[paper §2, verbatim]**
- **Nonfaulty in a run** = takes infinitely many steps. **Faulty**
  = otherwise. **[paper §2, verbatim "A process p is nonfaulty in
  a run provided that it takes infinitely many steps, and it is
  faulty otherwise"]**.
- **Admissible run**: at most one faulty process AND every
  message sent to nonfaulty processes is eventually received.
  **[paper §2, verbatim "A run is admissible provided that at
  most one process is faulty and that all messages sent to
  nonfaulty processes are eventually received"]**.
- **Deciding run**: some process reaches a decision state.
  **[paper §2, verbatim]**.
- **Totally correct in spite of one fault**: partially correct +
  every admissible run is deciding. **[paper §2, verbatim "A
  consensus protocol P is totally correct in spite of one fault
  if it is partially correct, and every admissible run is a
  deciding run"]**.

### Valency (the proof's key concept)

**[paper §2]** A configuration has **decision value** `v` if some
process in it is in a decision state — i.e. has written its
write-once output `y_p = v`. **[paper §3]** For a configuration C,
let `V` = set of decision values of configs reachable from C.

- **Bivalent** iff `|V| = 2`. **[paper §3, verbatim "C is
  bivalent if |V| = 2"]**.
- **Univalent** iff `|V| = 1`, specifically **0-valent** or
  **1-valent**. **[paper §3, verbatim]**.
- `V ≠ ∅` by total correctness **[paper §3]**.

**[Robinson, verbatim]** Henry Robinson's translation: read
**bivalent** as "undecided yet" and treats univalency as the
state where the decision is already determined even if not yet
written.

**[synth]** Spelling it out: a 0-valent config may still contain
processes whose `y_p = b`, but every admissible run from it will
eventually decide 0. The decision is *structurally* determined,
not yet *explicitly* recorded.

## Proof structure (Theorem 1)

**[paper §3]** By contradiction. Assume P is totally correct in
spite of one fault. Build an admissible run that never decides.

### Lemma 1 — commutativity

**[paper §2, verbatim]** "Suppose that from some configuration C,
the schedules σ₁, σ₂ lead to configurations C₁, C₂, respectively.
If the sets of processes taking steps in σ₁ and σ₂, respectively,
are disjoint, then σ₂ can be applied to C₁ and σ₁ can be applied
to C₂, and both lead to the same configuration C₃."

**[paper §2, verbatim proof]** "The result follows at once from
the system definition, since σ₁ and σ₂ do not interact."

**[synth] Intuition**: a process's step only depends on its own
state and messages addressed to it. Disjoint-process schedules
don't interfere.

### Lemma 2 — a bivalent initial configuration exists

**[paper §3]** Proof by contradiction. If every initial config
were univalent:

1. **[paper §3]** By partial correctness, both 0-valent and
   1-valent initials exist.
2. **[paper §3, verbatim definition]** Call two initials
   **adjacent** if they differ only in the initial value `x_p`
   of a single process p. **[paper §3]** Any two initials are
   joined by a chain of adjacent ones.
3. **[paper §3]** So there exist adjacent C_0 (0-valent) and
   C_1 (1-valent), differing only in p's `x_p`.
4. **[paper §3]** Take any admissible deciding run from C_0 in
   which p takes no steps (i.e., p is the one faulty process).
   Its schedule σ applies equally to C_1 — **[paper §3,
   verbatim]** "corresponding configurations in the two runs are
   identical except for the internal state of process p."
5. **[paper §3]** Both runs reach the same decision (because the
   visible computation is identical), but one initial is
   supposedly 0-valent and the other 1-valent — contradiction.

**[synth] Intuition**: if every initial config "predetermined"
its decision, then crashing the one process whose input value
matters could force two different runs to produce the same
decision from configs that supposedly demanded different
decisions.

### Lemma 3 — bivalency is preserved (the hard one)

**[paper §3, verbatim]** "Let C be a bivalent configuration of P,
and let e = (p, m) be an event that is applicable to C. Let 𝒞 be
the set of configurations reachable from C without applying e,
and let 𝒟 = e(𝒞) = {e(E) | E ∈ 𝒞 and e is applicable to E}.
Then, 𝒟 contains a bivalent configuration."

**Proof sketch** (**[paper §3]**, by contradiction):

- Assume every D ∈ 𝒟 is univalent.
- **[paper §3]** 𝒟 must contain both 0-valent and 1-valent
  configs — for each i ∈ {0, 1}, take an i-valent E_i reachable
  from C; either E_i ∈ 𝒞 (so F_i = e(E_i) ∈ 𝒟) or e was
  applied in reaching E_i (so an F_i ∈ 𝒟 with E_i reachable from
  it exists). Either way F_i is i-valent.
- **[paper §3, verbatim definition]** Call two configurations
  **neighbors** if one results from the other in a single step.
- **[paper §3]** By an easy induction, there exist neighbors
  C_0, C_1 ∈ 𝒞 such that `D_i = e(C_i)` is i-valent. WLOG
  `C_1 = e'(C_0)` where `e' = (p', m')`.
- **[paper §3]** **Case 1**: p' ≠ p. Then by Lemma 1, e and e'
  commute: `D_1 = e'(D_0)`. **[paper §3, verbatim]** "This is
  impossible, since any successor of a 0-valent configuration is
  0-valent."
- **[paper §3]** **Case 2**: p' = p. Consider any finite
  deciding run from C_0 in which p takes no steps; schedule σ
  leads to `A = σ(C_0)`. By Lemma 1, σ applies to D_0 and D_1,
  reaching i-valent E_i. Both `e(A) = E_0` and `e(e'(A)) = E_1`.
  So A has both an 0-valent and a 1-valent successor — A is
  bivalent. But A came from a deciding run, so A is univalent.
  Contradiction.

**[Aspnes, verbatim] Intuition**: "if the adversary can keep the
protocol in a bivalent configuration forever, it can prevent the
processes from ever deciding."

**[Robinson, verbatim]** Robinson's informal statement of the
lemma's content: "if you delay a message that is pending any
amount from one event to arbitrarily many, there will be one
configuration in which you receive that message and end up in a
bivalent state."

**[synth]** The combined reading: Lemma 3 says the adversary can
always defer applying any specific event `e` while remaining in
bivalent territory.

### The main construction

**[paper §3]** From a bivalent initial config C_0:

- **[paper §3]** Maintain a queue of processes, initially
  arbitrary. Order the message buffer per recipient by send time,
  earliest first.
- **[paper §3, verbatim]** "Each stage consists of one or more
  process steps. The stage ends with the first process in the
  process queue taking a step in which, if its message queue was
  not empty at the start of the stage, its earliest message is
  received. This process is then moved to the back of the process
  queue."
- **[paper §3]** Result: in any infinite sequence of such stages,
  every process takes infinitely many steps and every message is
  eventually delivered → **admissible run**.

**[paper §3]** Construction: at each stage starting from bivalent
C with p at the head, let `m` = p's earliest message (or `∅`),
`e = (p, m)`. By Lemma 3, there's a bivalent C' reachable from C
by a schedule in which e is the last event applied. That schedule
is the stage.

**[paper §3, verbatim]** "Since each stage ends in a bivalent
configuration, every stage in the construction of the infinite
schedule succeeds. The resulting run is admissible, and no
decision is ever reached. It follows that P is not totally
correct."

## Things common shorthand gets wrong

**[synth + paper §2]** The items below contrast paper specifics
with simplifications I've seen in secondary writeups (training
data) — worth flagging if any of those simplifications surface
in the talk Q&A.

1. **The message buffer is a multiset, not per-channel FIFO.**
   **[paper §2]** explicit. **[training]** Many treatments draw
   per-channel queues — that's an extra assumption FLP
   deliberately doesn't make.

2. **`receive(p)` can return `∅` even when `(p, m)` exists in
   the buffer.** **[paper §2, verbatim]** "In particular, the
   message system is allowed to return 0 a finite number of
   times in response to receive(p), even though a message (p, m)
   is present in the buffer."

3. **The output register starts at `b` (blank), not 0 or 1.**
   **[paper §2]**. **[synth]** Decision is the transition from
   `b` to a value. Common shorthand "process votes 0 or 1"
   elides the distinction between input `x_p ∈ {0,1}` and output
   `y_p ∈ {b,0,1}`.

4. **Admissibility has two parts.** **[paper §2, verbatim]** "at
   most one process is faulty and that all messages sent to
   nonfaulty processes are eventually received." **[synth]**
   Common shorthand "admissible = at most one crash" forgets
   the message-delivery clause.

5. **No specific consensus algorithm appears in the impossibility
   proof.** **[synth]** The proof works against *any* partially
   correct protocol. The Section 4 "initially-dead processes"
   protocol **[paper §4]** is a *separate* positive result for a
   weaker fault model.

6. **FLP is NOT the Two Generals Problem.** **[web search]** Two
   Generals attributed to Akkoyunlu, Ekanadham, Huber (1975);
   popularized via Lamport's writings. **[training]** Two
   Generals is about unreliable channels reaching impossibility
   under message loss. **[synth]** FLP assumes reliable channels
   and shows impossibility from crashes alone — a deeper result.

7. **"Asynchronous" in FLP means a specific thing.** **[paper
   §1]** "we make no assumptions about the relative speeds of
   processes or about the delay time in delivering a message...
   we also assume that processes do not have access to
   synchronized clocks... we do not postulate the ability to
   detect the death of a process."

8. **FLP does NOT work by losing or withholding a message.** The
   impossibility run is **admissible**: every message to a
   nonfaulty process is *eventually delivered*, and every nonfaulty
   process takes infinitely many steps **[paper §2, §3
   construction]**. **[synth]** The adversary controls only the
   *order and timing* of deliveries. By Lemma 3 it can always
   deliver the next pending message and *still* reach a bivalent
   configuration — so it delivers everything yet the system never
   commits. "A message never arrives" is the wrong picture; "every
   message arrives, but never in an order that forces a decision"
   is right. (Contrast item 6: the channels are reliable.)

9. **The impossibility run can have ZERO actual crashes.**
   **[synth]** The constructed run delivers every message and lets
   every process step infinitely often, so *no* process is faulty
   in it — adversarial **scheduling alone** defeats the protocol.
   The "one fault" is what the protocol must *tolerate*; the lemmas
   (2, and 3 Case 2) invoke only the *possibility* of a crash — a
   deciding run in which one chosen process takes no steps — to
   force their contradictions **[paper §3]**. The protocol's
   required caution (it can never tell a slow process from a dead
   one — the slow-vs-dead point) is the crack the adversary widens
   with timing.

10. **"Decide" is one process's write-once `y`-flip — not a vote
    tally, not "all processes agree."** **[paper §2]** A run is
    *deciding* the moment *some* process writes `y_p` from `b` to a
    value. **[synth]** *How* a process chooses to write `y` is the
    (unspecified) protocol's rule — "got a matching majority of
    votes" is one possible rule, not FLP's definition; the proof is
    agnostic to it. Keep the registers distinct: `x_p` is the
    immutable **input** (its vote), `y_p` the write-once **output**
    (its decision). Sending/receiving messages never touches either;
    only a decision writes `y`. Agreement (partial-correctness
    condition 1) makes one process's write consistent system-wide.
    And **univalent ≠ decided**: the outcome can be sealed while
    every `y_p` is still `b`.

## Metaphors and intuitions for the talk

### The slow-vs-dead indistinguishability

**[paper §1, verbatim]** "we do not postulate the ability to
detect the death of a process, so it is impossible for one
process to tell whether another has died (stopped entirely) or
is just running very slowly."

**[synth]** This is the practical intuition: an asynchronous
system can't tell whether a silent process is crashed or just
slow, so it can never safely commit to a decision that depends
on what the silent process would have said.

### "Window of vulnerability"

**[paper §1, verbatim]** "The asynchronous commit protocols in
current use all seem to have a 'window of vulnerability' — an
interval of time during the execution of the algorithm in which
the delay or inaccessibility of a single process can cause the
entire algorithm to wait indefinitely. It follows from our
impossibility result that every commit protocol has such a
'window,' confirming a widely believed tenet in the folklore."

**[synth]** The theorem says this isn't a bug in any specific
protocol — it's a structural property of the problem.

### The adversary as a chess opponent

**[synth, my framing]** The adversary controls the message
system. The protocol designer plays first (writes the algorithm);
the adversary plays second (chooses delivery order and process
timing). The protocol designer wins if every admissible run
decides; the adversary wins if there exists even one admissible
run that doesn't.

**[Aspnes]** Aspnes' framing is the source for thinking of the
proof as an adversary game. **[synth]** The chess metaphor is
mine — use or discard as you see fit.

**[synth]** FLP says the adversary always has a winning strategy.
Lemma 3 is the existence proof: at every step, the adversary can
find a move (a delivery schedule) that keeps the system bivalent.

### Bivalent ≈ "the future is still open"

**[Robinson]** Robinson's framing of bivalent as "undecided yet."
**[synth]** My elaboration: univalent doesn't mean a process has
decided; it means the *future is committed*. A 0-valent config
is one where every admissible continuation will eventually decide
0, even if right now every process still has `y_p = b`.

**[synth]** The visual punchline for our viz: the "bivalent"
badge stays on the configuration as the adversary plays. The
decision is structurally inevitable… but never structurally
committed.

### "Inopportune" timing

**[paper §1, verbatim]** "the stopping of a single process at an
inopportune time can cause any distributed commit protocol to
fail to reach agreement."

**[synth]** The FLP result is sensitive to timing in a precise
way — not most timings, but the *existence* of some timing that
breaks the protocol. Practical protocols are usually safe in
expectation because the inopportune timings are rare. The
impossibility is about worst-case existence, not average
behavior.

**[Robinson, verbatim]** Makes the same point: "The chance of
entering that infinite undeciding loop can be made arbitrarily
small — it's one thing for nondecision to be possible, another
thing entirely for it to be guaranteed."

## Where FLP sits in the literature

**[synth]** This section pieces together FLP's references with my
training-data knowledge of the follow-up literature. Anything
beyond what's in FLP's own bibliography is **[training]** and
should be verified before citing in the talk.

- **Predecessors / siblings**:
  - **[web search]** Akkoyunlu, Ekanadham, Huber (1975) — Two
    Generals (lossy channels). Different fault model.
  - **[paper, bibliography ref 19]** Pease, Shostak, Lamport
    (1980) — "Reaching agreement in the presence of faults."
    **[training]** This is the synchronous Byzantine agreement
    result; possible if `n > 3f`.
  - **[paper, bibliography ref 14]** Lamport, Shostak, Pease
    (1982) — "The Byzantine Generals problem."

- **Responses / circumventions referenced in FLP's own
  bibliography**:
  - **[paper, bibliography refs 2, 20, 25]** Randomized
    consensus: Ben-Or (1983), Rabin (1983), Toueg (1984).
    **[training]** Allow probabilistic termination — protocols
    that terminate with probability 1 are possible even in the
    FLP model.
  - **[paper, bibliography ref 10]** Dwork, Lynch, Stockmeyer
    (1984) — "Consensus in the presence of partial synchrony."
    **[training]** Bounds exist but are unknown. Models a more
    realistic network. **[training]** Enables consensus
    protocols like Paxos and Raft.
  - **[paper, bibliography ref 3]** Bracha (1984) — asynchronous
    Byzantine consensus.

- **Post-paper work**:
  - **[training]** Chandra, Toueg (1996) — "Unreliable failure
    detectors for reliable distributed systems." Augments the
    model with an oracle that lists suspected-crashed processes;
    characterizes the weakest failure detector for consensus.
    Not in FLP's bibliography — flag for verification before
    using in the talk.

**[synth]** Pedagogical arc: FLP carved out the impossibility;
the next 20 years of distributed-systems theory was largely about
identifying the minimum extra assumption that re-enables
consensus. **[training]** This framing is common but unsourced
here — could find a survey paper if needed.

## The Section 4 positive result (could be a bonus demo scene)

**[paper §4]** Theorem 2: consensus IS possible if (a) a strict
majority of processes are nonfaulty AND (b) no process dies
*during* the execution (only initially dead).

Algorithm sketch (**[paper §4]** throughout):
- **Stage 1**: every process broadcasts its number, listens for
  `L − 1` other processes (where `L = ⌈(N+1)/2⌉`). Builds an
  "I heard from" digraph `G`.
- **Stage 2**: every process broadcasts its number + initial
  value + the set of processes it heard from in stage 1. Each
  process waits for stage-2 messages from every known ancestor
  in G. Builds transitive closure `G+`.
- **[paper §4, verbatim]** Each process "determines which of its
  ancestors belong to an initial clique of G+, that is, a clique
  with no incoming edges." Provably unique by the L-majority
  property.
- **[paper §4]** Decide based on initial values of the
  initial-clique members, using any agreed rule.

**[synth] Intuition**: by waiting for L−1 others in stage 1,
every process is transitively aware of at least one majority
cluster. The initial clique is the same set for everyone who
completes the protocol → consistent decision.

**[synth]** Pedagogically lovely contrast: the same authors who
proved the impossibility immediately exhibit a positive result
for a slightly weaker fault model. The "during execution"
weakening is exactly the FLP-blocking weakness — restoring
"initially dead only" restores consensus.

## Implications for our visualization

**[synth]** Entire section is my interpretation, not from any
cited source.

- **Show the buffer as one pool**, not per-channel queues. Avoid
  implying FIFO between pairs. (Channels can still appear as
  visual connections — that's about which pairs *can* exchange
  messages — but the deliverable list should represent the
  buffer as a multiset.)
- **Render the `b` blank value** distinctly from 0 or 1. The
  `b → 0` or `b → 1` transition is the "decide" moment to
  highlight visually.
- **Render `(p, ∅)` events** — the adversary can "step" a
  process without delivering anything. This is how time
  effectively passes for slow processes in the model.
- **The valency badge is the pedagogical payoff.** Compute or
  pre-annotate for the specific scenarios shown; bivalent
  staying bivalent as the adversary chooses each delivery is the
  visual proof of Lemma 3.
- **Two-scene demo arc**:
  - Scene A: Adversary mode on a small (N=3) bivalent initial.
    Presenter clicks deliveries; valency badge sticks on
    bivalent.
  - Scene B (optional): Section 4 protocol, no in-flight crashes,
    L-majority. Watch consensus *succeed*. Contrast pedagogy.
- **Don't model a specific algorithm for Scene A.** Use abstract
  transitions; the proof argument is what's being visualized,
  not any concrete protocol's behavior. (For Scene B, the
  initially-dead protocol is concrete and visualizable.)
- **The "stage" structure** in the main proof construction has
  presentation-time value: a step counter labeled "stage" not
  "step" reminds the audience the construction works in
  multi-step phases per the process queue. Each stage ends in a
  bivalent state.

## Sources

- **Primary**: Fischer, Lynch, Paterson. "Impossibility of
  Distributed Consensus with One Faulty Process." *Journal of
  the ACM*, Vol. 32, No. 2, April 1985, pp. 374–382.
  ACM Digital Library, DOI 10.1145/3149.214121 (TODO: verify the
  DOI / canonical URL before publishing). The local `flp.pdf` and
  `flp.txt` are gitignored — kept for reference, not redistributed
  (© ACM).
- **Henry Robinson, "A Brief Tour of FLP Impossibility"** —
  https://www.the-paper-trail.org/post/2008-08-13-a-brief-tour-of-flp-impossibility/
  *Fetched via WebFetch on 2026-05-20.* Gentle walkthrough,
  explicit translations (bivalent ≈ "undecided"), framing of the
  delaying mechanism in Lemma 3. Two verbatim quotes used above.
- **James Aspnes, "FischerLynchPaterson" (Yale pinewiki)** —
  https://www.cs.yale.edu/homes/aspnes/pinewiki/FischerLynchPaterson.html
  *Fetched via WebFetch on 2026-05-20.* Reformulated step model
  (combines receive + sends); adversary-game framing. One
  verbatim quote used above.
- **Chris Wirz, "The Impossibility of Distributed Consensus:
  Understanding the FLP Result"** —
  https://www.chriswirz.com/distributed-systems/flp-theorem
  *Surfaced by WebSearch on 2026-05-20; not fetched in full.*
  Listed for follow-up if we need a compact summary reference.
- **Lieu Zhenghong, "FLP Impossibility Theorem"** —
  https://www.lieuzhenghong.com/flp_theorem/
  *Surfaced by WebSearch; not fetched.* Listed for cross-checking
  phrasing.
- **Cornell CS6410 lecture slides on FLP (Gilad Turok)** —
  https://www.cs.cornell.edu/courses/cs6410/2025fa/slides/15-flp.pdf
  *Surfaced by WebSearch; not fetched.* Graduate-course pedagogy
  reference.
- **"Different Perspectives on FLP Impossibility" (arxiv
  survey)** — https://arxiv.org/html/2210.02695v9
  *Surfaced by WebSearch; not fetched.* Survey of reformulations
  and adjacent impossibility results.
- **Two Generals attribution** to Akkoyunlu, Ekanadham, Huber
  (1975) — *surfaced by WebSearch on 2026-05-20*, not verified
  against a primary source. Lamport often cited as the
  popularizer.

## What's NOT in this document (deliberately)

**[synth]** I haven't tried to capture:
- Mechanical proofs in Coq/TLA+ of FLP (exist; not needed for
  the talk).
- Quantum / probabilistic variants of the model (exist;
  off-topic).
- A formal comparison to FLP's own follow-on paper from the same
  authors (the JACM version IS the canonical paper).
- The full bibliography expansion (references 1–25 in the paper
  are cited inline above where used; others are extra-curricular).

If any of these turn into talk questions, we'd need to fetch
separately.
