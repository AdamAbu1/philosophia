import { describe, it, expect } from 'vitest'
import { addClipping, getClippings, removeClipping, matchClippings } from '../src/codex.js'

describe('commonplace book store', () => {
  it('adds, dedupes by text, and removes', () => {
    const a = addClipping({ kind: 'idea', thinkerId: 'socrates', title: 'The elenchus', text: 'Question until the knower discovers he never knew.' })
    const dup = addClipping({ kind: 'idea', thinkerId: 'socrates', title: 'The elenchus', text: 'Question until the knower discovers he never knew.' })
    expect(dup.id).toBe(a.id)
    expect(getClippings()).toHaveLength(1)
    const b = addClipping({ kind: 'reply', thinkerId: null, text: 'A different passage entirely, about virtue.' })
    expect(getClippings()).toHaveLength(2)
    expect(getClippings()[0].id).toBe(b.id) // newest first
    removeClipping(a.id)
    expect(getClippings()).toHaveLength(1)
    removeClipping(b.id)
    expect(getClippings()).toHaveLength(0)
  })
})

describe('matchClippings', () => {
  const entries = [
    { id: '1', title: 'Flux', text: 'No one steps in the same river twice.' },
    { id: '2', title: null, text: 'Virtue is knowledge, and vice is ignorance of the good.' },
    { id: '3', title: 'Amor fati', text: 'Love your fate, which is in fact your life.' },
  ]
  it('ranks by word overlap and caps at k', () => {
    const m = matchClippings('what did I clip about virtue and knowledge?', entries)
    expect(m[0].id).toBe('2')
    expect(matchClippings('river fate virtue', entries, 2)).toHaveLength(2)
  })
  it('returns nothing for stop-word queries or no overlap', () => {
    expect(matchClippings('is it so', entries)).toEqual([])
    expect(matchClippings('quantum mechanics', entries)).toEqual([])
  })
})
