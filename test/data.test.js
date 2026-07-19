import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { ERAS, PHILOSOPHERS, byId, eraById } from '../src/data.js'

describe('philosopher data schema', () => {
  it('has unique ids', () => {
    const ids = PHILOSOPHERS.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every entry has the required fields', () => {
    for (const p of PHILOSOPHERS) {
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(typeof p.born).toBe('number')
      expect(typeof p.died).toBe('number')
      expect(p.school).toBeTruthy()
      expect(p.blurb.length).toBeGreaterThan(40)
      expect(p.line).toBeTruthy()
      expect(Array.isArray(p.influences)).toBe(true)
      expect(p.tradition).toBe('western')
      expect(p.portrait).toBe(`portraits/${p.id}.png`)
    }
  })

  it('every portrait file exists on disk', () => {
    for (const p of PHILOSOPHERS) {
      expect(existsSync(join(process.cwd(), 'public', p.portrait)), p.id).toBe(true)
    }
  })

  it('birth precedes death', () => {
    for (const p of PHILOSOPHERS) expect(p.born).toBeLessThan(p.died)
  })

  it('every era reference resolves', () => {
    for (const p of PHILOSOPHERS) expect(eraById[p.era]).toBeDefined()
  })

  it('every influence reference resolves to a known philosopher', () => {
    for (const p of PHILOSOPHERS) {
      for (const inf of p.influences) {
        expect(byId[inf], `${p.id} → ${inf}`).toBeDefined()
        expect(inf).not.toBe(p.id)
      }
    }
  })

  it('influences point backward in time', () => {
    for (const p of PHILOSOPHERS) {
      for (const inf of p.influences) {
        expect(byId[inf].born, `${p.id} influenced by ${inf}`).toBeLessThan(p.born)
      }
    }
  })

  it('eras are contiguous-ish and ordered', () => {
    for (let i = 1; i < ERAS.length; i++) {
      expect(ERAS[i].start).toBeGreaterThan(ERAS[i - 1].start)
      expect(ERAS[i].end).toBeGreaterThan(ERAS[i].start)
    }
  })

  it('every era has at least one philosopher', () => {
    for (const e of ERAS) {
      expect(PHILOSOPHERS.some(p => p.era === e.id), e.id).toBe(true)
    }
  })
})
