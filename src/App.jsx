import { useEffect, useMemo, useRef, useState } from 'react'
import Globe from './Globe.jsx'
import DetailPanel from './DetailPanel.jsx'
import SearchBox from './SearchBox.jsx'
import AgentPanel from './AgentPanel.jsx'
import ItineraryBar from './ItineraryBar.jsx'
import { itineraryById } from './itineraries.js'
import { byId } from './data.js'

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [personaId, setPersonaId] = useState(null)
  const [trip, setTrip] = useState(null) // {routeId, index}
  const agentRef = useRef(null)

  const startTrip = routeId => {
    setTrip({ routeId, index: 0 })
    setSelectedId(itineraryById[routeId].stops[0].id)
  }
  const stepTrip = delta =>
    setTrip(t => {
      if (!t) return t
      const route = itineraryById[t.routeId]
      const index = Math.max(0, Math.min(route.stops.length - 1, t.index + delta))
      setSelectedId(route.stops[index].id)
      return { ...t, index }
    })
  const endTrip = () => setTrip(null)

  // Wandering to a thinker who happens to be on the route syncs the bar.
  useEffect(() => {
    if (!trip || !selectedId) return
    const i = itineraryById[trip.routeId].stops.findIndex(s => s.id === selectedId)
    if (i >= 0 && i !== trip.index) setTrip(t => ({ ...t, index: i }))
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  const itinerary = useMemo(
    () =>
      trip
        ? { ids: itineraryById[trip.routeId].stops.map(s => s.id), upTo: trip.index }
        : null,
    [trip],
  )

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
      <Globe selectedId={selectedId} onSelect={setSelectedId} itinerary={itinerary} />
      <ItineraryBar trip={trip} onStart={startTrip} onStep={stepTrip} onEnd={endTrip} />
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
