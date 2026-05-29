// Channel + message-token geometry for the canvas visual. The 3-process
// layout is fixed (positions come from the scene), so channels and labels
// are derived from those coordinates rather than hand-placed per the sketch.

export interface Pt {
  x: number
  y: number
}

export function centroid(pts: Pt[]): Pt {
  const n = pts.length || 1
  let sx = 0
  let sy = 0
  for (const p of pts) {
    sx += p.x
    sy += p.y
  }
  return { x: sx / n, y: sy / n }
}

/**
 * Quadratic control point: the a–b midpoint pushed outward, away from `away`
 * (the network centroid), so channels bow toward the outside of the triangle.
 */
export function channelControl(a: Pt, b: Pt, away: Pt, bow = 42): Pt {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
  const ox = mid.x - away.x
  const oy = mid.y - away.y
  const len = Math.hypot(ox, oy) || 1
  return { x: mid.x + (ox / len) * bow, y: mid.y + (oy / len) * bow }
}

export function channelPath(a: Pt, ctrl: Pt, b: Pt): string {
  return `M ${a.x},${a.y} Q ${ctrl.x},${ctrl.y} ${b.x},${b.y}`
}

function bezierPoint(a: Pt, ctrl: Pt, b: Pt, t: number): Pt {
  const mt = 1 - t
  return {
    x: mt * mt * a.x + 2 * mt * t * ctrl.x + t * t * b.x,
    y: mt * mt * a.y + 2 * mt * t * ctrl.y + t * t * b.y,
  }
}

export interface Token {
  x: number
  y: number
  angle: number
  /** True when the channel angle would render text upside down. */
  flip: boolean
}

/**
 * Placement for a message label riding the a→b channel: a point offset
 * perpendicular (outward from `away`), rotated to the channel tangent, with a
 * flip flag set when the text would otherwise be upside down.
 */
export function messageToken(
  a: Pt,
  ctrl: Pt,
  b: Pt,
  away: Pt,
  t = 0.5,
  offset = 24,
): Token {
  const pos = bezierPoint(a, ctrl, b, t)
  // Tangent of the quadratic Bézier at t.
  const tx = 2 * (1 - t) * (ctrl.x - a.x) + 2 * t * (b.x - ctrl.x)
  const ty = 2 * (1 - t) * (ctrl.y - a.y) + 2 * t * (b.y - ctrl.y)
  const tlen = Math.hypot(tx, ty) || 1
  let nx = -ty / tlen
  let ny = tx / tlen
  // Flip the normal so it points away from the centroid.
  if (nx * (pos.x - away.x) + ny * (pos.y - away.y) < 0) {
    nx = -nx
    ny = -ny
  }
  let angle = (Math.atan2(ty, tx) * 180) / Math.PI
  const flip = angle > 90 || angle < -90
  if (flip) angle += 180
  return { x: pos.x + nx * offset, y: pos.y + ny * offset, angle, flip }
}
