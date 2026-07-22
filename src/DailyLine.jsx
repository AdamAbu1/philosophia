// The day's line: a deterministic date-seeded greeting under the header —
// one signature line a day, dismissible until tomorrow, and shareable as an
// engraved card (posts to X when the publishing Worker is configured, else
// falls back to the share sheet / download).
import { useState } from 'react'
import { PHILOSOPHERS } from './data.js'
import { renderDailyCard, dailyCaptionFor } from './broadsheet.js'
import { isPublishConfigured, postToX } from './publish-api.js'

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
  const [status, setStatus] = useState(null) // null | 'posting' | {posted|download|error}
  if (hidden) return null
  const p = dailyPick(DAY, PHILOSOPHERS)
  const dismiss = () => {
    try { localStorage.setItem(SEEN, String(DAY)) } catch { /* private mode */ }
    setHidden(true)
  }

  const post = async () => {
    if (status === 'posting') return
    setStatus('posting')
    try {
      const blob = await renderDailyCard(p)
      const caption = dailyCaptionFor(p)
      if (isPublishConfigured()) {
        try {
          const { url } = await postToX({ image: blob, text: caption })
          setStatus({ posted: url })
          return
        } catch (err) {
          setStatus({ error: err.message })
          // fall through to the share sheet, which keeps the card
        }
      }
      const file = new File([blob], 'daily-line.png', { type: 'image/png' })
      const payload = { files: [file], title: 'The day’s line — Philosophia', text: caption }
      if (navigator.canShare?.(payload)) {
        try {
          await navigator.share(payload)
          setStatus(null)
          return
        } catch (err) {
          if (err?.name === 'AbortError') return setStatus(null)
        }
      }
      setStatus({ download: URL.createObjectURL(blob) })
    } catch (err) {
      setStatus({ error: err?.message ?? 'Could not render the card.' })
    }
  }

  return (
    <div className="daily">
      <span className="daily-line">❧ “{p.line}”</span>
      <button className="tchip" onClick={() => onSelect(p.id)}>
        {p.name}
      </button>
      <button className="daily-post" onClick={post} disabled={status === 'posting'}>
        {status === 'posting' ? 'posting…' : 'post'}
      </button>
      {status?.posted && (
        <a className="daily-status" href={status.posted} target="_blank" rel="noopener noreferrer">
          posted ✓ view
        </a>
      )}
      {status?.download && (
        <a className="daily-status" href={status.download} download="daily-line.png">
          download card
        </a>
      )}
      {status?.error && <span className="daily-status err">{status.error}</span>}
      <button className="daily-x" onClick={dismiss} aria-label="Dismiss for today">
        ✕
      </button>
    </div>
  )
}
