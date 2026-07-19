import { useEffect, useState } from 'react'
import Timeline from './Timeline.jsx'
import Drawer from './Drawer.jsx'
import Quiz from './Quiz.jsx'
import { byId } from './data.js'

export default function App() {
  const [tab, setTab] = useState('timeline')
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
        <div className="tabs">
          <button className={`tab${tab === 'timeline' ? ' on' : ''}`} onClick={() => setTab('timeline')}>
            Timeline
          </button>
          <button
            className={`tab${tab === 'quiz' ? ' on' : ''}`}
            onClick={() => {
              setTab('quiz')
              setSelectedId(null)
            }}
          >
            Quiz
          </button>
        </div>
      </header>
      {tab === 'timeline' ? (
        <Timeline selectedId={selectedId} onSelect={setSelectedId} />
      ) : (
        <Quiz />
      )}
      <Drawer
        philosopher={selectedId ? byId[selectedId] : null}
        onClose={() => setSelectedId(null)}
        onJump={jumpTo}
      />
    </>
  )
}
