import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { LIVING, livingSrc } from '../src/living.js'
import { byId } from '../src/data.js'

describe('living portraits', () => {
  it('every registered thinker is in the canon and has both loops on disk', () => {
    for (const id of LIVING) {
      expect(byId[id], id).toBeTruthy()
      for (const kind of ['idle', 'speaking']) {
        expect(
          existsSync(join(process.cwd(), 'public', livingSrc(id, kind))),
          `${id} ${kind}`,
        ).toBe(true)
      }
    }
  })
})
