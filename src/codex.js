// The commonplace book: passages the owner clips from entries and
// conversations, kept in localStorage — a period-correct reading practice.
// The guide can search it: matching clippings ride along on user turns.
import { fold } from './search.js'

const STORE = 'philosophia.codex'
let cache = null

function load() {
  if (cache) return cache
  try {
    cache = JSON.parse(localStorage.getItem(STORE)) ?? []
  } catch {
    cache = []
  }
  return cache
}

function persist() {
  try { localStorage.setItem(STORE, JSON.stringify(cache)) } catch { /* private mode */ }
  try { window.dispatchEvent(new Event('philosophia:codex')) } catch { /* node */ }
}

export const getClippings = () => [...load()]

// Identical text is clipped once; returns the existing entry instead.
export function addClipping({ kind, thinkerId = null, title = null, text }) {
  const entries = load()
  const existing = entries.find(e => e.text === text)
  if (existing) return existing
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    thinkerId,
    title,
    text,
    savedAt: new Date().toISOString(),
  }
  entries.unshift(entry)
  persist()
  return entry
}

export function removeClipping(id) {
  const entries = load()
  const i = entries.findIndex(e => e.id === id)
  if (i >= 0) {
    entries.splice(i, 1)
    persist()
  }
}

// Word-overlap ranking of clippings against a question (diacritic-folded).
export function matchClippings(query, entries, k = 3) {
  const words = fold(query).split(/[^a-z0-9]+/).filter(w => w.length > 2)
  if (!words.length) return []
  return entries
    .map(e => {
      const t = fold(`${e.title ?? ''} ${e.text}`)
      return { e, score: words.filter(w => t.includes(w)).length }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map(x => x.e)
}

// Appended to the guide/persona user turn when the question touches the book.
export function clippingsBlock(query) {
  const matched = matchClippings(query, load())
  if (!matched.length) return ''
  const lines = matched.map(
    e => `- ${e.text}${e.thinkerId ? ` (clipped from [[${e.thinkerId}]])` : ''}`,
  )
  return `\n\n<commonplace note="passages the owner clipped into their commonplace book">\n${lines.join('\n')}\n</commonplace>`
}
