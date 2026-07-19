import { useMemo } from 'react'
import { ERAS, PHILOSOPHERS, byId } from './data.js'
import { layoutEra, fmtRange, fmtEraYears } from './layout.js'

function scrollToEra(eraId) {
  document
    .getElementById(`band-${eraId}`)
    ?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
}

function Band({ era, selectedId, onSelect }) {
  const placed = useMemo(() => layoutEra(era, PHILOSOPHERS), [era])
  return (
    <div className="band" id={`band-${era.id}`} style={{ width: era.width, background: era.tint }}>
      <div className="band-head">
        <span className="ename">{era.name}</span>
        <span className="eyears">{fmtEraYears(era)}</span>
        {era.squeeze && <span className="squeeze">⧗ {era.squeeze}</span>}
      </div>
      <div className="axis" />
      {placed.map(n => {
        const p = byId[n.id]
        return (
          <div
            key={n.id}
            className={`node lane${n.lane}${selectedId === n.id ? ' sel' : ''}`}
            style={{ left: n.x }}
            onClick={() => onSelect(n.id)}
          >
            <div className="leader" />
            <div className="dot" />
            <div className="lbl">
              <div className="nm">{p.name}</div>
              <div className="yr">{fmtRange(p)}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Timeline({ selectedId, onSelect }) {
  return (
    <div>
      <div className="eranav">
        {ERAS.map(e => (
          <button key={e.id} onClick={() => scrollToEra(e.id)}>
            {e.name}
          </button>
        ))}
      </div>
      <div className="tl-scroll">
        <div className="tl-col">
          <div className="bands">
            {ERAS.map(e => (
              <Band key={e.id} era={e} selectedId={selectedId} onSelect={onSelect} />
            ))}
          </div>
          <div className="reserved">
            <span className="txt">
              reserved lane — Chinese · Indian · Islamic tradition tracks arrive in v2
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
