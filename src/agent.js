// Conversational agent core: BYOK Anthropic client, grounded context assembly,
// and the [[id]] marker protocol that turns mentions into globe-flying chips.
// The API key never leaves this browser except to api.anthropic.com.
import Anthropic from '@anthropic-ai/sdk'
import { PHILOSOPHERS, byId, eraById } from './data.js'
import { searchPhilosophers } from './search.js'
import { fmtRange } from './format.js'

export const MODELS = [
  { id: 'claude-opus-4-8', label: 'Opus 4.8 — deepest' },
  { id: 'claude-sonnet-5', label: 'Sonnet 5 — balanced' },
  { id: 'claude-haiku-4-5', label: 'Haiku 4.5 — fastest' },
]
export const DEFAULT_MODEL = 'claude-opus-4-8'

const KEY_STORE = 'philosophia.apiKey'
const MODEL_STORE = 'philosophia.model'

const store = {
  get(k) {
    try { return localStorage.getItem(k) } catch { return null }
  },
  set(k, v) {
    try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v) } catch { /* private mode */ }
  },
}
export const getApiKey = () => store.get(KEY_STORE)
export const setApiKey = k => store.set(KEY_STORE, k)
export const clearApiKey = () => store.set(KEY_STORE, null)
export const getModel = () => MODELS.some(m => m.id === store.get(MODEL_STORE)) ? store.get(MODEL_STORE) : DEFAULT_MODEL
export const setModel = m => store.set(MODEL_STORE, m)

// ---- canon serialization ----------------------------------------------------

const meta = p =>
  [fmtRange(p), p.school !== '—' ? p.school : null, p.place.name, eraById[p.era].name, p.tradition]
    .filter(Boolean)
    .join(' · ')

export function buildRoster() {
  return PHILOSOPHERS.map(p => `${p.id} — ${p.name} (${meta(p)})`).join('\n')
}

export function serializeThinker(p) {
  return [
    `### ${p.name} [[${p.id}]] (${meta(p)})`,
    `"${p.line}" — ${p.blurb}`,
    `Who they were: ${p.bio}`,
    `Key ideas: ${p.ideas.map(i => `${i.title} — ${i.text}`).join(' | ')}`,
    `Major works: ${p.works.join('; ')}`,
    `Legacy: ${p.legacy}`,
    p.influences.length ? `Drew from: ${p.influences.map(id => `[[${id}]]`).join(' ')}` : null,
    p.influenced.length ? `Went on to shape: ${p.influenced.map(id => `[[${id}]]`).join(' ')}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

// ---- system prompts ---------------------------------------------------------

const SHARED_RULES = `Marker protocol: the first time a reply mentions any thinker in the canon below, write [[id]] in place of their name — e.g. "Along with [[hume]], ..." — it renders as their name and turns the globe to them. Later mentions in the same reply use the plain name. Never use [[...]] for anyone outside the canon.

Style: plain prose, no markdown syntax, no bullet lists unless asked. Conversational length — one to three short paragraphs unless the question calls for depth. This atlas exists purely to expand its owner's knowledge: never quiz or test the user, never score answers.

Grounding: entries from the atlas may be supplied in <records> tags with each question — treat them as the atlas's own text and stay consistent with them. You may draw on well-established history of philosophy beyond them, and say plainly when something is uncertain or contested. Thinkers outside the canon can be discussed freely by plain name; when relevant, relate them back to canon figures.`

export function buildGuideSystem() {
  return `You are the resident guide of Philosophia — a personal, engraved-globe atlas of ${PHILOSOPHERS.length} thinkers across the world's philosophical traditions. You answer questions about thinkers, schools, ideas, and how they connect across time and place, in the voice of a learned, warm, and unhurried companion.

${SHARED_RULES}

The canon (id — name, dates, school, birthplace, era, tradition):
${buildRoster()}`
}

export function buildPersonaSystem(id) {
  const p = byId[id]
  return `You are ${p.name} (${meta(p)}), conversing in first person with the owner of Philosophia, an engraved atlas of the history of philosophy in which you have an entry. Speak in your own voice and reason as you reasoned — your temperament, your method, your convictions — grounded in the entry below. Be a genuine interlocutor, not a lecturer: hold your positions, question the questioner where that is your way, and concede nothing you would not have conceded. On matters after your lifetime, engage as your philosophy would, while owning that they lie beyond your days. Do not write [[${p.id}]] for yourself — you are already here.

${SHARED_RULES}

Your entry in the atlas:
${serializeThinker(p)}

The rest of the canon (id — name, dates, school, birthplace, era, tradition):
${buildRoster()}`
}

// ---- symposium --------------------------------------------------------------

// Two personas debate with the owner as questioner and third chair. Each turn
// is a persona call: the speaker's own past turns replay as assistant
// messages, everyone else's words arrive as attributed user messages.
export function buildSymposiumSystem(speakerId, otherId) {
  const other = byId[otherId]
  return `${buildPersonaSystem(speakerId)}

This is a symposium, not a private audience: seated across from you is ${other.name}, whose entry also lives in this atlas, and the owner sits as questioner and third chair. When it is your turn, engage what was just said — directly, by name, taking up its strongest point — from your own convictions and method. Agree only where you truly would; press where you would press. Keep each turn to one tight paragraph so the exchange stays alive. Never write ${other.name}'s words for them, and answer the questioner plainly whenever they interject.`
}

// events: [{who: 'user'|thinkerId, text, blocks?}] in order. Produces the
// message list for `speakerId`'s next turn, ending with a records-bearing cue.
export function symposiumMessages(events, speakerId, ids) {
  const msgs = events.map(e =>
    e.who === speakerId
      ? { role: 'assistant', content: e.blocks ?? e.text }
      : {
          role: 'user',
          content:
            e.who === 'user'
              ? `The questioner says: ${e.text}`
              : `${byId[e.who].name} says: ${e.text}`,
        },
  )
  msgs.push({
    role: 'user',
    content: buildUserTurn('It is your turn — respond to what was just said.', ids),
  })
  return msgs
}

// ---- per-turn context retrieval --------------------------------------------

export function citedIds(text) {
  const out = []
  for (const m of (text ?? '').matchAll(/\[\[([a-z]+)\]\]/g)) {
    if (byId[m[1]] && !out.includes(m[1])) out.push(m[1])
  }
  return out
}

// Thinkers whose full records ride along with the question: the persona, the
// current globe selection, whoever the last reply cited, then ranked matches
// for the whole query and for each word of it (names/schools/places only —
// word-level era/work matches are noise in full sentences).
export function contextIds(query, { personaId = null, selectedId = null, lastReply = '' } = {}) {
  const ids = []
  const add = id => {
    if (id && byId[id] && !ids.includes(id)) ids.push(id)
  }
  add(personaId)
  add(selectedId)
  citedIds(lastReply).forEach(add)
  searchPhilosophers(query, PHILOSOPHERS).forEach(r => add(r.id))
  for (const w of query.split(/[^\p{L}]+/u)) {
    if (w.length < 3) continue
    searchPhilosophers(w, PHILOSOPHERS)
      .filter(r => r.rank <= 3)
      .slice(0, 2)
      .forEach(r => add(r.id))
  }
  return ids.slice(0, 8)
}

export function buildUserTurn(question, ids) {
  if (!ids.length) return question
  const records = ids.map(id => serializeThinker(byId[id])).join('\n\n')
  return `<records>\n${records}\n</records>\n\n${question}`
}

// ---- [[id]] marker rendering ------------------------------------------------

// Splits reply text into segments for rendering: {type:'text'} | {type:'chip'}.
// While streaming, a trailing half-typed marker is hidden until it completes.
export function parseMarkers(text, { streaming = false } = {}) {
  let src = text
  if (streaming) {
    const open = src.lastIndexOf('[[')
    if (open !== -1 && !src.includes(']]', open)) src = src.slice(0, open)
    else if (src.endsWith('[')) src = src.slice(0, -1)
  }
  const segs = []
  let last = 0
  for (const m of src.matchAll(/\[\[([a-z]+)\]\]/g)) {
    if (m.index > last) segs.push({ type: 'text', text: src.slice(last, m.index) })
    if (byId[m[1]]) segs.push({ type: 'chip', id: m[1] })
    else segs.push({ type: 'text', text: m[0] })
    last = m.index + m[0].length
  }
  if (last < src.length) segs.push({ type: 'text', text: src.slice(last) })
  return segs
}

// ---- API call ---------------------------------------------------------------

// Haiku 4.5 predates adaptive thinking; the current models take it.
const thinkingFor = model => (model === 'claude-haiku-4-5' ? {} : { thinking: { type: 'adaptive' } })

// Returns the SDK MessageStream. Caller wires onText, then awaits
// stream.finalMessage(); stream.abort() cancels. `effort` trades depth for
// latency (voice mode) — Haiku 4.5 predates the parameter, so callers skip it.
export function streamReply({ apiKey, model, system, messages, onText, effort }) {
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
  const stream = client.messages.stream({
    model,
    max_tokens: 8000, // cost guard: caps a runaway reply at cents, ample for chat
    ...thinkingFor(model),
    ...(effort && model !== 'claude-haiku-4-5' ? { output_config: { effort } } : {}),
    system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
    messages,
  })
  if (onText) stream.on('text', onText)
  return stream
}

export { Anthropic }
