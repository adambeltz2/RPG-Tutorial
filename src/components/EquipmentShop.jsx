import { EQUIPMENT } from '../data/equipment.js'

function EquipmentShop({ gold, equipment, onBuy, onSell }) {
  return (
    <div>
      <label className="block text-sm text-ink-500 mb-1">
        Equipment Shop — {gold} gold remaining
      </label>
      <ul className="grid grid-cols-2 gap-2 mb-3">
        {EQUIPMENT.map((item) => {
          const owned = equipment.includes(item.name)
          const affordable = gold >= item.cost
          return (
            <li key={item.name} className="flex items-center justify-between border border-ink-400 px-3 py-2">
              <span>
                {item.name}
                <span className="block text-xs text-ink-400">{item.cost} gold</span>
              </span>
              <button
                type="button"
                disabled={owned ? false : !affordable}
                onClick={() => (owned ? onSell(item) : onBuy(item))}
                className={`px-2 py-1 text-xs border ${
                  owned
                    ? 'border-red-700 text-red-600 hover:bg-parchment-200'
                    : 'border-ink-500 hover:bg-parchment-200 disabled:opacity-30'
                }`}
              >
                {owned ? 'Remove' : 'Buy'}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="text-sm text-ink-500">
        Carrying: {equipment.length ? equipment.join(', ') : 'nothing yet'}
      </div>
    </div>
  )
}

export default EquipmentShop
