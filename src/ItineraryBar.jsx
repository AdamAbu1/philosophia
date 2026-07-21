// The itinerary bar: pick a curated journey, then pace it — the globe flies,
// the entry opens, and each arrival shows one line of connecting narration.
import { useState } from 'react'
import { ITINERARIES, itineraryById } from './itineraries.js'

export default function ItineraryBar({ trip, onStart, onStep, onEnd }) {
  const [open, setOpen] = useState(false)

  if (trip) {
    const route = itineraryById[trip.routeId]
    const stop = route.stops[trip.index]
    const last = trip.index === route.stops.length - 1
    return (
      <div className="itinerary active" aria-label={`Itinerary: ${route.name}`}>
        <div className="it-head">
          <span className="it-name">{route.name}</span>
          <span className="it-progress">
            stop {trip.index + 1} of {route.stops.length}
          </span>
          <button
            className="it-step"
            onClick={() => onStep(-1)}
            disabled={trip.index === 0}
            aria-label="Previous stop"
          >
            ‹
          </button>
          <button className="it-step" onClick={() => onStep(1)} disabled={last} aria-label="Next stop">
            ›
          </button>
          <button className="agent-exit" onClick={onEnd}>
            ✕ end the journey
          </button>
        </div>
        <p className="it-line">{stop.line}</p>
        {last && <p className="it-fin">— the road ends here; wander on where it points.</p>}
      </div>
    )
  }

  return (
    <div className="itinerary">
      <button className="lenschip it-toggle" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        itineraries {open ? '✕' : '›'}
      </button>
      {open && (
        <ul className="it-list">
          {ITINERARIES.map(r => (
            <li key={r.id}>
              <button
                onClick={() => {
                  setOpen(false)
                  onStart(r.id)
                }}
              >
                <span className="it-name">{r.name}</span>
                <span className="it-blurb">{r.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
