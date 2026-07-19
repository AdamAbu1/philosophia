import { useState } from 'react'
import { PHILOSOPHERS } from './data.js'
import { buildRound } from './quiz.js'

const ROUND_SIZE = 5

export default function Quiz() {
  const [round, setRound] = useState(() => buildRound(PHILOSOPHERS, ROUND_SIZE))
  const [qi, setQi] = useState(0)
  const [score, setScore] = useState(0)
  const [picked, setPicked] = useState(null)

  function restart() {
    setRound(buildRound(PHILOSOPHERS, ROUND_SIZE))
    setQi(0)
    setScore(0)
    setPicked(null)
  }

  if (qi >= round.length) {
    return (
      <div className="quizview">
        <div className="qcard">
          <div className="qtext">
            Round complete — {score} / {round.length} correct
          </div>
          <button className="qnext" onClick={restart}>
            New round
          </button>
        </div>
      </div>
    )
  }

  const Q = round[qi]

  function pick(id) {
    if (picked !== null) return
    setPicked(id)
    if (id === Q.answerId) setScore(s => s + 1)
  }

  return (
    <div className="quizview">
      <div className="qcard">
        <div className="qmeta">
          <span className="cnt">
            Question {qi + 1} of {round.length}
          </span>
          <div className="dots">
            {round.map((_, i) => (
              <i key={i} className={i < qi ? 'done' : ''} />
            ))}
          </div>
          <span className="qtype">who-said-it</span>
        </div>
        <div className="qtext">{Q.q}</div>
        <div className="opts">
          {Q.options.map(o => {
            let cls = 'opt'
            if (picked !== null) {
              if (o.id === Q.answerId) cls += ' ok'
              else if (o.id === picked) cls += ' bad'
            }
            return (
              <button key={o.id} className={cls} disabled={picked !== null} onClick={() => pick(o.id)}>
                {o.name}
              </button>
            )
          })}
        </div>
        <button
          className="qnext"
          disabled={picked === null}
          onClick={() => {
            setQi(i => i + 1)
            setPicked(null)
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}
