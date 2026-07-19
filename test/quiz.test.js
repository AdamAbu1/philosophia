import { describe, it, expect } from 'vitest'
import { buildRound } from '../src/quiz.js'
import { PHILOSOPHERS, byId } from '../src/data.js'

// Tiny deterministic rng for reproducible shuffles
function seededRng(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

describe('buildRound', () => {
  it('builds the requested number of questions', () => {
    expect(buildRound(PHILOSOPHERS, 5, seededRng(1)).length).toBe(5)
    expect(buildRound(PHILOSOPHERS, 3, seededRng(1)).length).toBe(3)
  })

  it('each question has 4 unique options containing the answer exactly once', () => {
    const round = buildRound(PHILOSOPHERS, 10, seededRng(42))
    for (const q of round) {
      expect(q.options.length).toBe(4)
      const ids = q.options.map(o => o.id)
      expect(new Set(ids).size).toBe(4)
      expect(ids.filter(id => id === q.answerId).length).toBe(1)
    }
  })

  it('question text embeds the answer\'s line', () => {
    const round = buildRound(PHILOSOPHERS, 5, seededRng(7))
    for (const q of round) {
      expect(q.q).toContain(byId[q.answerId].line)
    }
  })

  it('no philosopher is asked about twice in one round', () => {
    const round = buildRound(PHILOSOPHERS, 10, seededRng(9))
    const answers = round.map(q => q.answerId)
    expect(new Set(answers).size).toBe(answers.length)
  })

  it('is deterministic under a seeded rng', () => {
    const a = buildRound(PHILOSOPHERS, 5, seededRng(123))
    const b = buildRound(PHILOSOPHERS, 5, seededRng(123))
    expect(a).toEqual(b)
  })
})
