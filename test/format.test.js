import { describe, it, expect } from 'vitest'
import { fmtRange } from '../src/format.js'

describe('date formatting', () => {
  it('formats BCE-only lives', () => {
    expect(fmtRange({ born: -624, died: -546 })).toBe('c. 624–546 BCE')
  })
  it('formats BCE→CE straddlers', () => {
    expect(fmtRange({ born: -4, died: 65 })).toBe('c. 4 BCE – 65 CE')
  })
  it('formats early CE lives', () => {
    expect(fmtRange({ born: 354, died: 430 })).toBe('354–430 CE')
  })
  it('formats modern lives without suffix', () => {
    expect(fmtRange({ born: 1905, died: 1980 })).toBe('1905–1980')
  })
  it('formats living thinkers as open-ended', () => {
    expect(fmtRange({ born: 1932, died: null })).toBe('1932–present')
  })
})
