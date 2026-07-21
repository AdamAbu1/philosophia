// Voice conversation core: browser speech recognition in, sentence-streamed
// speech out. Two speech engines — free system voices (per-thinker pitch/rate
// profile) and, when the user supplies an ElevenLabs key, characterful voices
// picked deterministically from their library.
import { byId } from './data.js'
import { parseMarkers } from './agent.js'

const EL_KEY_STORE = 'philosophia.elevenLabsKey'

const store = {
  get(k) {
    try { return localStorage.getItem(k) } catch { return null }
  },
  set(k, v) {
    try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v) } catch { /* private mode */ }
  },
}
export const getElevenLabsKey = () => store.get(EL_KEY_STORE)
export const setElevenLabsKey = k => store.set(EL_KEY_STORE, k || null)

export function voiceSupport() {
  const w = typeof window === 'undefined' ? {} : window
  return {
    stt: !!(w.SpeechRecognition || w.webkitSpeechRecognition),
    tts: typeof w.speechSynthesis !== 'undefined',
  }
}

// ---- text preparation -------------------------------------------------------

// Replies carry [[id]] markers for the chip renderer; speech wants names.
export function speakableText(text) {
  return parseMarkers(text)
    .map(seg => (seg.type === 'chip' ? byId[seg.id].name : seg.text))
    .join('')
    .replace(/\s+/g, ' ')
    .trim()
}

// Incremental sentence splitter for streaming TTS: given the accumulated reply
// and how much has already been spoken, returns complete new sentences and the
// new offset. Short fragments wait for more text so the voice doesn't stutter.
const SENTENCE_END = /([.!?…]["')\]]?)(\s+)/g

export function nextSentences(text, offset, { minLen = 25 } = {}) {
  const pending = text.slice(offset)
  const sentences = []
  let consumed = 0
  SENTENCE_END.lastIndex = 0
  let m
  while ((m = SENTENCE_END.exec(pending))) {
    const end = m.index + m[1].length
    // A too-short fragment stays unconsumed and merges with the next sentence.
    if (end - consumed >= minLen) {
      sentences.push(pending.slice(consumed, end).trim())
      consumed = m.index + m[0].length
    }
  }
  return { sentences: sentences.filter(Boolean), offset: offset + consumed }
}

// Everything unspoken at stream end, worth saying if non-trivial.
export function flushRemainder(text, offset) {
  const rest = text.slice(offset).trim()
  return rest.length > 1 ? rest : ''
}

// ---- per-thinker voice profiles --------------------------------------------

function hash(s) {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return h
}

// The records carry no gender field by design; this small set exists only so
// voice casting doesn't hand the canon's women a baritone.
const FEMALE_IDS = new Set(['hypatia', 'conway', 'arendt', 'beauvoir', 'weil', 'anscombe'])
export const isFemaleVoice = id => id == null || FEMALE_IDS.has(id) // null = Lady Philosophia, the guide

// System-voice profile: deterministic, modest variation so personas differ.
export function voiceProfileFor(id) {
  const h = hash(id ?? 'philosophia')
  return {
    pitch: (isFemaleVoice(id) ? 1.05 : 0.85) + ((h % 20) / 100), // 0.85–1.25
    rate: 0.9 + ((h >>> 5) % 14) / 100, // 0.90–1.03
  }
}

// Ancients and medievals should sound aged; early moderns middle-aged; only
// the 20th century may draw a young voice. null = any age (the guide included).
const AGE_PREF = {
  pre: ['old', 'middle_aged'],
  cla: ['old', 'middle_aged'],
  hel: ['old', 'middle_aged'],
  med: ['old', 'middle_aged'],
  ren: ['middle_aged', 'old'],
  enl: ['middle_aged', 'old'],
  c19: ['middle_aged', 'old'],
  c20: null,
}
const agePrefFor = id => (id == null ? null : AGE_PREF[byId[id]?.era] ?? null)

// Accent casting. Nationality pins first: the canon's Americans should sound
// American and its British Isles thinkers British. Non-western traditions
// match accents when the library offers them. Every other old-world thinker
// prefers non-American voices — but only once the library holds at least
// MIN_ACCENT_BENCH of them, so a default (US-heavy) library doesn't collapse
// the whole ancient world onto two British narrators.
const AMERICAN_IDS = new Set(['james', 'peirce', 'quine', 'rawls', 'searle', 'kripke'])
const BRITISH_IDS = new Set([
  'bacon', 'hobbes', 'locke', 'berkeley', 'hume', 'bentham', 'mill',
  'russell', 'wollstonecraft', 'anscombe',
])
const BRITISH_ACCENTS = ['british', 'english', 'scottish', 'irish', 'welsh', 'australian']
const TRADITION_ACCENTS = {
  chinese: ['chinese'],
  indian: ['indian'],
  islamic: ['arabic', 'persian', 'turkish', 'egyptian'],
  jewish: ['hebrew', 'israeli'],
  japanese: ['japanese'],
  african: ['african', 'nigerian', 'ethiopian'],
}
const MIN_ACCENT_BENCH = 3

// Exported for tests. Narrows a (gender/age-filtered) pool by accent.
export function accentPool(id, pool) {
  const accent = v => (v.labels?.accent ?? '').toLowerCase()
  if (id && AMERICAN_IDS.has(id)) {
    const m = pool.filter(v => accent(v) === 'american')
    return m.length ? m : pool
  }
  if (id && BRITISH_IDS.has(id)) {
    const m = pool.filter(v => BRITISH_ACCENTS.some(a => accent(v).includes(a)))
    return m.length ? m : pool
  }
  if (id == null) return pool // the guide is placeless
  const tradition = TRADITION_ACCENTS[byId[id]?.tradition]
  if (tradition) {
    const m = pool.filter(v => tradition.some(a => accent(v).includes(a)))
    if (m.length) return m
  }
  const m = pool.filter(v => accent(v) && accent(v) !== 'american')
  return m.length >= MIN_ACCENT_BENCH ? m : pool
}

// ElevenLabs: pick a voice deterministically from the account's library,
// gender-matched and era-age-matched, stable across sessions (sorted by
// voice_id). Age narrows the pool only when the library can satisfy it.
export function elevenVoiceFor(id, voices) {
  const wantFemale = isFemaleVoice(id)
  const byGender = voices.filter(v => {
    const g = (v.labels?.gender ?? '').toLowerCase()
    return wantFemale ? g === 'female' : g === 'male'
  })
  let pool = byGender.length ? byGender : voices
  const pref = agePrefFor(id)
  if (pref) {
    const aged = pool.filter(v => pref.includes((v.labels?.age ?? '').toLowerCase()))
    if (aged.length) pool = aged
  }
  pool = accentPool(id, pool)
  pool = pool.slice().sort((a, b) => a.voice_id.localeCompare(b.voice_id))
  if (!pool.length) return null
  return pool[hash(id ?? 'philosophia') % pool.length]
}

// ---- speakers ---------------------------------------------------------------

// Queue-based speaker over the Web Speech API.
class SystemSpeaker {
  constructor(profile, { onStart, onIdle } = {}) {
    this.profile = profile
    this.onStart = onStart
    this.onIdle = onIdle
    this.pending = 0
    this.stopped = false
  }

  enqueue(sentence) {
    if (this.stopped || !sentence) return
    const u = new SpeechSynthesisUtterance(sentence)
    u.pitch = this.profile.pitch
    u.rate = this.profile.rate
    this.pending++
    u.onstart = () => this.onStart?.()
    u.onend = u.onerror = () => {
      this.pending--
      if (this.pending <= 0 && !this.stopped) this.onIdle?.()
    }
    speechSynthesis.speak(u)
  }

  stop() {
    this.stopped = true
    this.pending = 0
    speechSynthesis.cancel()
  }
}

// Queue-based speaker over the ElevenLabs TTS API (user's own key, called
// directly from the browser). Sentences are fetched in order and played
// back-to-back; the next clip downloads while the current one plays.
class ElevenSpeaker {
  constructor(apiKey, voiceId, { onStart, onIdle, onError } = {}) {
    this.apiKey = apiKey
    this.voiceId = voiceId
    this.onStart = onStart
    this.onIdle = onIdle
    this.onError = onError
    this.queue = Promise.resolve()
    this.pending = 0
    this.stopped = false
    this.audio = null
  }

  async fetchClip(sentence) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${this.voiceId}?output_format=mp3_44100_64`,
      {
        method: 'POST',
        headers: { 'xi-api-key': this.apiKey, 'content-type': 'application/json' },
        body: JSON.stringify({ text: sentence, model_id: 'eleven_turbo_v2_5' }),
      },
    )
    if (!res.ok) throw new Error(`ElevenLabs ${res.status}`)
    return URL.createObjectURL(await res.blob())
  }

  enqueue(sentence) {
    if (this.stopped || !sentence) return
    this.pending++
    const clip = this.fetchClip(sentence) // download starts immediately
    this.queue = this.queue
      .then(async () => {
        if (this.stopped) return
        const url = await clip
        if (this.stopped) return URL.revokeObjectURL(url)
        await new Promise(resolve => {
          this.audio = new Audio(url)
          this.audio.onplay = () => this.onStart?.()
          this.audio.onended = this.audio.onerror = () => {
            URL.revokeObjectURL(url)
            resolve()
          }
          this.audio.play().catch(resolve)
        })
      })
      .catch(err => this.onError?.(err))
      .finally(() => {
        this.pending--
        if (this.pending <= 0 && !this.stopped) this.onIdle?.()
      })
  }

  stop() {
    this.stopped = true
    this.pending = 0
    try { this.audio?.pause() } catch { /* already gone */ }
  }
}

let elevenVoicesCache = null

// Resolve the right speaker for a thinker: ElevenLabs when a key is present
// and reachable, system voices otherwise.
export async function makeSpeaker(personaId, callbacks = {}) {
  const key = getElevenLabsKey()
  if (key) {
    try {
      if (!elevenVoicesCache) {
        const res = await fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': key } })
        if (!res.ok) throw new Error(`ElevenLabs ${res.status}`)
        elevenVoicesCache = (await res.json()).voices ?? []
      }
      const voice = elevenVoiceFor(personaId, elevenVoicesCache)
      if (voice) return new ElevenSpeaker(key, voice.voice_id, callbacks)
    } catch (err) {
      callbacks.onError?.(err) // fall through to system voices
    }
  }
  if (!voiceSupport().tts) return null
  return new SystemSpeaker(voiceProfileFor(personaId), callbacks)
}

// ---- listener ---------------------------------------------------------------

// Thin wrapper over SpeechRecognition: one utterance per start(), interim
// transcripts for live display, final transcript on the browser's endpointing.
export function makeListener({ onInterim, onFinal, onEnd, onError }) {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!Ctor) return null
  const rec = new Ctor()
  rec.continuous = false
  rec.interimResults = true
  rec.lang = 'en-US'
  let finalText = ''
  rec.onresult = e => {
    let interim = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const t = e.results[i][0].transcript
      if (e.results[i].isFinal) finalText += t
      else interim += t
    }
    onInterim?.(finalText + interim)
  }
  rec.onerror = e => onError?.(e.error)
  rec.onend = () => {
    const said = finalText.trim()
    finalText = ''
    if (said) onFinal?.(said)
    onEnd?.()
  }
  return {
    start() {
      try { rec.start() } catch { /* already started */ }
    },
    stop() {
      try { rec.stop() } catch { /* not started */ }
    },
    abort() {
      finalText = ''
      try { rec.abort() } catch { /* not started */ }
    },
  }
}

// Spoken-register addendum for the system prompt while conversing aloud.
export const VOICE_REGISTER = `

This is a spoken conversation — your reply will be read aloud. Keep each turn to a few conversational sentences (roughly under eighty words) unless asked to go deeper. No lists, no headings. It is fine to end on a question when it serves the exchange.`
