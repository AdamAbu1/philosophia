import { describe, it, expect } from 'vitest'
import { layoutEra, fmtRange, fmtEraYears, MIN_GAP, LANES } from '../src/layout.js'
import { ERAS, PHILOSOPHERS } from '../src/data.js'

describe('layoutEra', () => {
  it('places every member of the era exactly once', () => {
    for (const era of ERAS) {
      const placed = layoutEra(era, PHILOSOPHERS)
      const expected = PHILOSOPHERS.filter(p => p.era === era.id)
      expect(placed.length).toBe(expected.length)
      expect(new Set(placed.map(n => n.id)).size).toBe(expected.length)
    }
  })

  it('enforces the minimum gap between neighbors', () => {
    for (const era of ERAS) {
      const placed = layoutEra(era, PHILOSOPHERS)
      for (let i = 1; i < placed.length; i++) {
        expect(placed[i].x - placed[i - 1].x).toBeGreaterThanOrEqual(MIN_GAP)
      }
    }
  })

  it('separates same-birth-year neighbors (Spinoza / Locke)', () => {
    const ren = ERAS.find(e => e.id === 'ren')
    const placed = layoutEra(ren, PHILOSOPHERS)
    const spinoza = placed.find(n => n.id === 'spinoza')
    const locke = placed.find(n => n.id === 'locke')
    expect(Math.abs(spinoza.x - locke.x)).toBeGreaterThanOrEqual(MIN_GAP)
  })

  it('clamps out-of-band births into the band (Hegel in c19)', () => {
    const c19 = ERAS.find(e => e.id === 'c19')
    const placed = layoutEra(c19, PHILOSOPHERS)
    for (const n of placed) {
      expect(n.x).toBeGreaterThan(0)
      expect(n.x).toBeLessThan(c19.width)
    }
  })

  it('cycles lanes 0..3', () => {
    const cla = ERAS.find(e => e.id === 'cla')
    const placed = layoutEra(cla, PHILOSOPHERS)
    placed.forEach((n, i) => expect(n.lane).toBe(i % LANES))
  })
})

describe('date formatting', () => {
  it('formats BCE-only lives', () => {
    expect(fmtRange({ born: -624, died: -546 })).toBe('c. 624–546 BCE')
  })
  it('formats BCE→CE straddlers', () => {
    expect(fmtRange({ born: -4, died: 65 })).toBe('c. 4 BCE – 65 CE')
  })
  it('formats early CE lives', () => {
    expect(fmtRange({ born: 354, died: 430 })).toBe('354–430 CE')
  })
  it('formats modern lives without suffix', () => {
    expect(fmtRange({ born: 1905, died: 1980 })).toBe('1905–1980')
  })
  it('formats era spans', () => {
    expect(fmtEraYears({ start: -650, end: -480 })).toBe('650 BCE → 480 BCE')
    expect(fmtEraYears({ start: 1400, end: 1700 })).toBe('1400 → 1700')
  })
})
