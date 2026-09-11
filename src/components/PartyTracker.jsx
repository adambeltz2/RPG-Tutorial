function PartyTracker({ party }) {
  return (
    <aside className="fantasy-panel p-4">
      <h3 className="font-heading text-sm tracking-wide text-ink-700 mb-3">⚜ The Fellowship</h3>
      <ul className="space-y-2">
        {party.map((member) => (
          <li key={member.id} className="flex items-center justify-between text-sm">
            <span className={member.hp <= 0 ? 'line-through text-ink-300' : ''}>
              {member.name} <span className="italic text-ink-400">({member.class})</span>
            </span>
            <span className="font-heading text-amber-700">
              {member.hp} HP · {member.gold}g
            </span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default PartyTracker
