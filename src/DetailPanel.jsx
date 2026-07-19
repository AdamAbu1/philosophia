import { byId, eraById } from './data.js'
import { fmtRange } from './format.js'
import Lifeline from './Lifeline.jsx'

function ChipRow({ label, ids, onJump }) {
  if (!ids.length) return null
  return (
    <div className="infgroup">
      <h4>{label}</h4>
      <div className="inf">
        {ids.map(id => (
          <button key={id} onClick={() => onJump(id)}>
            {byId[id].name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DetailPanel({ philosopher: p, onClose, onJump }) {
  if (!p) {
    return (
      <div className="detail-hint">
        Select a thinker on the globe to open their entry here.
      </div>
    )
  }
  const era = eraById[p.era]
  return (
    <section className="detail" aria-label={`Entry for ${p.name}`}>
      <button className="close" onClick={onClose} aria-label="Close entry">
        ×
      </button>
      <div className="detail-side">
        <img className="portrait-img" src={p.portrait} alt={`Engraved portrait of ${p.name}`} />
        <h3>{p.name}</h3>
        <div className="dates">
          {fmtRange(p)} · born at {p.place.name}
        </div>
        <div className="chips">
          <span className="c">{era.name}</span>
          {p.school !== '—' && <span className="c">{p.school}</span>}
        </div>
        <p className="oneline">“{p.line}”</p>
        <ChipRow label="INFLUENCED BY" ids={p.influences} onJump={onJump} />
        <ChipRow label="WENT ON TO INFLUENCE" ids={p.influenced} onJump={onJump} />
      </div>
      <div className="detail-main">
        <p className="lead">{p.blurb}</p>
        <h4>WHO THEY WERE</h4>
        <p className="body">{p.bio}</p>
        <h4>KEY IDEAS</h4>
        {p.ideas.map(i => (
          <p className="idea" key={i.title}>
            <b>{i.title}.</b> {i.text}
          </p>
        ))}
        <h4>MAJOR WORKS</h4>
        <ul className="works">
          {p.works.map(w => (
            <li key={w}>{w}</li>
          ))}
        </ul>
        <h4>LEGACY</h4>
        <p className="body">{p.legacy}</p>
        <h4>IN TIME</h4>
        <Lifeline philosopher={p} onJump={onJump} />
      </div>
    </section>
  )
}
