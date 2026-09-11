export function applyEffect(effect, party) {
  if (!effect) return party
  let next = party.map((member) => ({ ...member }))

  if (effect.hpDelta) {
    if (effect.target === 'random') {
      const alive = next.filter((m) => m.hp > 0)
      if (alive.length) {
        const target = alive[Math.floor(Math.random() * alive.length)]
        target.hp = Math.max(0, target.hp + effect.hpDelta)
      }
    } else {
      next = next.map((m) => ({ ...m, hp: Math.max(0, m.hp + effect.hpDelta) }))
    }
  }

  if (effect.goldDelta > 0) {
    const livingIdx = next.reduce((acc, m, i) => (m.hp > 0 ? [...acc, i] : acc), [])
    const recipients = livingIdx.length ? livingIdx : next.map((_, i) => i)
    const share = Math.floor(effect.goldDelta / recipients.length)
    let remainder = effect.goldDelta - share * recipients.length
    next = next.map((m, i) => {
      if (!recipients.includes(i)) return m
      const bonus = remainder > 0 ? 1 : 0
      if (remainder > 0) remainder -= 1
      return { ...m, gold: m.gold + share + bonus }
    })
  } else if (effect.goldDelta < 0) {
    let remaining = -effect.goldDelta
    next = next.map((m) => {
      if (remaining <= 0) return m
      const taken = Math.min(m.gold, remaining)
      remaining -= taken
      return { ...m, gold: m.gold - taken }
    })
  }

  return next
}

/**
 * Has a living party member drink a Healing Potion from their own
 * equipment, restoring HP up to their maxHp. No-op (returns party
 * unchanged) if that member is fallen, already at full HP, doesn't
 * exist, or doesn't carry a potion.
 */
export function useHealingPotion(party, memberId, healAmount = 3) {
  return party.map((m) => {
    if (m.id !== memberId) return m
    const maxHp = m.maxHp ?? m.hp
    if (m.hp <= 0 || m.hp >= maxHp || !m.equipment.includes('Healing Potion')) return m
    const potionIndex = m.equipment.indexOf('Healing Potion')
    const equipment = [...m.equipment.slice(0, potionIndex), ...m.equipment.slice(potionIndex + 1)]
    return { ...m, hp: Math.min(maxHp, m.hp + healAmount), equipment }
  })
}
