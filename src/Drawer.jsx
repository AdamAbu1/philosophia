import { byId, eraById } from './data.js'
import { fmtRange } from './layout.js'

export default function Drawer({ philosopher: p, onClose, onJump }) {
  return (
    <aside className={`drawer${p ? ' open' : ''}`}>
      {p && (
        <>
          <button className="close" onClick={onClose} aria-label="Close">
            ×
          </button>
          <div className="portrait">
            engraved portrait
            <br />
            coming soon
          </div>
          <h3>{p.name}</h3>
          <div className="dates">{fmtRange(p)}</div>
          <div className="chips">
            <span className="c">{eraById[p.era].name}</span>
            {p.school !== '—' && <span className="c">{p.school}</span>}
          </div>
          <h4>CORE IDEA</h4>
          <p className="blurb">{p.blurb}</p>
          <h4>IN ONE LINE</h4>
          <p className="oneline">“{p.line}”</p>
          {p.influences.length > 0 && (
            <>
              <h4>INFLUENCED BY</h4>
              <div className="inf">
                {p.influences.map(id => (
                  <button key={id} onClick={() => onJump(id)}>
                    {byId[id].name}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </aside>
  )
}
