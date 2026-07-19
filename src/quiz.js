// Who-said-it question generation from the philosopher data. `rng` is
// injectable so tests can run deterministically.
export function buildRound(philosophers, count = 5, rng = Math.random) {
  const pool = shuffle(philosophers, rng).slice(0, count)
  return pool.map(answer => {
    const distractors = shuffle(
      philosophers.filter(p => p.id !== answer.id),
      rng,
    ).slice(0, 3)
    const options = shuffle([answer, ...distractors], rng)
    return {
      q: `“${answer.line}” — whose idea is this?`,
      options: options.map(p => ({ id: p.id, name: p.name })),
      answerId: answer.id,
    }
  })
}

function shuffle(arr, rng) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
