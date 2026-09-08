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

  if (effect.goldDelta) {
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
