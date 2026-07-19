// Pure positioning logic for the piecewise timeline. Node x is linear within
// its era band, clamped off the edges, with a minimum gap so same-year
// neighbors (Spinoza/Locke, both b. 1632) never stack on one pixel.
export const MIN_GAP = 14
export const LANES = 4

export function layoutEra(era, philosophers) {
  const members = philosophers
    .filter(p => p.era === era.id)
    .sort((a, b) => a.born - b.born)

  const placed = members.map((p, i) => {
    const pct = Math.min(0.96, Math.max(0.04, (p.born - era.start) / (era.end - era.start)))
    return { id: p.id, x: pct * era.width, lane: i % LANES }
  })
  for (let i = 1; i < placed.length; i++) {
    placed[i].x = Math.max(placed[i].x, placed[i - 1].x + MIN_GAP)
  }
  return placed
}

export function fmtRange(p) {
  if (p.died < 0) return `c. ${-p.born}–${-p.died} BCE`
  if (p.born < 0) return `c. ${-p.born} BCE – ${p.died} CE`
  if (p.died < 1000) return `${p.born}–${p.died} CE`
  return `${p.born}–${p.died}`
}

export function fmtEraYears(era) {
  const f = y => (y < 0 ? `${-y} BCE` : y < 1000 ? `${y} CE` : `${y}`)
  return `${f(era.start)} → ${f(era.end)}`
}
