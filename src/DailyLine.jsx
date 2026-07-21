// The day's line: a deterministic date-seeded greeting under the header —
// one signature line a day, dismissible until tomorrow.
import { useState } from 'react'
import { PHILOSOPHERS } from './data.js'

export const dailyPick = (dayIndex, list) =>
  list[((dayIndex % list.length) + list.length) % list.length]

const DAY = Math.floor(Date.now() / 86400000)
const SEEN = 'philosophia.dailySeen'

export default function DailyLine({ onSelect }) {
  const [hidden, setHidden] = useState(() => {
    try {
      return Number(localStorage.getItem(SEEN)) === DAY
    } catch {
      return false
    }
  })
  if (hidden) return null
  const p = dailyPick(DAY, PHILOSOPHERS)
  const dismiss = () => {
    try { localStorage.setItem(SEEN, String(DAY)) } catch { /* private mode */ }
    setHidden(true)
  }
  return (
    <div className="daily">
      <span className="daily-line">❧ “{p.line}”</span>
      <button className="tchip" onClick={() => onSelect(p.id)}>
        {p.name}
      </button>
      <button className="daily-x" onClick={dismiss} aria-label="Dismiss for today">
        ✕
      </button>
    </div>
  )
}
