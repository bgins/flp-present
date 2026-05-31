<script lang="ts">
  import type { Scene, BufferMsg } from '../lib/types'
  import { sub } from '../lib/format'
  import {
    centroid,
    channelControl,
    channelPath,
    messageToken,
    type Pt,
    type Token,
  } from '../lib/geometry'

  let { scene }: { scene: Scene } = $props()

  const pts = $derived(
    scene.processes.map((p): Pt => ({ x: p.pos[0], y: p.pos[1] })),
  )
  const center = $derived(centroid(pts))
  const posById = $derived(
    new Map(
      scene.processes.map((p): [string, Pt] => [
        p.id,
        { x: p.pos[0], y: p.pos[1] },
      ]),
    ),
  )

  // Channels: every unordered process pair (3 for the standard layout).
  const channels = $derived.by(() => {
    const out: { key: string; d: string }[] = []
    const ps = scene.processes
    for (let i = 0; i < ps.length; i++) {
      for (let j = i + 1; j < ps.length; j++) {
        const a: Pt = { x: ps[i].pos[0], y: ps[i].pos[1] }
        const b: Pt = { x: ps[j].pos[0], y: ps[j].pos[1] }
        out.push({
          key: `${ps[i].id}-${ps[j].id}`,
          d: channelPath(a, channelControl(a, b, center), b),
        })
      }
    }
    return out
  })

  // Message tokens. Messages sharing a channel are spread evenly along it in
  // a canonical lo→hi orientation (so opposite-direction pairs land at
  // distinct points instead of stacking) and kept on the outward side.
  const tokens = $derived.by(() => {
    const groups: Record<string, BufferMsg[]> = {}
    for (const m of scene.buffer) {
      const key = [m.from, m.to].sort().join('-')
      ;(groups[key] ??= []).push(m)
    }

    const out: (BufferMsg & Token)[] = []
    for (const key of Object.keys(groups)) {
      const msgs = groups[key]
      const lo = key.split('-')[0]
      msgs.forEach((m, slot) => {
        const a = posById.get(m.from)
        const b = posById.get(m.to)
        if (!a || !b) return
        const ctrl = channelControl(a, b, center)
        const canonical = (slot + 1) / (msgs.length + 1)
        const t = m.from === lo ? canonical : 1 - canonical
        const diagonal = Math.abs(a.y - b.y) > 1
        out.push({
          ...m,
          ...messageToken(a, ctrl, b, center, t, diagonal ? 28 : 22),
        })
      })
    }
    return out
  })
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  {#each channels as ch (ch.key)}
    <path class="channel" d={ch.d} />
  {/each}

  {#each scene.processes as p (p.id)}
    <g
      class="process-node"
      class:faulty={p.faulty}
      transform="translate({p.pos[0]}, {p.pos[1]})"
    >
      <circle r="44" />
      <text class="process-label" y="-14">{sub(p.id)}</text>
      <text class="process-reg" y="12"
        ><tspan class="reg-name">x</tspan>={p.x}</text
      >
      <text class="process-reg" y="29">
        <tspan class="reg-name">y</tspan>=<tspan class="reg-blank">{p.y}</tspan>
      </text>
    </g>
  {/each}

  {#each tokens as t (t.id)}
    <text
      class="msg-inline"
      transform="translate({t.x}, {t.y}) rotate({t.angle})"
    >
      {#if t.flip}
        <tspan class="arrow">◀ </tspan><tspan class="id" dx="3">{t.id}</tspan
        ><tspan class="sep">&#160;::&#160;</tspan><tspan class="payload">{t.payload}</tspan>
      {:else}
        <tspan class="id">{t.id}</tspan><tspan class="sep">&#160;::&#160;</tspan><tspan
          class="payload">{t.payload}</tspan
        ><tspan class="arrow" dx="3"> ▶</tspan>
      {/if}
    </text>
  {/each}
</svg>

<style>
  .process-node circle {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 2.5;
  }
  .process-node text {
    font-family: 'Geist Mono', monospace;
    fill: var(--ink);
    text-anchor: middle;
    dominant-baseline: middle;
  }
  .process-label {
    font-size: 22px;
    font-weight: 700;
  }
  /* Scoped under .process-node so this outranks `.process-node text`
     (which sets dominant-baseline: middle) — a bare `.process-reg`
     loses on specificity and the alphabetic override is ignored. */
  .process-node .process-reg {
    font-size: 13px;
    fill: var(--ink-muted);
    letter-spacing: 0.04em;
    /* Alphabetic: under middle the plain `=N` run and the styled tspans
       (reg-name, reg-blank) land on different baselines (see memory). */
    dominant-baseline: alphabetic;
  }
  .process-reg .reg-name {
    fill: var(--ink);
  }
  .process-reg .reg-blank {
    fill: var(--bivalent);
    font-weight: 700;
  }

  .channel {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.2;
    opacity: 0.7;
  }

  .process-node.faulty circle {
    stroke: var(--accent-decide);
    stroke-dasharray: 4 3;
  }
  .process-node.faulty .process-label {
    fill: var(--accent-decide);
  }
  .process-node.faulty .process-reg .reg-name {
    fill: var(--accent-decide);
  }

  .msg-inline {
    font-family: 'Geist Mono', monospace;
    dominant-baseline: middle;
    text-anchor: middle;
    paint-order: stroke fill;
    stroke: var(--bg);
    stroke-width: 2.5;
    stroke-linejoin: round;
    letter-spacing: -0.02em;
  }
  .msg-inline .id {
    font-size: 14px;
    font-weight: 700;
    fill: var(--bivalent);
  }
  .msg-inline .sep {
    font-size: 13px;
    font-weight: 600;
    fill: var(--bivalent);
    opacity: 0.5;
    letter-spacing: -0.22em;
  }
  .msg-inline .payload {
    font-size: 13px;
    font-weight: 500;
    fill: var(--bivalent);
    opacity: 0.78;
  }
  .msg-inline .arrow {
    font-size: 14px;
    font-weight: 700;
    fill: var(--bivalent);
  }
</style>
