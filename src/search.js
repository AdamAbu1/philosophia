// Ranked philosopher search: word-prefix name matches first, then name
// substrings, then school / birthplace / era / works / idea titles.
// Diacritic-folded so "konigsberg" finds Kant and "soren" finds Kierkegaard.
import { eraById } from './data.js'

export const fold = s =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replaceAll('ø', 'o')
    .replaceAll('æ', 'ae')
    .replaceAll('ß', 'ss')

function match(p, q) {
  const name = fold(p.name)
  const alias = fold(p.alias)
  if (
    name.split(/\s+/).some(w => w.startsWith(q)) ||
    alias.split(/[\s-]+/).some(w => w.startsWith(q))
  )
    return { rank: 0, label: null }
  if (name.includes(q) || alias.includes(q)) return { rank: 1, label: null }
  if (fold(p.school).includes(q)) return { rank: 2, label: `school · ${p.school}` }
  if (fold(p.place.name).includes(q)) return { rank: 3, label: `born at ${p.place.name}` }
  const era = eraById[p.era]
  if (fold(era.name).includes(q)) return { rank: 4, label: era.name }
  const work = p.works.find(w => fold(w).includes(q))
  if (work) return { rank: 5, label: `work · ${work.replace(/\s*\(.*\)$/, '')}` }
  const idea = p.ideas.find(i => fold(i.title).includes(q))
  if (idea) return { rank: 6, label: `idea · ${idea.title}` }
  return null
}

export function searchPhilosophers(query, philosophers) {
  const q = fold(query.trim())
  if (!q) return []
  const out = []
  for (const p of philosophers) {
    const m = match(p, q)
    if (m) out.push({ id: p.id, name: p.name, rank: m.rank, label: m.label })
  }
  out.sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
  return out.slice(0, 8)
}
