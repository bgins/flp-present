<script lang="ts">
  // config-stack (scenes: punchline, window_of_vulnerability). The infinite run
  // rendered as a receding stack of configuration disks — each disk encircles
  // the three processes + a buffer core (one configuration), tilted 10° and
  // fanned to the right, fading toward infinity: the run that never ends, every
  // stage bivalent. With `crash`, a faulty p₃ (broken red) enters partway down
  // the stack and pollutes every configuration after it, forever (the window of
  // vulnerability). Extends the deck's rota / construction-circle language: a
  // configuration drawn as a Dürer compass-disk, the run as a column of
  // specimen plates receding to the vanishing point.
  let { crash = false }: { crash?: boolean } = $props()

  const N = 18
  const R0 = 144
  const SHRINK = 0.9
  const FADE = 0.8
  const CRASH_AT = 4

  type Disk = { cx: number; cy: number; r: number; op: number; i: number }
  const disks: Disk[] = []
  let cx = 252
  const cy = 296
  for (let i = 0; i < N; i++) {
    const r = R0 * Math.pow(SHRINK, i)
    disks.push({ cx, cy, r, op: Math.max(0.04, Math.pow(FADE, i)), i })
    cx += r * 0.47
  }
  // Back-to-front so the near (large, left) disk sits on top.
  const order = [...disks].reverse()

  // Process seats within a unit disk (the run's p₁ / p₂ / p₃ triangle).
  const seats = [
    [-0.46, -0.3],
    [0.46, -0.3],
    [0, 0.48], // p₃ — the one that may go faulty
  ]

  // The buffer core as a chambered rota — three light partition walls at the
  // inverted phase of the process triangle, so each chamber faces a process and
  // the spokes cut against the disk's 10° tilt (the geometric contrast).
  const ROTA_R = 0.17
  const walls = [30, 150, 270].map((deg) => {
    const a = (deg * Math.PI) / 180
    return [Math.cos(a) * ROTA_R, Math.sin(a) * ROTA_R]
  })
</script>

<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
  {#each order as d (d.i)}
    {@const polluted = crash && d.i >= CRASH_AT}
    <g transform="translate({d.cx} {d.cy}) rotate(10)" opacity={d.op}>
      <circle class="cs-disk" class:polluted r={d.r} />
      <line
        class="cs-link"
        x1={seats[0][0] * d.r}
        y1={seats[0][1] * d.r}
        x2={seats[1][0] * d.r}
        y2={seats[1][1] * d.r}
      />
      <line
        class="cs-link"
        x1={seats[0][0] * d.r}
        y1={seats[0][1] * d.r}
        x2={seats[2][0] * d.r}
        y2={seats[2][1] * d.r}
      />
      <line
        class="cs-link"
        x1={seats[1][0] * d.r}
        y1={seats[1][1] * d.r}
        x2={seats[2][0] * d.r}
        y2={seats[2][1] * d.r}
      />
      <circle class="cs-core" r={ROTA_R * d.r} />
      {#each walls as w, wi (wi)}
        <line class="cs-wall" x1="0" y1="0" x2={w[0] * d.r} y2={w[1] * d.r} />
      {/each}
      <circle
        class="cs-proc"
        cx={seats[0][0] * d.r}
        cy={seats[0][1] * d.r}
        r={0.09 * d.r}
      />
      <circle
        class="cs-proc"
        cx={seats[1][0] * d.r}
        cy={seats[1][1] * d.r}
        r={0.09 * d.r}
      />
      <circle
        class="cs-proc"
        class:faulty={polluted}
        cx={seats[2][0] * d.r}
        cy={seats[2][1] * d.r}
        r={0.09 * d.r}
      />
    </g>
  {/each}
</svg>

<style>
  .cs-disk {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 1;
  }
  .cs-disk.polluted {
    stroke: var(--accent-decide);
  }
  .cs-link {
    stroke: var(--ink);
    stroke-width: 0.8;
    opacity: 0.4;
  }
  .cs-core {
    fill: none;
    stroke: var(--bivalent);
    stroke-width: 1.4;
  }
  .cs-wall {
    stroke: var(--ink);
    stroke-width: 0.8;
    opacity: 0.15;
  }
  .cs-proc {
    fill: var(--bg-raised);
    stroke: var(--ink);
    stroke-width: 1.5;
  }
  .cs-proc.faulty {
    fill: var(--bg);
    stroke: var(--accent-decide);
    stroke-dasharray: 3 2;
  }
</style>
