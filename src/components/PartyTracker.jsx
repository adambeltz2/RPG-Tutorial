function PartyTracker({ party, onUsePotion }) {
  return (
    <aside className="fantasy-panel p-4">
      <h3 className="font-heading text-sm tracking-wide text-ink-700 mb-3">⚜ The Fellowship</h3>
      <ul className="space-y-2">
        {party.map((member) => {
          const maxHp = member.maxHp ?? member.hp
          const canDrinkPotion =
            onUsePotion && member.hp > 0 && member.hp < maxHp && member.equipment.includes('Healing Potion')
          return (
            <li key={member.id} className="flex items-center justify-between text-sm gap-2">
              <span className={member.hp <= 0 ? 'line-through text-ink-300' : ''}>
                {member.name} <span className="italic text-ink-400">({member.class})</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-heading text-amber-700">
                  {member.hp} HP · {member.gold}g
                </span>
                {canDrinkPotion && (
                  <button
                    type="button"
                    onClick={() => onUsePotion(member.id)}
                    className="fantasy-panel px-2 py-0.5 text-xs hover:bg-parchment-200"
                    title="Drink a Healing Potion"
                  >
                    🧪 Heal
                  </button>
                )}
              </span>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}

export default PartyTracker
