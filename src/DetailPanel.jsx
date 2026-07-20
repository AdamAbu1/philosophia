import { byId, eraById } from './data.js'
import { EDGES } from './edges.js'
import { WORK_LINKS } from './works.js'
import { fmtRange } from './format.js'
import Lifeline from './Lifeline.jsx'

const UNLINKABLE = /^(No |Wrote |Nothing |~)/

function EdgeList({ label, entries, onJump }) {
  if (!entries.length) return null
  return (
    <>
      <h4>{label}</h4>
      {entries.map(({ id, text }) => (
        <p className="edge" key={id}>
          <button className="edgechip" onClick={() => onJump(id)}>
            {byId[id].name}
          </button>{' '}
          {text}
        </p>
      ))}
    </>
  )
}

export default function DetailPanel({ philosopher: p, onClose, onJump, onConverse }) {
  if (!p) {
    return (
      <div className="detail-hint">
        Select a thinker on the globe to open their entry here.
      </div>
    )
  }
  const era = eraById[p.era]
  const workLookup = w =>
    WORK_LINKS[p.id]?.[w] ??
    `https://en.wikipedia.org/w/index.php?search=${encodeURIComponent(
      `${w.replace(/\s*\(.*\)$/, '')} ${p.name}`,
    )}`
  const influencedBy = p.influences.map(id => ({ id, text: EDGES[`${id}>${p.id}`] }))
  const wentOn = p.influenced.map(id => ({ id, text: EDGES[`${p.id}>${id}`] }))
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
        <button className="converse" onClick={() => onConverse(p.id)}>
          Converse with {p.name} ↓
        </button>
        <h4>FURTHER READING</h4>
        <div className="reading">
          {p.links.map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
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
            <li key={w}>
              {UNLINKABLE.test(w) ? (
                w
              ) : (
                <a href={workLookup(w)} target="_blank" rel="noopener noreferrer">
                  {w}
                </a>
              )}
            </li>
          ))}
        </ul>
        <h4>LEGACY</h4>
        <p className="body">{p.legacy}</p>
        <EdgeList label="INFLUENCED BY" entries={influencedBy} onJump={onJump} />
        <EdgeList label="WENT ON TO INFLUENCE" entries={wentOn} onJump={onJump} />
        <h4>IN TIME</h4>
        <Lifeline philosopher={p} onJump={onJump} />
      </div>
    </section>
  )
}
