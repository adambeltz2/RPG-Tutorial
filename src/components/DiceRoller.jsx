import { rollStartingGold } from '../utils/dice.js'

function DiceRoller({ gold, onRoll }) {
  return (
    <div>
      <label className="block text-sm italic text-ink-500 mb-1">Starting Gold (2d6 × 10)</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="px-3 py-2 fantasy-panel font-heading text-sm tracking-wide hover:bg-parchment-200"
          onClick={() => onRoll(rollStartingGold())}
        >
          🎲 Roll for Gold
        </button>
        <span className="font-heading text-amber-700">{gold != null ? `${gold} gold` : 'Not rolled yet'}</span>
      </div>
    </div>
  )
}

export default DiceRoller
