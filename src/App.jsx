import { useEffect, useState } from 'react'
import Timeline from './Timeline.jsx'
import DetailPanel from './DetailPanel.jsx'
import { byId } from './data.js'

export default function App() {
  const [selectedId, setSelectedId] = useState(null)

  // Influence-chip jumps scroll the strip to the target's era, then select.
  function jumpTo(id) {
    const p = byId[id]
    document
      .getElementById(`band-${p.era}`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    setSelectedId(id)
  }

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape') setSelectedId(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header>
        <h1>
          PHILOSOPHIA<span>an interactive timeline of philosophy</span>
        </h1>
      </header>
      <Timeline selectedId={selectedId} onSelect={setSelectedId} />
      <DetailPanel
        philosopher={selectedId ? byId[selectedId] : null}
        onClose={() => setSelectedId(null)}
        onJump={jumpTo}
      />
    </>
  )
}
