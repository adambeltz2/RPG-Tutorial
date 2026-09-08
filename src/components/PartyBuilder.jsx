import { useState } from 'react'
import ClassSelector from './ClassSelector.jsx'
import DiceRoller from './DiceRoller.jsx'
import EquipmentShop from './EquipmentShop.jsx'
import { CLASSES } from '../data/classes.js'

const EMPTY_DRAFT = { name: '', class: null, gold: null, equipment: [] }

function PartyBuilder({ party, onChangeParty }) {
  const [activeSlot, setActiveSlot] = useState(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)

  function openSlot(slotIndex) {
    const existing = party[slotIndex]
    setDraft(
      existing
        ? { name: existing.name, class: existing.class, gold: existing.gold, equipment: existing.equipment }
        : EMPTY_DRAFT,
    )
    setActiveSlot(slotIndex)
  }

  function closeEditor() {
    setActiveSlot(null)
    setDraft(EMPTY_DRAFT)
  }

  function saveMember() {
    const baseHp = CLASSES.find((c) => c.name === draft.class)?.baseHp ?? 6
    const existing = party[activeSlot]
    const member = {
      id: existing?.id ?? Date.now(),
      name: draft.name.trim() || `Hero ${activeSlot + 1}`,
      class: draft.class,
      level: 1,
      hp: baseHp,
      gold: draft.gold ?? 0,
      equipment: draft.equipment,
    }
    const next = [...party]
    next[activeSlot] = member
    onChangeParty(next)
    closeEditor()
  }

  function buyItem(item) {
    setDraft((d) => ({ ...d, gold: d.gold - item.cost, equipment: [...d.equipment, item.name] }))
  }

  function sellItem(item) {
    setDraft((d) => ({
      ...d,
      gold: d.gold + item.cost,
      equipment: d.equipment.filter((name) => name !== item.name),
    }))
  }

  const canSave = draft.name.trim().length > 0 && draft.class && draft.gold != null

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((slotIndex) => {
          const member = party[slotIndex]
          return (
            <button
              key={slotIndex}
              type="button"
              onClick={() => openSlot(slotIndex)}
              className={`border p-3 text-left ${
                activeSlot === slotIndex ? 'border-amber-600' : 'border-ink-400 hover:bg-parchment-200'
              }`}
            >
              {member ? (
                <>
                  <div className="font-bold">{member.name}</div>
                  <div className="text-xs text-ink-500">{member.class}</div>
                  <div className="text-xs text-ink-400">
                    HP {member.hp} · {member.gold} gold
                  </div>
                </>
              ) : (
                <div className="text-ink-400">Empty slot {slotIndex + 1}</div>
              )}
            </button>
          )
        })}
      </div>

      {activeSlot !== null && (
        <div className="border border-ink-400 p-4 space-y-4">
          <div>
            <label className="block text-sm text-ink-500 mb-1">Name</label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full bg-parchment-50 border border-ink-400 px-3 py-2"
              placeholder={`Hero ${activeSlot + 1}`}
            />
          </div>

          <ClassSelector value={draft.class} onChange={(cls) => setDraft((d) => ({ ...d, class: cls }))} />

          <DiceRoller gold={draft.gold} onRoll={(gold) => setDraft((d) => ({ ...d, gold }))} />

          {draft.gold != null && (
            <EquipmentShop gold={draft.gold} equipment={draft.equipment} onBuy={buyItem} onSell={sellItem} />
          )}

          <div className="flex gap-3">
            <button
              type="button"
              disabled={!canSave}
              onClick={saveMember}
              className="px-4 py-2 border border-amber-600 text-amber-700 hover:bg-parchment-200 disabled:opacity-30"
            >
              Save Hero
            </button>
            <button type="button" onClick={closeEditor} className="px-4 py-2 border border-ink-400 hover:bg-parchment-200">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PartyBuilder
