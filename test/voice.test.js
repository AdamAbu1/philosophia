import { describe, it, expect } from 'vitest'
import {
  speakableText,
  nextSentences,
  flushRemainder,
  voiceProfileFor,
  isFemaleVoice,
  elevenVoiceFor,
  VOICE_REGISTER,
} from '../src/voice.js'

describe('speakableText', () => {
  it('replaces canon markers with names and collapses whitespace', () => {
    expect(speakableText('[[socrates]] taught [[plato]].\n\nBoth mattered.')).toBe(
      'Socrates taught Plato. Both mattered.',
    )
  })
  it('leaves unknown markers literal', () => {
    expect(speakableText('by [[zeus]]!')).toBe('by [[zeus]]!')
  })
})

describe('nextSentences (streaming chunker)', () => {
  it('emits nothing for an incomplete sentence', () => {
    const r = nextSentences('The unexamined life is not', 0)
    expect(r.sentences).toEqual([])
    expect(r.offset).toBe(0)
  })

  it('emits a completed sentence once trailing space arrives, tracking offset', () => {
    const text = 'The unexamined life is not worth living. And what of'
    const r = nextSentences(text, 0)
    expect(r.sentences).toEqual(['The unexamined life is not worth living.'])
    expect(text.slice(r.offset)).toBe('And what of')
  })

  it('merges a too-short sentence into the next', () => {
    const text = 'Quite so. But what do you mean by justice, friend? More'
    const r = nextSentences(text, 0)
    expect(r.sentences).toEqual(['Quite so. But what do you mean by justice, friend?'])
  })

  it('resumes from a prior offset without re-emitting', () => {
    const text = 'First complete thought arrives here. Second complete thought arrives here too. '
    const first = nextSentences(text, 0)
    const again = nextSentences(text, first.offset)
    expect(first.sentences.length + again.sentences.length).toBe(2)
    expect(again.sentences).not.toContain(first.sentences[0])
  })

  it('does not split decimal numbers', () => {
    const r = nextSentences('The ratio is 3.5 in every case he examined, no less. Next', 0)
    expect(r.sentences[0]).toContain('3.5')
  })
})

describe('flushRemainder', () => {
  it('returns the unspoken tail at stream end', () => {
    expect(flushRemainder('Said part. Unsaid tail without punctuation', 11)).toBe(
      'Unsaid tail without punctuation',
    )
  })
  it('ignores trivial leftovers', () => {
    expect(flushRemainder('All spoken. ', 12)).toBe('')
  })
})

describe('voice casting', () => {
  it('system profiles are deterministic and within range', () => {
    const a = voiceProfileFor('socrates')
    expect(voiceProfileFor('socrates')).toEqual(a)
    expect(a.pitch).toBeGreaterThanOrEqual(0.85)
    expect(a.pitch).toBeLessThanOrEqual(1.25)
    expect(a.rate).toBeGreaterThanOrEqual(0.9)
    expect(a.rate).toBeLessThanOrEqual(1.04)
  })

  it('distinct thinkers usually get distinct profiles', () => {
    expect(voiceProfileFor('socrates')).not.toEqual(voiceProfileFor('nietzsche'))
  })

  it('the guide and the canon women cast female voices', () => {
    expect(isFemaleVoice(null)).toBe(true)
    expect(isFemaleVoice('arendt')).toBe(true)
    expect(isFemaleVoice('socrates')).toBe(false)
  })

  it('elevenVoiceFor matches gender and is deterministic', () => {
    const voices = [
      { voice_id: 'v1', labels: { gender: 'male' } },
      { voice_id: 'v2', labels: { gender: 'female' } },
      { voice_id: 'v3', labels: { gender: 'male' } },
    ]
    const pick = elevenVoiceFor('socrates', voices)
    expect(['v1', 'v3']).toContain(pick.voice_id)
    expect(elevenVoiceFor('socrates', voices)).toEqual(pick)
    expect(elevenVoiceFor('arendt', voices).voice_id).toBe('v2')
  })

  it('falls back to the whole pool when no gender matches', () => {
    const voices = [{ voice_id: 'v9', labels: {} }]
    expect(elevenVoiceFor('arendt', voices).voice_id).toBe('v9')
  })
})

describe('voice register addendum', () => {
  it('asks for short spoken turns', () => {
    expect(VOICE_REGISTER).toContain('spoken conversation')
    expect(VOICE_REGISTER).toContain('eighty words')
  })
})
