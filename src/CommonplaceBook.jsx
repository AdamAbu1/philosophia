// The commonplace book, rendered: the owner's clipped passages as an engraved
// codex section. Appears only once something has been clipped.
import { useEffect, useState } from 'react'
import { byId } from './data.js'
import { getClippings, removeClipping } from './codex.js'

export default function CommonplaceBook({ onSelect }) {
  const [entries, setEntries] = useState(getClippings)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const sync = () => setEntries(getClippings())
    window.addEventListener('philosophia:codex', sync)
    return () => window.removeEventListener('philosophia:codex', sync)
  }, [])

  if (!entries.length) return null

  const date = iso =>
    new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <section className="codex" aria-label="Commonplace book">
      <div className="codex-frame">
        <div className="codex-head">
          <h2>COMMONPLACE BOOK</h2>
          <span className="agent-mode">
            {entries.length} clipping{entries.length === 1 ? '' : 's'} · the guide can search these
          </span>
          <button className="agent-link" onClick={() => setOpen(o => !o)}>
            {open ? 'close' : 'open'}
          </button>
        </div>
        {open && (
          <ul className="codex-list">
            {entries.map(e => (
              <li key={e.id}>
                <p className="codex-text">{e.text}</p>
                <p className="codex-meta">
                  {e.thinkerId && byId[e.thinkerId] && (
                    <button className="tchip" onClick={() => onSelect(e.thinkerId)}>
                      {byId[e.thinkerId].name}
                    </button>
                  )}
                  <span>{date(e.savedAt)}</span>
                  <button className="agent-link" onClick={() => removeClipping(e.id)}>
                    remove
                  </button>
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
