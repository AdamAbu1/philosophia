// Date formatting shared by the globe and the detail panel.
export function fmtRange(p) {
  if (p.died < 0) return `c. ${-p.born}–${-p.died} BCE`
  if (p.born < 0) return `c. ${-p.born} BCE – ${p.died} CE`
  if (p.died < 1000) return `${p.born}–${p.died} CE`
  return `${p.born}–${p.died}`
}
