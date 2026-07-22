import { describe, it, expect } from 'vitest'
import { byId } from '../src/data.js'
import {
  sessionFromMessages,
  wrapLines,
  fitTitleSpacing,
  transcriptText,
  tweetUrl,
  captionFor,
  weightedLength,
  SITE,
} from '../src/broadsheet.js'

const symp = { a: 'socrates', b: 'nietzsche' }
const messages = [
  { role: 'user', question: 'Is suffering good for us?' },
  { role: 'assistant', speakerId: 'socrates', text: 'Let us first ask what [[nietzsche]] means by good.', blocks: [] },
  { role: 'user', question: 'Answer plainly, both of you.' },
  { role: 'assistant', speakerId: 'nietzsche', text: 'Plainly then: yes.', blocks: [] },
  { role: 'assistant', speakerId: 'socrates', text: '', streaming: true }, // dropped
]

describe('sessionFromMessages', () => {
  it('extracts question, attributed turns, and strips markers', () => {
    const s = sessionFromMessages(messages, symp)
    expect(s.question).toBe('Is suffering good for us?')
    expect(s.turns).toEqual([
      { who: 'socrates', text: `Let us first ask what ${byId.nietzsche.name} means by good.` },
      { who: 'user', text: 'Answer plainly, both of you.' },
      { who: 'nietzsche', text: 'Plainly then: yes.' },
    ])
    expect(s.a).toBe('socrates')
    expect(s.b).toBe('nietzsche')
  })
})

describe('wrapLines', () => {
  const measure = s => s.length * 10 // 10px per char stub
  it('wraps at the width without splitting words', () => {
    expect(wrapLines('alpha beta gamma delta', 120, measure)).toEqual([
      'alpha beta',
      'gamma delta',
    ])
  })
  it('a word wider than the line stands alone', () => {
    expect(wrapLines('tiny extraordinarily tiny', 120, measure)).toEqual([
      'tiny',
      'extraordinarily',
      'tiny',
    ])
  })
  it('keeps short text on one line', () => {
    expect(wrapLines('brief', 120, measure)).toEqual(['brief'])
  })
})

describe('fitTitleSpacing', () => {
  // width grows with spacing: base + spacing * glyphCount
  const measureAt = glyphs => s => 400 + s * glyphs
  it('keeps the widest spacing that fits', () => {
    expect(fitTitleSpacing(measureAt(40), 1120)).toBe(10) // 400+400=800 ≤ 1120
  })
  it('steps down when the widest overflows (the conversation-title case)', () => {
    // 49 glyphs: 10px→890 fits 1120? 400+490=890 ≤1120 → 10. Make it tighter:
    expect(fitTitleSpacing(measureAt(80), 1120)).toBe(8) // 10→1200>1120, 8→1040≤1120
  })
  it('falls back to the tightest step when nothing fits', () => {
    expect(fitTitleSpacing(measureAt(200), 500)).toBe(2)
  })
})

describe('captionFor', () => {
  it('names the cast and links the site for a symposium', () => {
    const s = sessionFromMessages(messages, symp)
    const cap = captionFor(s)
    expect(cap).toContain('Socrates & Nietzsche, a symposium in Philosophia')
    expect(cap).toContain(`https://${SITE}`)
    expect(cap).toContain('“Is suffering good for us?”')
  })

  it('reads as a conversation for a solo session', () => {
    const s = sessionFromMessages([{ role: 'user', question: 'Why?' }], { solo: 'socrates' })
    expect(captionFor(s)).toContain('a conversation with Socrates')
  })

  it('never exceeds X’s 280-character limit, trimming the question', () => {
    const longQ = 'Whether the examined life is truly worth living '.repeat(12).trim()
    const s = sessionFromMessages([{ role: 'user', question: longQ }], { solo: 'socrates' })
    const cap = captionFor(s)
    expect(cap.length).toBeLessThanOrEqual(280)
    expect(cap).toContain('…')
    expect(cap).toContain('a conversation with Socrates')
    expect(cap).toContain(SITE)
  })

  it('stays within X’s WEIGHTED limit for a long CJK question (CJK counts double)', () => {
    const longHan = '學而時習之不亦說乎有朋自遠方來不亦樂乎'.repeat(12) // ~228 Han chars
    const s = sessionFromMessages([{ role: 'user', question: longHan }], { solo: 'confucius' })
    const cap = captionFor(s)
    expect(weightedLength(cap)).toBeLessThanOrEqual(280)
    expect(cap.length).toBeLessThanOrEqual(280) // weighted ≥ code units, so this holds too
    expect(cap).toContain('…')
    expect(cap).toContain('a conversation with')
  })
})

describe('weightedLength', () => {
  it('counts Latin as 1 and CJK as 2', () => {
    expect(weightedLength('abc')).toBe(3)
    expect(weightedLength('中文')).toBe(4)
    expect(weightedLength('a中')).toBe(3)
  })
})

describe('solo conversations', () => {
  const soloMessages = [
    { role: 'user', question: 'What is courage?' },
    { role: 'assistant', text: 'Courage, friend, may be knowing what to fear.', blocks: [] },
    { role: 'user', question: 'Even death?' },
    { role: 'assistant', text: 'Especially that.', blocks: [] },
  ]

  it('attributes every reply to the solo thinker', () => {
    const s = sessionFromMessages(soloMessages, { solo: 'socrates' })
    expect(s.solo).toBe('socrates')
    expect(s.question).toBe('What is courage?')
    expect(s.turns.map(t => t.who)).toEqual(['socrates', 'user', 'socrates'])
  })

  it('the guide publishes as Lady Philosophia', () => {
    const s = sessionFromMessages(soloMessages, { solo: null })
    expect(s.solo).toBe('philosophia')
    const t = transcriptText(s)
    expect(t).toContain('A CONVERSATION')
    expect(t).toContain('with Lady Philosophia')
    expect(t).toContain('LADY PHILOSOPHIA — Courage')
  })

  it('solo transcript and tweet name the thinker', () => {
    const s = sessionFromMessages(soloMessages, { solo: 'socrates' })
    expect(transcriptText(s)).toContain('with Socrates')
    expect(decodeURIComponent(tweetUrl(s))).toContain('a conversation with Socrates')
  })
})

describe('transcript & tweet', () => {
  const s = sessionFromMessages(messages, symp)
  it('transcript carries names, question, attributed turns, and the site', () => {
    const t = transcriptText(s)
    expect(t).toContain('PHILOSOPHIA · A SYMPOSIUM')
    expect(t).toContain('“Is suffering good for us?”')
    expect(t).toContain('SOCRATES — Let us first ask')
    expect(t).toContain('THE QUESTIONER — Answer plainly')
    expect(t).toContain(SITE)
  })
  it('tweet url embeds question, names, and link', () => {
    const u = tweetUrl(s)
    expect(u).toContain('twitter.com/intent/tweet')
    expect(decodeURIComponent(u)).toContain('Socrates & Nietzsche')
    expect(decodeURIComponent(u)).toContain(SITE)
  })
})
