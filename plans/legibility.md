# FLP demo — legibility analysis

Notes on minimum text size for projection in our talk's expected
venue: a medium conference room with ~12 attendees. Research
captured 2026-05-21; bump targets pending application
(see TaskCreate #24).

## Spec — AVIXA DISCAS V202.01:2016

The audiovisual industry standard for "Display Image Size for 2D
Content in Audiovisual Systems" sets minimum on-screen element
height based on viewing distance, via two tiers:

| Tier | Acuity factor | When it applies | Min element height |
| --- | --- | --- | --- |
| **BDM** (Basic Decision Making) | 200 | reading text on slides, recognizing labels | FVD ÷ 200 |
| **ADM** (Analytical Decision Making) | 3438 | reading fine detail (spreadsheets, code) | image height × ratio |

BDM is the tier for a talk like ours. FVD = "Furthest Viewer
Distance."

Cross-check via visual angle (Snellen-style):

- 5 arcmin = acuity threshold (barely distinguishable)
- 10+ arcmin = "readable"
- 15+ arcmin = "comfortable"

Sources:

- [AVIXA — Display Image Size for 2D Content (DISCAS) overview](https://www.avixa.org/standards/discas-calculators/discas/learn-more-about-display-size)
- [AVIXA DISCAS calculators (BDM + ADM)](https://www.avixa.org/standards/discas-calculators)
- [Strong MDI — When bigger is better: DISCAS explained, with worked examples](https://strongmdi.com/blog/when-bigger-is-better-display-image-size-for-2d-content-in-audiovisual-systems-discas-the-new-infocomm-standard/)

## Math for our context

Assumed venue: medium conference room, ~12 attendees, furthest
viewer ~15 ft (180 in). Screen: ~70" wide 1080p projection. Pixel
density at native resolution ≈ 27.4 ppi (1920 px / 70 in).

| FVD | BDM min height (inches) | BDM min in CSS px @ 27 ppi |
| --- | --- | --- |
| 12 ft | 0.72 | ~20 px |
| 15 ft | 0.90 | ~24–25 px |
| 20 ft | 1.20 | ~33 px |

Primary target: the 15-ft column. If we test the room and find it
shallower (boardroom-style ~12 ft) we have headroom; if it's
deeper (~20 ft) we need #2 below.

Visual-angle check at 15 ft FVD on the spec'd projection (CSS
pixel size → on-screen height → arcmin):

| CSS px | On-screen | Arcmin @ 15 ft | Reading comfort |
| --- | --- | --- | --- |
| 19 px | 0.69 in | ~13 | ✓ comfortable |
| 14 px | 0.51 in | ~9.7 | ◐ borderline readable |
| 11 px | 0.40 in | ~7.6 | ✗ difficult |

## SVG scaling — important caveat

HTML elements (chrome bar, controls, essay, rail) render at
direct CSS pixel sizes — `font-size: 14px` in CSS = 14 projector
px at native 1080p.

**SVG elements scale.** The canvas column is 52% of the stage
width. On a 1920 px viewport, that's ~988 CSS px. The SVG's
viewBox is `0 0 800 600`, so the SVG fits to width at scale
988/800 ≈ 1.23×. A glyph specified as `font-size: 11px` inside
the SVG actually renders at ~13.6 CSS px.

This means SVG sub-labels are a touch more legible than their
viewBox font-size suggests, but not by much — and the smallest
ones (10–11 viewBox-px) still land at the difficult end.

## Current sketch sizes — audit

CSS px values shown are as written. For SVG elements, the
*rendered* CSS px at 1920 viewport ≈ 1.23× the value shown.

| Element | Where | Size | @ 15 ft verdict |
| --- | --- | --- | --- |
| Essay quote (italic, HTML) | essay | 19 px | ✓ comfortable |
| Note text (HTML) | essay | 15 px | ◐ borderline |
| Process node label (SVG) | canvas | 22 px → 27 | ✓ comfortable |
| Chrome bar / controls (HTML) | chrome / footer | 14 px | ◐ borderline readable |
| Rail row (`.b-row`, `.t-row`, HTML) | rail | 14 px | ◐ borderline |
| Rail head / cite / msg-inline id | rail / SVG | 13 px → ~16 SVG | ◐ borderline |
| Buffer divider, `.b-null .tag`, msg payload | rail / SVG | 12 px → ~15 SVG | ◐ borderline |
| Process register (`x=0`, `y=b`, SVG) | canvas | 11 px → ~13.5 | ✗ below comfortable |
| Region labels (lemma3 sketch, SVG) | canvas | 10–11 px → ~13 | ✗ below comfortable |
| `.l3-legend`, `.l3-region-sub` | canvas | 10–11 px → ~13 | ✗ below comfortable |
| `.cq-msg .pl` (construction sketch) | canvas | 11 px → ~13.5 | ✗ below comfortable |

Essay column and headline canvas elements are fine. The rail and
small SVG sub-labels are below BDM threshold for the 15-ft FVD.

## Remediation options

In order of how much they change the design:

1. **Conservative bump** (recommended starting point). Raise the
   smallest sizes to clear BDM:
   - 10–11 px → 13 px
   - 12 px → 13–14 px
   - 13–14 px → 15 px
   - Essay / process-label sizes stay (they're already
     comfortable).
   - Design language and proportions preserved.
   - Cheapest. Most likely to reflow rail column slightly —
     verify in Chrome after applying.

2. **Aggressive bump.** All body-tier text → 16–18 px minimum.
   The rail becomes more prominent — possibly a good thing for
   pedagogy. Likely requires recomposing rail column width
   (15% → 17–18%) and possibly tightening the canvas column.
   Reserve for a deliberate redesign pass.

3. **Presenter-side fix** (no design change). Run the browser at
   1366×768 viewport rather than 1920×1080 on the projector. Same
   CSS sizes, but each CSS pixel becomes ~1.4× larger on the
   projection. 14 px CSS → ~20 px on screen → ~14 arcmin at
   15 ft, comfortable.
   - Pros: zero design change, instantly reversible.
   - Cons: lower-density rendering may look softer depending on
     projector behavior; the projection-tuned design lock
     (font-size choices in `plan.md`) is partially bypassed.

## Recommendation

Apply #1 (conservative bump on rail + small SVG labels), test in
a real room, then layer in #3 if still cramped. Reserve #2 for a
deliberate redesign. Apply the bump uniformly across all six
sketches so the locked aesthetic stays consistent.

## Concrete bump targets

Apply across all sketches in `sketches/`. CSS selectors below are
HTML unless marked (SVG); SVG values are in viewBox units.

| CSS class / selector | Current | Target | Notes |
| --- | --- | --- | --- |
| `.rail-head` | 13 px | 15 px | section heads |
| `.b-row` | 14 px | 15 px | buffer entries |
| `.b-row .pl` | 13 px | 14 px | payload text |
| `.b-div` | 12 px | 14 px | ∅ steps divider |
| `.b-null` | 14 px | 15 px | (p, ∅) entries |
| `.b-null .tag` | 12 px | 13 px | "faulty" tag |
| `.t-row` | 14 px | 15 px | trace rows |
| `.cite` | 13 px | 14 px | paper citation |
| `.note` | 15 px | keep | presenter aside |
| `.process-reg` (SVG) | 11 px | 13 px | x= / y= labels |
| `.msg-inline .id` (SVG) | 13 px | 14 px | message id chip |
| `.msg-inline .payload` (SVG) | 12 px | 13 px | message payload |
| `.l3-region-label` (SVG, sketch 04) | 14 px | keep | already at threshold |
| `.l3-region-sub`, `.l3-legend`, `.l3-claim-callout` (SVG, sketch 04) | 10–11 px | 13 px | small sub-labels |
| `.cq-rule-text` (SVG, sketch 05) | 12 px | 13 px | rule-footer text |
| `.cq-msg .id` / `.cq-msg .pl` (SVG, sketch 05) | 12 / 11 px | 13 / 13 px | per-process queue rows |
| `.cq-section-head` (SVG, sketch 05) | 11 px | 13 px | // PROCESS QUEUE etc. |
| `.cq-col-head` (SVG, sketch 05) | 12 px | 13 px | [ pₙ's queue ] |
| `.cq-rule-text .step` (SVG, sketch 05) | 10 px | 12 px | "stage N ::" prefix |
| `.l2-σ-trace` (SVG, sketch 03) | 11.5 px | 13 px | schedule trace lines |
| `.l2-σ-label` (SVG, sketch 03) | 11 px | 13 px | schedule frame label |
| `.l2-col-head` (SVG, sketch 03) | 13 px | 14 px | column titles |
| `.l2-decide .verb` (SVG, sketch 03) | 11 px | 13 px | "DECIDE" label |
| `.sd-obs-row` (SVG, sketch 01) | 11.5 px | 13 px | observation rows |
| `.sd-obs-head`, `.sd-col-head`, `.sd-tag` (SVG, sketch 01) | 10.5–12 px | 13 px | header labels |
| `.sd-banner-sub` (SVG, sketch 01) | 11 px | 13 px | banner subtitle |
| `.vt-edge-label`, `.vt-leaf text`, `.vt-V-text` etc. (SVG, sketch 02) | 11–14 px | 13–14 px | tree decoration |
| `.vt-wedge-sub` (SVG, sketch 02) | 10 px | 12 px | "(many stages)" tag |

## Open questions for follow-up

- **Test in actual venue.** Measure actual FVD, screen size,
  projector resolution. If the room differs from the 15-ft / 70"
  / 1080p assumption, recompute the BDM target and re-audit.
- **Rail reflow.** Does the rail still hold its 15% column width
  after the bump, or do we need to widen to ~17–18%?
- **Process register placement.** At 13 px the `x=0`, `y=b` lines
  may need more vertical room inside each process node circle
  (currently r=44 viewBox-units).
- **Inactive scene opacity.** Scenes at opacity 0.28 (the
  before/after context in the essay column) may be too faded
  after the bump — consider 0.4–0.5 if they're hard to scan.
- **Centaur watermark.** Currently 80×20 at opacity 0.5 in
  bottom-right. Verify it stays distinct from any reflowed rail
  bottom after the bump.

## Status

**Research:** complete (this document).

**Application:** done — applied to the Svelte components (not the
sketches), verified by screenshot per visual.

Deviations from the conservative table above:

- **FVD revised to ~30 ft** (the room is deeper than the 15-ft
  assumption). Rather than ~2× every size, fullscreen mode carries
  the diagram — its canvas scales ~2× over the 3-column view — so
  the bumps target the persistent UI (rail, chrome) and the
  smallest SVG sub-labels, which compound with the fullscreen
  scale. The zoom-mode rail widened 16rem → 18rem.
- **Box-filling labels couldn't grow.** Bumping them overflowed
  their containers, so they were reverted or tracked tighter:
  `.sd-obs-head` (11px + 0.12em), `.cq-rule-text` (kept 12px),
  `.vt-badge` (11px + 0.12em), `.l3-legend` (kept 11px).
- **In-circle registers capped.** `.sd-proc .reg` / `.l2-reg` went
  to 11px (not 13) to fit the r=28 circles; `.process-reg` (r=44)
  took the full 13px.
- **Valency badge dropped.** Bumping the chrome valency badge made
  it dominate the header; left at 14px — the border + color carry
  it.
