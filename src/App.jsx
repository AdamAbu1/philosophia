import { useEffect, useRef, useState } from 'react'
import Globe from './Globe.jsx'
import DetailPanel from './DetailPanel.jsx'
import SearchBox from './SearchBox.jsx'
import AgentPanel from './AgentPanel.jsx'
import { byId } from './data.js'

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [personaId, setPersonaId] = useState(null)
  const agentRef = useRef(null)

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'Escape' && e.target.tagName !== 'INPUT') setSelectedId(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const startConverse = id => {
    setPersonaId(id)
    agentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <header>
        <h1>PHILOSOPHIA</h1>
        <div className="sub">a globe of philosophy · six centuries before the common era to the present</div>
        <SearchBox onSelect={setSelectedId} />
      </header>
      <Globe selectedId={selectedId} onSelect={setSelectedId} />
      <DetailPanel
        philosopher={selectedId ? byId[selectedId] : null}
        onClose={() => setSelectedId(null)}
        onJump={setSelectedId}
        onConverse={startConverse}
      />
      <div ref={agentRef}>
        <AgentPanel
          personaId={personaId}
          onExitPersona={() => setPersonaId(null)}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </div>
    </>
  )
}
