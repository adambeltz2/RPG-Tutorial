import { CLASSES } from '../data/classes.js'

function ClassSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm text-stone-400 mb-1">Class</label>
      <div className="grid grid-cols-2 gap-2">
        {CLASSES.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onChange(c.name)}
            className={`px-3 py-2 border text-left ${
              value === c.name
                ? 'border-amber-500 bg-stone-800 text-amber-400'
                : 'border-stone-600 hover:bg-stone-800'
            }`}
          >
            {c.name}
            <span className="block text-xs text-stone-500">HP {c.baseHp}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ClassSelector
