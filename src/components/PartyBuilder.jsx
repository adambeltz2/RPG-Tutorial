import { useState } from 'react'
import ClassSelector from './ClassSelector.jsx'
import DiceRoller from './DiceRoller.jsx'
import EquipmentShop from './EquipmentShop.jsx'
import GuideNote from './GuideNote.jsx'
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
      maxHp: baseHp,
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
              className={`fantasy-panel p-3 text-left ${
                activeSlot === slotIndex ? '!border-amber-600' : 'hover:bg-parchment-200'
              }`}
            >
              {member ? (
                <>
                  <div className="font-heading tracking-wide text-ink-700">{member.name}</div>
                  <div className="text-sm italic text-ink-500">{member.class}</div>
                  <div className="text-sm text-ink-400">
                    HP {member.hp} · {member.gold} gold
                  </div>
                </>
              ) : (
                <div className="italic text-ink-400">Empty slot {slotIndex + 1}</div>
              )}
            </button>
          )
        })}
      </div>

      {activeSlot !== null && (
        <div className="fantasy-panel p-5 space-y-5">
          <div>
            <label className="block text-sm italic text-ink-500 mb-1">Name</label>
            <input
              type="text"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              className="w-full bg-parchment-50 border-2 border-ink-400 px-3 py-2 font-serif focus:outline-none focus:border-amber-600"
              placeholder={`Hero ${activeSlot + 1}`}
            />
          </div>

          <div className="space-y-2">
            <ClassSelector value={draft.class} onChange={(cls) => setDraft((d) => ({ ...d, class: cls }))} />
            <GuideNote title="Choosing a Class">
              Class sets your hero's starting Hit Points (shown on each card) —
              higher HP means they can survive more hits before falling in
              combat. Warriors and Barbarians are tough front-line fighters;
              Wizards are fragile but bring magic the party can't get any other
              way (like <em>Study the Rune</em> later in the dungeon).
            </GuideNote>
          </div>

          <div className="space-y-2">
            <DiceRoller gold={draft.gold} onRoll={(gold) => setDraft((d) => ({ ...d, gold, equipment: [] }))} />
            <GuideNote title="Starting Gold">
              Every hero rolls 2 six-sided dice and multiplies the total by 10
              for their starting gold (2–12 → 20–120 gold). This is the wealth
              you'll spend below on gear before setting out — re-rolling
              always clears anything already bought, so roll before you shop.
            </GuideNote>
          </div>

          {draft.gold != null && (
            <div className="space-y-2">
              <EquipmentShop gold={draft.gold} equipment={draft.equipment} onBuy={buyItem} onSell={sellItem} />
              <GuideNote title="Equipping Your Hero">
                Gear isn't just flavor — a Shield or Armor makes you harder to
                hit, a Healing Potion can save your life mid-dungeon (drink it
                from the party tracker once you're on the adventure), and a
                Torch or Rope help with hazards the rulebook describes outside
                this tutorial's scope. Buy what fits your class and budget;
                you can always sell back before saving.
              </GuideNote>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              disabled={!canSave}
              onClick={saveMember}
              className="px-4 py-2 fantasy-panel font-heading tracking-wide text-sm text-amber-700 !border-amber-600 hover:bg-parchment-200 disabled:opacity-30"
            >
              Save Hero
            </button>
            <button
              type="button"
              onClick={closeEditor}
              className="px-4 py-2 fantasy-panel font-heading tracking-wide text-sm text-ink-600 hover:bg-parchment-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PartyBuilder
