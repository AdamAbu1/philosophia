import { describe, it, expect } from 'vitest'
import { searchPhilosophers, fold } from '../src/search.js'
import { PHILOSOPHERS } from '../src/data.js'

describe('fold', () => {
  it('strips diacritics and special letters', () => {
    expect(fold('Königsberg')).toBe('konigsberg')
    expect(fold('Søren')).toBe('soren')
    expect(fold('Röcken')).toBe('rocken')
  })
})

describe('searchPhilosophers', () => {
  const S = q => searchPhilosophers(q, PHILOSOPHERS)

  it('returns nothing for an empty query', () => {
    expect(S('')).toEqual([])
    expect(S('   ')).toEqual([])
  })

  it('word-prefix name matches rank first', () => {
    expect(S('kant')[0].id).toBe('kant')
    expect(S('arendt')[0].id).toBe('arendt')
    expect(S('wolls')[0].id).toBe('wollstonecraft')
  })

  it('is diacritic-tolerant across fields', () => {
    const kant = S('konigsberg').find(r => r.id === 'kant')
    expect(kant?.label).toBe('born at Königsberg')
    expect(S('soren')[0].id).toBe('kierkegaard')
  })

  it('matches schools with a label', () => {
    const ids = S('stoic').map(r => r.id)
    expect(ids).toContain('zeno')
    expect(ids).toContain('marcus')
  })

  it('matches works with a label', () => {
    const plato = S('republic').find(r => r.id === 'plato')
    expect(plato?.label).toContain('work')
  })

  it('matches idea titles', () => {
    const rawls = S('veil').find(r => r.id === 'rawls')
    expect(rawls?.label).toContain('idea')
  })

  it('caps results at 8', () => {
    expect(S('a').length).toBeLessThanOrEqual(8)
  })
})
