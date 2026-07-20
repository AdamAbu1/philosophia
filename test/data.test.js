import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { ERAS, PHILOSOPHERS, byId, eraById } from '../src/data.js'
import { DETAILS } from '../src/details.js'
import { EDGES } from '../src/edges.js'
import { WORK_LINKS } from '../src/works.js'

describe('curated work links', () => {
  it('every curated key matches an actual work string exactly', () => {
    for (const [pid, table] of Object.entries(WORK_LINKS)) {
      const p = byId[pid]
      expect(p, pid).toBeDefined()
      for (const key of Object.keys(table)) {
        expect(p.works, `${pid}: "${key}"`).toContain(key)
      }
    }
  })

  it('curated links are wikipedia articles, not searches', () => {
    for (const table of Object.values(WORK_LINKS)) {
      for (const url of Object.values(table)) {
        expect(url).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\//)
      }
    }
  })
})

describe('influence edges and reading links', () => {
  it('every influence pair has an edge annotation', () => {
    for (const p of PHILOSOPHERS) {
      for (const inf of p.influences) {
        expect(EDGES[`${inf}>${p.id}`]?.length, `${inf}>${p.id}`).toBeGreaterThan(20)
      }
    }
  })

  it('no orphan edge annotations', () => {
    const valid = new Set(
      PHILOSOPHERS.flatMap(p => p.influences.map(inf => `${inf}>${p.id}`)),
    )
    for (const key of Object.keys(EDGES)) {
      expect(valid.has(key), key).toBe(true)
    }
  })

  it('every philosopher has well-formed further-reading links', () => {
    for (const p of PHILOSOPHERS) {
      expect(p.links.length, p.id).toBeGreaterThanOrEqual(1)
      for (const l of p.links) {
        expect(l.label).toBeTruthy()
        expect(l.url, p.id).toMatch(/^https:\/\//)
      }
    }
  })
})

describe('detail content', () => {
  it('DETAILS keys exactly match philosopher ids', () => {
    expect(new Set(Object.keys(DETAILS))).toEqual(new Set(PHILOSOPHERS.map(p => p.id)))
  })

  it('every philosopher has full detail content', () => {
    for (const p of PHILOSOPHERS) {
      expect(p.bio?.length, `${p.id} bio`).toBeGreaterThan(80)
      expect(p.ideas?.length, `${p.id} ideas`).toBeGreaterThanOrEqual(2)
      for (const i of p.ideas) {
        expect(i.title, p.id).toBeTruthy()
        expect(i.text?.length, `${p.id} idea text`).toBeGreaterThan(40)
      }
      expect(p.works?.length, `${p.id} works`).toBeGreaterThanOrEqual(1)
      expect(p.legacy?.length, `${p.id} legacy`).toBeGreaterThan(40)
    }
  })

  it('influenced is the exact inverse of influences', () => {
    for (const p of PHILOSOPHERS) {
      for (const inf of p.influences) {
        expect(byId[inf].influenced, `${inf} should list ${p.id}`).toContain(p.id)
      }
      for (const heir of p.influenced) {
        expect(byId[heir].influences, `${heir} should cite ${p.id}`).toContain(p.id)
      }
    }
  })
})

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
      expect(p.died === null || typeof p.died === 'number', `${p.id} died`).toBe(true)
      expect(p.school).toBeTruthy()
      expect(p.blurb.length).toBeGreaterThan(40)
      expect(p.line).toBeTruthy()
      expect(Array.isArray(p.influences)).toBe(true)
      expect(['western', 'chinese', 'indian', 'islamic', 'jewish', 'japanese', 'african']).toContain(p.tradition)
      expect(p.portrait).toBe(`portraits/${p.id}.jpg`)
    }
  })

  it('every portrait and thumbnail file exists on disk', () => {
    for (const p of PHILOSOPHERS) {
      expect(existsSync(join(process.cwd(), 'public', p.portrait)), p.id).toBe(true)
      expect(existsSync(join(process.cwd(), 'public', p.thumb)), `${p.id} thumb`).toBe(true)
    }
    // the agent's guide medallion (Lady Philosophia) ships with the portrait set
    expect(existsSync(join(process.cwd(), 'public', 'portraits/philosophia.jpg'))).toBe(true)
  })

  it('birth precedes death for closed lives', () => {
    for (const p of PHILOSOPHERS) {
      if (p.died != null) expect(p.born).toBeLessThan(p.died)
    }
  })

  it('living thinkers are explicitly marked with died: null', () => {
    const living = PHILOSOPHERS.filter(p => p.died === null).map(p => p.id)
    expect(living).toEqual(['searle'])
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
