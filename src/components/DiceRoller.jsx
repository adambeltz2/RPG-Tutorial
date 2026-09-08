import { rollStartingGold } from '../utils/dice.js'

function DiceRoller({ gold, onRoll }) {
  return (
    <div>
      <label className="block text-sm text-stone-400 mb-1">Starting Gold (2d6 x 10)</label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="px-3 py-2 border border-stone-600 hover:bg-stone-800"
          onClick={() => onRoll(rollStartingGold())}
        >
          Roll for Gold
        </button>
        <span className="text-amber-400">{gold != null ? `${gold} gold` : 'Not rolled yet'}</span>
      </div>
    </div>
  )
}

export default DiceRoller
