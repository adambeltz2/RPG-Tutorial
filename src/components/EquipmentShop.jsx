import { EQUIPMENT } from '../data/equipment.js'

function EquipmentShop({ gold, equipment, onBuy, onSell }) {
  return (
    <div>
      <label className="block text-sm text-stone-400 mb-1">
        Equipment Shop — {gold} gold remaining
      </label>
      <ul className="grid grid-cols-2 gap-2 mb-3">
        {EQUIPMENT.map((item) => {
          const owned = equipment.includes(item.name)
          const affordable = gold >= item.cost
          return (
            <li key={item.name} className="flex items-center justify-between border border-stone-700 px-3 py-2">
              <span>
                {item.name}
                <span className="block text-xs text-stone-500">{item.cost} gold</span>
              </span>
              <button
                type="button"
                disabled={owned ? false : !affordable}
                onClick={() => (owned ? onSell(item) : onBuy(item))}
                className={`px-2 py-1 text-xs border ${
                  owned
                    ? 'border-red-500 text-red-400 hover:bg-stone-800'
                    : 'border-stone-500 hover:bg-stone-800 disabled:opacity-30'
                }`}
              >
                {owned ? 'Remove' : 'Buy'}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="text-sm text-stone-400">
        Carrying: {equipment.length ? equipment.join(', ') : 'nothing yet'}
      </div>
    </div>
  )
}

export default EquipmentShop
