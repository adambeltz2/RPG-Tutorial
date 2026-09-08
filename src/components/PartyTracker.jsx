function PartyTracker({ party }) {
  return (
    <aside className="border border-ink-400 p-4">
      <h3 className="text-sm text-ink-500 mb-3">Party Tracker</h3>
      <ul className="space-y-2">
        {party.map((member) => (
          <li key={member.id} className="flex items-center justify-between text-sm">
            <span className={member.hp <= 0 ? 'line-through text-ink-300' : ''}>
              {member.name} <span className="text-ink-400">({member.class})</span>
            </span>
            <span className="text-amber-700">
              {member.hp} HP · {member.gold}g
            </span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default PartyTracker
