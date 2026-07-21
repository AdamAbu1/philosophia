import { describe, it, expect } from 'vitest'
import { ITINERARIES, itineraryById } from '../src/itineraries.js'
import { byId } from '../src/data.js'

describe('itineraries', () => {
  it('ships five routes with unique ids', () => {
    expect(ITINERARIES).toHaveLength(5)
    expect(new Set(ITINERARIES.map(r => r.id)).size).toBe(5)
    for (const r of ITINERARIES) expect(itineraryById[r.id]).toBe(r)
  })

  it('every route has a name, a blurb, and at least three stops', () => {
    for (const r of ITINERARIES) {
      expect(r.name.length).toBeGreaterThan(3)
      expect(r.blurb.length).toBeGreaterThan(10)
      expect(r.stops.length).toBeGreaterThanOrEqual(3)
    }
  })

  it('every stop is a canon thinker with a narration line, no immediate repeats', () => {
    for (const r of ITINERARIES) {
      r.stops.forEach((s, i) => {
        expect(byId[s.id], `${r.id} → ${s.id}`).toBeTruthy()
        expect(s.line.length, `${r.id} → ${s.id} line`).toBeGreaterThan(20)
        if (i > 0) expect(s.id).not.toBe(r.stops[i - 1].id)
      })
    }
  })
})
