// Pure geo helpers for the globe view.
import { geoDistance } from 'd3-geo'

export const YEAR_MIN = -650
export const YEAR_MAX = 2015

// Era label for the scrubber readout: latest era whose start we've passed.
export function eraFor(year, eras) {
  let current = eras[0]
  for (const e of eras) if (year >= e.start) current = e
  return current
}

export function fmtYear(y) {
  const r = Math.round(y)
  return r < 0 ? `${-r} BCE` : `${r}`
}

// A point is drawable when it faces the viewer (within ~90° of the projection center).
export function isFrontside([lon, lat], rotation) {
  return geoDistance([lon, lat], [-rotation[0], -rotation[1]]) < Math.PI / 2 - 0.02
}

// Same-city births would stack on one pixel; fan them out on a small ring.
// Deterministic: depends only on input order.
export function displayCoords(philosophers) {
  const seen = {}
  const out = {}
  for (const p of philosophers) {
    const key = `${p.place.lat.toFixed(1)},${p.place.lon.toFixed(1)}`
    const n = (seen[key] = (seen[key] || 0) + 1) - 1
    out[p.id] =
      n === 0
        ? [p.place.lon, p.place.lat]
        : [p.place.lon + 0.9 * Math.cos(n * 2.4), p.place.lat + 0.9 * Math.sin(n * 2.4)]
  }
  return out
}

// When a jump targets someone not yet born at the current scrub year,
// move time to the end of their life so they and their world are visible.
export function yearForSelection(p, year) {
  return year < p.born ? p.died : year
}
