<script lang="ts">
  // blockchain-chain (scene: blockchain_closer). The deck's one step outside the
  // paper: §4's honest-majority quorum, in practice. Three QR "blocks" — the FLP
  // wall and its two escapes (randomness, real time) — rendered as our own ink
  // modules like the opener, and joined by interlaced chain-links (Dürer's Six
  // Knots / Leonardo's "concatenation": cords woven over and under). Bookends
  // the opener's QR atlas; a chain of blocks, literally. Warm-sepia ink, like
  // the opener.
  import qrcode from 'qrcode-generator'

  type Block = { url: string; label: string; sub: string; cx: number }
  const SIDE = 150
  const QZ = 2
  const cy = 268

  const blocks: Block[] = [
    { url: 'https://timroughgarden.github.io/fob21/', label: 'the wall', sub: 'Foundations of Blockchains', cx: 180 },
    { url: 'https://bitcoin.org/bitcoin.pdf', label: 'randomness', sub: 'Bitcoin', cx: 400 },
    { url: 'https://arxiv.org/abs/1807.04938', label: 'real time', sub: 'Tendermint', cx: 620 },
  ]

  const plates = blocks.map((b) => {
    const qr = qrcode(0, 'M')
    qr.addData(b.url)
    qr.make()
    const count = qr.getModuleCount()
    const ms = SIDE / (count + QZ * 2)
    const left = b.cx - SIDE / 2
    const top = cy - SIDE / 2
    const mods: { x: number; y: number }[] = []
    for (let r = 0; r < count; r++)
      for (let c = 0; c < count; c++)
        if (qr.isDark(r, c)) mods.push({ x: left + (QZ + c) * ms, y: top + (QZ + r) * ms })
    return { ...b, left, top, ms, mods }
  })

  // An interlocked ring-pair spanning each gap between consecutive blocks — a
  // light decorative chain. Elongated ovals whose outer ends tuck just under
  // the blocks (which are cream-filled, masking the tucked ends), so the chain
  // reads as touching the QR codes.
  const RX = 24
  const RY = 10
  const D = 13 // half the link separation; the pair overlaps to interlock
  const links = blocks.slice(0, -1).map((b, i) => {
    const gapC = (b.cx + blocks[i + 1].cx) / 2
    return { ax: gapC - D, bx: gapC + D }
  })
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  <!-- Interlaced chain-links between the blocks (drawn under the blocks). -->
  {#each links as l, i (i)}
    <ellipse class="bc-link" cx={l.ax} cy={cy} rx={RX} ry={RY} />
    <ellipse class="bc-link" cx={l.bx} cy={cy} rx={RX} ry={RY} />
  {/each}

  <!-- Blocks: a framed square of our own QR ink modules. -->
  {#each plates as p (p.url)}
    <rect class="bc-block" x={p.left} y={p.top} width={SIDE} height={SIDE} />
    {#each p.mods as m (m.x + ',' + m.y)}
      <rect class="bc-mod" x={m.x} y={m.y} width={p.ms} height={p.ms} />
    {/each}
    <text class="bc-label" x={p.cx} y={p.top + SIDE + 26}>{p.label}</text>
    <text class="bc-sub" x={p.cx} y={p.top + SIDE + 42}>{p.sub}</text>
  {/each}
</svg>

<style>
  svg {
    --w-ink: #382611;
    --w-muted: #6b5a3e;
    --w-faint: #ada082;
  }

  .bc-block {
    fill: var(--bg);
    stroke: var(--w-ink);
    stroke-width: 1.6;
  }
  .bc-mod {
    fill: var(--w-ink);
  }

  .bc-link {
    fill: none;
    stroke: var(--w-faint);
    stroke-width: 1.2;
  }

  .bc-label {
    font-family: 'Geist Mono', monospace;
    font-size: 13px;
    font-style: italic;
    fill: var(--w-ink);
    text-anchor: middle;
    dominant-baseline: alphabetic;
  }
  .bc-sub {
    font-family: 'Geist Mono', monospace;
    font-size: 10px;
    fill: var(--w-muted);
    text-anchor: middle;
    dominant-baseline: alphabetic;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
</style>
