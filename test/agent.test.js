import { describe, it, expect } from 'vitest'
import { PHILOSOPHERS, byId } from '../src/data.js'
import {
  buildRoster,
  serializeThinker,
  buildGuideSystem,
  buildPersonaSystem,
  buildSymposiumSystem,
  symposiumMessages,
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

describe('symposium', () => {
  it('system prompt seats both thinkers and keeps the persona rules', () => {
    const sys = buildSymposiumSystem('nietzsche', 'buddha')
    expect(sys).toContain(`You are ${byId.nietzsche.name}`)
    expect(sys).toContain('symposium')
    expect(sys).toContain(byId.buddha.name)
    expect(sys).toContain('never quiz or test')
    expect(sys).toContain('first person')
  })

  it('replays own turns as assistant and attributes everyone else', () => {
    const events = [
      { who: 'user', text: 'Is suffering necessary?' },
      { who: 'nietzsche', text: 'Suffering is the whetstone.', blocks: [{ type: 'text', text: 'Suffering is the whetstone.' }] },
      { who: 'buddha', text: 'Suffering has a cause, and a cessation.' },
      { who: 'user', text: 'Can you both be right?' },
    ]
    const msgs = symposiumMessages(events, 'nietzsche', ['nietzsche', 'buddha'])
    expect(msgs[0]).toEqual({ role: 'user', content: 'The questioner says: Is suffering necessary?' })
    expect(msgs[1].role).toBe('assistant')
    expect(msgs[1].content).toEqual(events[1].blocks)
    expect(msgs[2]).toEqual({
      role: 'user',
      content: `${byId.buddha.name} says: Suffering has a cause, and a cessation.`,
    })
    expect(msgs[3].content).toContain('The questioner says: Can you both be right?')
    const cue = msgs[msgs.length - 1]
    expect(cue.role).toBe('user')
    expect(cue.content).toContain('<records>')
    expect(cue.content).toContain('your turn')
  })

  it('falls back to text when a turn has no stored blocks', () => {
    const msgs = symposiumMessages([{ who: 'buddha', text: 'Craving binds.' }], 'buddha', [])
    expect(msgs[0]).toEqual({ role: 'assistant', content: 'Craving binds.' })
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
