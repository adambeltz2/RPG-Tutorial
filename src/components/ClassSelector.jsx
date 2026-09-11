import { CLASSES } from '../data/classes.js'

function ClassSelector({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm italic text-ink-500 mb-1">Class</label>
      <div className="grid grid-cols-2 gap-2">
        {CLASSES.map((c) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onChange(c.name)}
            className={`px-3 py-2 fantasy-panel text-left font-heading text-sm tracking-wide ${
              value === c.name ? '!border-amber-600 bg-parchment-200 text-amber-700' : 'hover:bg-parchment-200'
            }`}
          >
            {c.name}
            <span className="block text-xs font-serif italic text-ink-400">HP {c.baseHp}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ClassSelector
