import { describe, it, expect } from 'vitest'
import { dailyPick } from '../src/DailyLine.jsx'
import { PHILOSOPHERS } from '../src/data.js'

describe('dailyPick', () => {
  it('is deterministic and wraps around the canon', () => {
    expect(dailyPick(0, PHILOSOPHERS)).toBe(PHILOSOPHERS[0])
    expect(dailyPick(PHILOSOPHERS.length, PHILOSOPHERS)).toBe(PHILOSOPHERS[0])
    expect(dailyPick(3, PHILOSOPHERS)).toBe(dailyPick(3, PHILOSOPHERS))
    expect(dailyPick(3, PHILOSOPHERS)).not.toBe(dailyPick(4, PHILOSOPHERS))
  })
  it('survives negative day indexes', () => {
    expect(dailyPick(-1, PHILOSOPHERS)).toBe(PHILOSOPHERS[PHILOSOPHERS.length - 1])
  })
})
