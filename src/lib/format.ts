const SUBS = '₀₁₂₃₄₅₆₇₈₉'

/** Render digits in an id as subscripts: "p1" → "p₁", "m12" → "m₁₂". */
export function sub(s: string): string {
  return s.replace(/\d/g, (d) => SUBS[+d])
}

/** Trace target: bare message ids get bracketed; everything else (e.g.
 *  "(p2, ∅)") is just subscripted. */
export function formatTarget(s: string): string {
  return /^m\d+$/.test(s) ? `[${sub(s)}]` : sub(s)
}
