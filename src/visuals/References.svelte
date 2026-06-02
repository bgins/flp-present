<script lang="ts">
  // references — the opening / front-matter slide. The paper's title up top,
  // then a 2x2 "atlas" of QR specimen plates: the paper, the source repo, and
  // the secondary sources we quote. Each code is rendered as OUR OWN ink SVG
  // modules (not a stock black-on-white image) so it lives in the design
  // language, and each is a square inscribed in a faint construction circle —
  // the QR (a machine's compass-and-grid figure) revealed as a Dürer-style
  // geometric construction. Plate captions are in the botanical/atlas voice
  // (Tab. I · …), echoing the buffer's `fig. —` specimen captions.
  import qrcode from 'qrcode-generator'

  type Ref = { num: string; title: string; sub: string; url: string; cx: number; cy: number }

  // 2x2, reading order. The paper links to the free author-hosted full text
  // (MIT CSAIL TDS), not the paywalled DOI — the opener is for going to read it.
  const refs: Ref[] = [
    { num: 'I', title: 'paper', sub: 'JACM · 1985',
      url: 'https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf', cx: 245, cy: 210 },
    { num: 'II', title: 'a tour', sub: 'the Paper Trail',
      url: 'https://www.the-paper-trail.org/post/2008-08-13-a-brief-tour-of-flp-impossibility/', cx: 555, cy: 210 },
    { num: 'III', title: 'notes', sub: 'Aspnes · Yale',
      url: 'https://www.cs.yale.edu/homes/aspnes/pinewiki/FischerLynchPaterson.html', cx: 245, cy: 418 },
    { num: 'IV', title: 'presentation', sub: 'bgins/flp-present',
      url: 'https://github.com/bgins/flp-present', cx: 555, cy: 418 },
  ]

  const R = 72 // construction-circle radius; the QR square is inscribed in it
  const QZ = 2 // quiet-zone modules (margin) added around the code

  // Static content, so compute the plates once.
  const plates = refs.map((ref) => {
    const qr = qrcode(0, 'M') // type 0 = auto-fit the smallest version
    qr.addData(ref.url)
    qr.make()
    const count = qr.getModuleCount()
    const side = R * Math.SQRT2 // square inscribed in the circle (corners on it)
    const ms = side / (count + QZ * 2) // module size incl. quiet-zone margin
    const left = ref.cx - side / 2
    const top = ref.cy - side / 2
    const mods: { x: number; y: number }[] = []
    for (let r = 0; r < count; r++)
      for (let c = 0; c < count; c++)
        if (qr.isDark(r, c)) mods.push({ x: left + (QZ + c) * ms, y: top + (QZ + r) * ms })
    return { ...ref, side, ms, left, top, mods }
  })
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <!-- Title (the paper) + venue line. -->
  <text class="ref-title" x="400" y="48">Impossibility of Distributed Consensus</text>
  <text class="ref-title" x="400" y="76">with One Faulty Process</text>
  <text class="ref-sub" x="400" y="102"
    >Fischer · Lynch · Paterson — Journal of the ACM, 1985</text
  >

  {#each plates as p (p.num)}
    <!-- Construction: the circle and the square inscribed in it (corners on the
         circle), under the code — geometry beneath the artifact. -->
    <circle class="ref-circle" cx={p.cx} cy={p.cy} r={R} />
    <rect class="ref-square" x={p.left} y={p.top} width={p.side} height={p.side} />

    <!-- The QR, as our own ink modules. -->
    {#each p.mods as m (m.x + ',' + m.y)}
      <rect class="ref-mod" x={m.x} y={m.y} width={p.ms} height={p.ms} />
    {/each}

    <!-- Specimen caption, atlas voice. -->
    <text class="ref-cap" x={p.cx} y={p.cy + R + 18}
      ><tspan class="tab">Tab. {p.num}</tspan> · {p.title}</text
    >
    <text class="ref-cap-sub" x={p.cx} y={p.cy + R + 32}>{p.sub}</text>
  {/each}
</svg>

<style>
  /* Warm sepia plate — the opener's ink shifts off the deck's neutral tones
     toward old printed-ink brown, so the dense QR fields sit warm on the
     cream instead of averaging to a cold gray. */
  svg {
    --w-ink: #382611;
    --w-muted: #6b5a3e;
    --w-faint: #ada082;
  }

  .ref-title {
    font-family: 'Geist Mono', monospace;
    font-size: 21px;
    font-weight: 600;
    fill: var(--w-ink);
    text-anchor: middle;
    letter-spacing: -0.01em;
  }
  .ref-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 11px;
    fill: var(--w-muted);
    text-anchor: middle;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .ref-circle {
    fill: none;
    stroke: var(--w-faint);
    stroke-width: 1;
  }
  .ref-square {
    fill: none;
    stroke: var(--w-faint);
    stroke-width: 0.7;
    opacity: 0.6;
  }
  .ref-mod {
    fill: var(--w-ink);
  }

  .ref-cap {
    font-family: 'Geist Mono', monospace;
    font-size: 12px;
    font-style: italic;
    fill: var(--w-ink);
    text-anchor: middle;
  }
  .ref-cap .tab {
    font-style: normal;
    fill: var(--w-muted);
  }
  .ref-cap-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    fill: var(--w-faint);
    text-anchor: middle;
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
</style>
