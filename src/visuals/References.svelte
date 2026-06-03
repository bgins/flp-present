<script lang="ts">
  // references — the opening / front-matter slide. The paper's title up top,
  // then a "quincunx" atlas of QR specimen plates: the paper at the center
  // (the origin), the four sources we send people to at the corners — the
  // classic five-figure (dice-five / Browne's Garden of Cyrus planting
  // pattern), the atlas voice's natural answer to a fifth citation. Each code
  // is rendered as OUR OWN ink SVG modules (not a stock black-on-white image)
  // so it lives in the design language, and each is a square inscribed in a
  // faint construction circle — the QR (a machine's compass-and-grid figure)
  // revealed as a Dürer-style geometric construction. Faint spokes run from the
  // center plate to each corner (stopping at the circle edges, never crossing a
  // code): the paper at the heart of its own literature, sources radiating out.
  // Plate captions are in the botanical/atlas voice (Tab. I · …), echoing the
  // buffer's `fig. —` specimen captions.
  import qrcode from 'qrcode-generator'

  type Ref = { num: string; title: string; sub: string; url: string; cx: number; cy: number }

  // The paper links to the free author-hosted full text (MIT CSAIL TDS), not the
  // paywalled DOI — the opener is for going to read it. Lamport likewise links to
  // his own author-hosted Paxos Made Simple (the secondary source we quote on the
  // window-of-vulnerability slide).
  const center: Ref = {
    num: 'I', title: 'paper', sub: 'JACM · 1985',
    url: 'https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf', cx: 400, cy: 330,
  }
  // Corners in reading order (top-left, top-right, bottom-left, bottom-right).
  const corners: Ref[] = [
    { num: 'II', title: 'a tour', sub: 'the Paper Trail',
      url: 'https://www.the-paper-trail.org/post/2008-08-13-a-brief-tour-of-flp-impossibility/', cx: 235, cy: 215 },
    { num: 'III', title: 'notes', sub: 'Aspnes · Yale',
      url: 'https://www.cs.yale.edu/homes/aspnes/pinewiki/FischerLynchPaterson.html', cx: 565, cy: 215 },
    { num: 'IV', title: 'presentation', sub: 'bgins/flp-present',
      url: 'https://github.com/bgins/flp-present', cx: 235, cy: 445 },
    { num: 'V', title: 'Paxos', sub: 'Lamport · 2001',
      url: 'https://lamport.azurewebsites.net/pubs/paxos-simple.pdf', cx: 565, cy: 445 },
  ]
  const refs: Ref[] = [center, ...corners]

  const R = 66 // construction-circle radius; the QR square is inscribed in it
  const QZ = 2 // quiet-zone modules (margin) added around the code

  // Browne's reticulated "Network": the rhombic lattice an orchard of
  // quincunxes tiles into. Basis vectors run center→corner; the lattice is two
  // families of parallel lines. The plate circles are filled with the page
  // cream (below), so the net is masked under every plate — it reads as ambient
  // substrate with the five plates as clearings, never as lines converging on a
  // hub. Drawn faint, like the paper-grain watermark.
  const v1 = { x: 165, y: 115 } // center → bottom-right / top-left corner
  const v2 = { x: 165, y: -115 } // center → top-right / bottom-left corner
  const NET_STEP = 0.5 // half-basis pitch — a finer mesh than the plate spacing
  const NET_RANGE = 10 // half-steps each side of center
  const NET_EXT = 6 // line half-length in lattice units (clipped by the viewBox)
  const net: { x1: number; y1: number; x2: number; y2: number }[] = []
  for (let j = -NET_RANGE; j <= NET_RANGE; j++) {
    const px = center.cx + j * NET_STEP * v2.x
    const py = center.cy + j * NET_STEP * v2.y
    net.push({ x1: px - NET_EXT * v1.x, y1: py - NET_EXT * v1.y, x2: px + NET_EXT * v1.x, y2: py + NET_EXT * v1.y })
  }
  for (let i = -NET_RANGE; i <= NET_RANGE; i++) {
    const px = center.cx + i * NET_STEP * v1.x
    const py = center.cy + i * NET_STEP * v1.y
    net.push({ x1: px - NET_EXT * v2.x, y1: py - NET_EXT * v2.y, x2: px + NET_EXT * v2.x, y2: py + NET_EXT * v2.y })
  }

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
  <!-- The reticulated Network, behind everything. -->
  {#each net as n, i (i)}
    <line class="ref-net" x1={n.x1} y1={n.y1} x2={n.x2} y2={n.y2} />
  {/each}
  <!-- Cream band masking the net behind the title type. -->
  <rect class="ref-mask" x="0" y="0" width="800" height="124" />

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

  .ref-net {
    stroke: var(--w-faint);
    stroke-width: 0.5;
    opacity: 0.16;
  }
  /* Page cream — masks the net under the title and inside each plate. */
  .ref-mask {
    fill: var(--bg);
  }
  .ref-circle {
    fill: var(--bg);
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
