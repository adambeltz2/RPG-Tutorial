import { describe, expect, it } from 'vitest'
import { rollDie, rollDice, rollStartingGold } from './dice.js'

describe('rollDie', () => {
  it('stays within [1, sides] across many rolls', () => {
    for (let i = 0; i < 500; i++) {
      const result = rollDie(6)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(6)
      expect(Number.isInteger(result)).toBe(true)
    }
  })
})

describe('rollDice', () => {
  it('returns the requested count of dice', () => {
    expect(rollDice(3, 6)).toHaveLength(3)
  })

  it('each die stays within [1, sides]', () => {
    for (const value of rollDice(20, 4)) {
      expect(value).toBeGreaterThanOrEqual(1)
      expect(value).toBeLessThanOrEqual(4)
    }
  })
})

describe('rollStartingGold', () => {
  it('stays within the 2d6 x 10 range [20, 120]', () => {
    for (let i = 0; i < 500; i++) {
      const gold = rollStartingGold()
      expect(gold).toBeGreaterThanOrEqual(20)
      expect(gold).toBeLessThanOrEqual(120)
      expect(gold % 10).toBe(0)
    }
  })
})
