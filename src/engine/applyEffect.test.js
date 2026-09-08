import { describe, expect, it } from 'vitest'
import { applyEffect } from './applyEffect.js'

function makeParty() {
  return [
    { id: 1, name: 'Thorin', hp: 7, gold: 50 },
    { id: 2, name: 'Elandra', hp: 5, gold: 30 },
    { id: 3, name: 'Pip', hp: 0, gold: 10 },
    { id: 4, name: 'Mira', hp: 4, gold: 5 },
  ]
}

describe('applyEffect', () => {
  it('returns the same party unchanged when there is no effect', () => {
    const party = makeParty()
    expect(applyEffect(null, party)).toBe(party)
  })

  it('never mutates the input party', () => {
    const party = makeParty()
    const snapshot = JSON.parse(JSON.stringify(party))
    applyEffect({ hpDelta: -1, target: 'random' }, party)
    expect(party).toEqual(snapshot)
  })

  it('random hpDelta only ever targets a member with hp > 0', () => {
    for (let i = 0; i < 100; i++) {
      const party = makeParty()
      const next = applyEffect({ hpDelta: -1, target: 'random' }, party)
      // Pip (id 3) already at 0 HP must never be the one that changed
      const pip = next.find((m) => m.id === 3)
      expect(pip.hp).toBe(0)
    }
  })

  it('hpDelta never drops a member below 0', () => {
    const party = [{ id: 1, name: 'Solo', hp: 1, gold: 0 }]
    const next = applyEffect({ hpDelta: -5 }, party)
    expect(next[0].hp).toBe(0)
  })

  it('non-random hpDelta applies to every member', () => {
    const party = makeParty()
    const next = applyEffect({ hpDelta: -2 }, party)
    expect(next.map((m) => m.hp)).toEqual([5, 3, 0, 2])
  })

  it('goldDelta deducts from the party pool in order, floored at 0 per member', () => {
    const party = makeParty()
    const next = applyEffect({ goldDelta: -60 }, party)
    // Thorin (50) covers 50, Elandra (30) covers the remaining 10, rest untouched
    expect(next.map((m) => m.gold)).toEqual([0, 20, 10, 5])
  })

  it('goldDelta never drops a member below 0 even if the total exceeds party gold', () => {
    const party = makeParty()
    const next = applyEffect({ goldDelta: -1000 }, party)
    expect(next.every((m) => m.gold >= 0)).toBe(true)
    expect(next.map((m) => m.gold)).toEqual([0, 0, 0, 0])
  })
})
