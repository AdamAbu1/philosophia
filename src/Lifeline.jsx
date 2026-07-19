import { byId, ERAS } from './data.js'
import { YEAR_MIN, YEAR_MAX } from './geo.js'
import { fmtRange } from './format.js'

// The "timeline, somewhere else": a small engraved strip inside each entry
// showing the thinker's lifespan against the eras, with influences (above)
// and heirs (below) as clickable dots.
const LW = 640
const LH = 74
const PAD = 20
const x = year => PAD + ((year - YEAR_MIN) / (YEAR_MAX - YEAR_MIN)) * (LW - 2 * PAD)
const TICKS = [-500, 0, 500, 1000, 1500, 2000]

export default function Lifeline({ philosopher: p, onJump }) {
  const endOf = q => q.died ?? YEAR_MAX
  const mid = q => x((q.born + endOf(q)) / 2)
  return (
    <svg className="lifeline" viewBox={`0 0 ${LW} ${LH}`}>
      {ERAS.map((e, i) => {
        const next = ERAS[i + 1]
        const x0 = x(e.start)
        const x1 = x(next ? next.start : YEAR_MAX)
        return (
          <rect
            key={e.id}
            x={x0}
            y="14"
            width={x1 - x0}
            height="34"
            className={i % 2 ? 'll-band odd' : 'll-band'}
          >
            <title>{e.name}</title>
          </rect>
        )
      })}
      {TICKS.map(t => (
        <g key={t} className="ll-tick">
          <line x1={x(t)} x2={x(t)} y1="48" y2="53" />
          <text x={x(t)} y="63" textAnchor="middle">
            {t < 0 ? `${-t} BCE` : t === 0 ? '1 CE' : t}
          </text>
        </g>
      ))}
      <rect className="ll-bar" x={x(p.born)} y="27" width={Math.max(3, x(endOf(p)) - x(p.born))} height="8" rx="2">
        <title>{`${p.name} · ${fmtRange(p)}`}</title>
      </rect>
      {p.influences.map(id => {
        const q = byId[id]
        return (
          <circle key={id} className="ll-dot infl" cx={mid(q)} cy="19" r="4.5" onClick={() => onJump(id)}>
            <title>{`influenced by ${q.name} · ${fmtRange(q)}`}</title>
          </circle>
        )
      })}
      {p.influenced.map(id => {
        const q = byId[id]
        return (
          <circle key={id} className="ll-dot heir" cx={mid(q)} cy="43" r="4.5" onClick={() => onJump(id)}>
            <title>{`went on to influence ${q.name} · ${fmtRange(q)}`}</title>
          </circle>
        )
      })}
    </svg>
  )
}
