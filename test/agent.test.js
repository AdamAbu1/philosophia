import { describe, it, expect } from 'vitest'
import { PHILOSOPHERS, byId } from '../src/data.js'
import {
  buildRoster,
  serializeThinker,
  buildGuideSystem,
  buildPersonaSystem,
  citedIds,
  contextIds,
  buildUserTurn,
  parseMarkers,
} from '../src/agent.js'

describe('roster & serialization', () => {
  it('roster lists every thinker exactly once, keyed by id', () => {
    const lines = buildRoster().split('\n')
    expect(lines).toHaveLength(PHILOSOPHERS.length)
    for (const p of PHILOSOPHERS) {
      expect(lines.filter(l => l.startsWith(`${p.id} — `))).toHaveLength(1)
    }
  })

  it('serializes a full record with ideas, works, legacy, and influence markers', () => {
    const s = serializeThinker(byId.plato)
    expect(s).toContain('Plato [[plato]]')
    expect(s).toContain('Key ideas:')
    expect(s).toContain('Major works:')
    expect(s).toContain('Legacy:')
    expect(s).toContain('[[socrates]]') // drew from
    expect(s).toContain('[[aristotle]]') // went on to shape
  })
})

describe('system prompts', () => {
  it('guide prompt carries the no-quiz rule, marker protocol, and roster', () => {
    const sys = buildGuideSystem()
    expect(sys).toContain('never quiz or test')
    expect(sys).toContain('[[id]]')
    expect(sys).toContain('socrates — Socrates')
  })

  it('persona prompt speaks as the thinker and embeds their record', () => {
    const sys = buildPersonaSystem('nietzsche')
    expect(sys).toContain(`You are ${byId.nietzsche.name} (`)
    expect(sys).toContain('first person')
    expect(sys).toContain('never quiz or test')
    expect(sys).toContain('Do not write [[nietzsche]] for yourself')
  })
})

describe('citedIds', () => {
  it('extracts canon ids in order, deduped, ignoring unknowns', () => {
    expect(citedIds('so [[kant]] read [[hume]], and [[kant]] but not [[zeus]]')).toEqual([
      'kant',
      'hume',
    ])
  })
  it('tolerates empty input', () => {
    expect(citedIds('')).toEqual([])
    expect(citedIds(null)).toEqual([])
  })
})

describe('contextIds', () => {
  it('finds thinkers named mid-sentence', () => {
    const ids = contextIds('Did Nietzsche ever read Spinoza?')
    expect(ids).toContain('nietzsche')
    expect(ids).toContain('spinoza')
  })

  it('puts persona and selection first, and keeps last-reply subjects', () => {
    const ids = contextIds('what about his ethics?', {
      personaId: 'socrates',
      selectedId: 'plato',
      lastReply: 'That was [[kant]] at his sharpest.',
    })
    expect(ids.slice(0, 3)).toEqual(['socrates', 'plato', 'kant'])
  })

  it('caps the record set at 8', () => {
    const ids = contextIds('socrates plato aristotle kant hume spinoza nietzsche hegel marx mill', {})
    expect(ids.length).toBeLessThanOrEqual(8)
  })
})

describe('buildUserTurn', () => {
  it('wraps records ahead of the question, or passes the bare question', () => {
    const wrapped = buildUserTurn('Who was Kant?', ['kant'])
    expect(wrapped).toMatch(/^<records>\n### Immanuel Kant/)
    expect(wrapped).toMatch(/Who was Kant\?$/)
    expect(buildUserTurn('hello', [])).toBe('hello')
  })
})

describe('parseMarkers', () => {
  it('plain text passes through as one segment', () => {
    expect(parseMarkers('no thinkers here')).toEqual([{ type: 'text', text: 'no thinkers here' }])
  })

  it('renders canon markers as chips between text', () => {
    expect(parseMarkers('[[socrates]] taught [[plato]].')).toEqual([
      { type: 'chip', id: 'socrates' },
      { type: 'text', text: ' taught ' },
      { type: 'chip', id: 'plato' },
      { type: 'text', text: '.' },
    ])
  })

  it('leaves unknown ids as literal text', () => {
    expect(parseMarkers('by [[zeus]]!')).toEqual([
      { type: 'text', text: 'by ' },
      { type: 'text', text: '[[zeus]]' },
      { type: 'text', text: '!' },
    ])
  })

  it('hides a half-streamed trailing marker only while streaming', () => {
    expect(parseMarkers('as [[socr', { streaming: true })).toEqual([{ type: 'text', text: 'as ' }])
    expect(parseMarkers('as [', { streaming: true })).toEqual([{ type: 'text', text: 'as ' }])
    expect(parseMarkers('as [[socr')).toEqual([{ type: 'text', text: 'as [[socr' }])
  })

  it('completed markers still render while streaming continues', () => {
    expect(parseMarkers('[[plato]] then [[ari', { streaming: true })).toEqual([
      { type: 'chip', id: 'plato' },
      { type: 'text', text: ' then ' },
    ])
  })
})
