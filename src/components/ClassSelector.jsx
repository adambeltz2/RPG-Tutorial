import { CLASSES } from '../data/classes.js'

function ClassSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-ink-500 mb-1">Class</label>
      <div className="grid grid-cols-2 gap-2">
        {CLASSES.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onChange(c.name)}
            className={`px-3 py-2 border text-left ${
              value === c.name
                ? 'border-amber-600 bg-parchment-200 text-amber-700'
                : 'border-ink-400 hover:bg-parchment-200'
            }`}
          >
            {c.name}
            <span className="block text-xs text-ink-400">HP {c.baseHp}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ClassSelector
