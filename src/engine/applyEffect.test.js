import { describe, expect, it } from 'vitest'
import { applyEffect, useHealingPotion } from './applyEffect.js'

function makeParty() {
  return [
    { id: 1, name: 'Thorin', hp: 7, maxHp: 7, gold: 50, equipment: [] },
    { id: 2, name: 'Elandra', hp: 5, maxHp: 5, gold: 30, equipment: [] },
    { id: 3, name: 'Pip', hp: 0, maxHp: 5, gold: 10, equipment: [] },
    { id: 4, name: 'Mira', hp: 4, maxHp: 4, gold: 5, equipment: [] },
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

  it('positive goldDelta is distributed evenly across living members only', () => {
    const party = makeParty()
    // Pip (id 3) is fallen (hp 0) and must not receive a share.
    const next = applyEffect({ goldDelta: 30 }, party)
    expect(next.map((m) => m.gold)).toEqual([60, 40, 10, 15]) // +10 each to Thorin/Elandra/Mira
  })

  it('positive goldDelta remainder is distributed one-by-one rather than lost', () => {
    const party = makeParty()
    const next = applyEffect({ goldDelta: 10 }, party) // 10 / 3 living members
    const totalGained = next.reduce((sum, m, i) => sum + (m.gold - party[i].gold), 0)
    expect(totalGained).toBe(10)
  })

  it('positive goldDelta falls back to the whole party if everyone has fallen', () => {
    const party = makeParty().map((m) => ({ ...m, hp: 0 }))
    const next = applyEffect({ goldDelta: 40 }, party)
    const totalGained = next.reduce((sum, m, i) => sum + (m.gold - party[i].gold), 0)
    expect(totalGained).toBe(40)
  })
})

describe('useHealingPotion', () => {
  function heroWith(overrides) {
    return { id: 1, name: 'Mira', hp: 2, maxHp: 4, gold: 0, equipment: ['Healing Potion'], ...overrides }
  }

  it('heals the member and consumes one potion', () => {
    const party = [heroWith({})]
    const next = useHealingPotion(party, 1, 3)
    expect(next[0].hp).toBe(4) // capped at maxHp (2 + 3 -> 5, capped to 4)
    expect(next[0].equipment).toEqual([])
  })

  it('never heals past maxHp', () => {
    const party = [heroWith({ hp: 4 })]
    const next = useHealingPotion(party, 1, 3)
    // Already full: no potion should be spent, hp stays capped
    expect(next[0].hp).toBe(4)
  })

  it('does nothing for a fallen member (hp <= 0)', () => {
    const party = [heroWith({ hp: 0 })]
    const next = useHealingPotion(party, 1, 3)
    expect(next[0].hp).toBe(0)
    expect(next[0].equipment).toEqual(['Healing Potion'])
  })

  it('does nothing if the member has no Healing Potion', () => {
    const party = [heroWith({ equipment: [] })]
    const next = useHealingPotion(party, 1, 3)
    expect(next[0].hp).toBe(2)
  })

  it('only affects the targeted member', () => {
    const party = [heroWith({ id: 1 }), heroWith({ id: 2, hp: 1 })]
    const next = useHealingPotion(party, 2, 3)
    expect(next.find((m) => m.id === 1)).toEqual(party[0])
    expect(next.find((m) => m.id === 2).hp).toBe(4)
  })
})
