import { describe, it, expect } from 'vitest'
import {
  YEAR_MIN, YEAR_MAX, eraFor, fmtYear, isFrontside, displayCoords, yearForSelection,
} from '../src/geo.js'
import { ERAS, PHILOSOPHERS } from '../src/data.js'

describe('eraFor', () => {
  it('maps years to eras by start threshold', () => {
    expect(eraFor(-650, ERAS).name).toBe('Axial Age')
    expect(eraFor(-400, ERAS).name).toBe('Classical')
    expect(eraFor(1200, ERAS).name).toBe('Medieval')
    expect(eraFor(1770, ERAS).name).toBe('Enlightenment')
    expect(eraFor(1950, ERAS).name).toBe('20th Century')
  })
})

describe('fmtYear', () => {
  it('formats BCE and CE', () => {
    expect(fmtYear(-650)).toBe('650 BCE')
    expect(fmtYear(1781)).toBe('1781')
    expect(fmtYear(1780.7)).toBe('1781')
  })
})

describe('isFrontside', () => {
  it('shows the projection center and hides the antipode', () => {
    expect(isFrontside([20, 40], [-20, -40])).toBe(true)
    expect(isFrontside([-160, -40], [-20, -40])).toBe(false)
  })
})

describe('displayCoords', () => {
  const coords = displayCoords(PHILOSOPHERS)

  it('gives every philosopher unique display coordinates', () => {
    const keys = Object.values(coords).map(([lon, lat]) => `${lon.toFixed(3)},${lat.toFixed(3)}`)
    expect(new Set(keys).size).toBe(PHILOSOPHERS.length)
  })

  it('stays within ~1.2 degrees of the true birthplace', () => {
    for (const p of PHILOSOPHERS) {
      const [lon, lat] = coords[p.id]
      expect(Math.abs(lon - p.place.lon)).toBeLessThan(1.2)
      expect(Math.abs(lat - p.place.lat)).toBeLessThan(1.2)
    }
  })
})

describe('yearForSelection', () => {
  it('advances time to a not-yet-born target', () => {
    const kant = PHILOSOPHERS.find(p => p.id === 'kant')
    expect(yearForSelection(kant, -650)).toBe(1804)
  })
  it('leaves time alone when the target already exists', () => {
    const kant = PHILOSOPHERS.find(p => p.id === 'kant')
    expect(yearForSelection(kant, 1770)).toBe(1770)
    expect(yearForSelection(kant, 1900)).toBe(1900)
  })

  it('jumps to the present for living thinkers', () => {
    const searle = PHILOSOPHERS.find(p => p.id === 'searle')
    expect(yearForSelection(searle, -650)).toBe(YEAR_MAX)
  })
})

describe('place data', () => {
  it('every philosopher has a named birthplace with valid coordinates', () => {
    for (const p of PHILOSOPHERS) {
      expect(p.place?.name, p.id).toBeTruthy()
      expect(Math.abs(p.place.lat), p.id).toBeLessThanOrEqual(90)
      expect(Math.abs(p.place.lon), p.id).toBeLessThanOrEqual(180)
    }
  })
  it('year range covers every lifetime', () => {
    for (const p of PHILOSOPHERS) {
      expect(p.born).toBeGreaterThanOrEqual(YEAR_MIN)
      if (p.died != null) expect(p.died).toBeLessThanOrEqual(YEAR_MAX)
    }
  })
})
