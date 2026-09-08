import { useState } from 'react'
import PartyTracker from '../components/PartyTracker.jsx'
import { applyEffect } from './applyEffect.js'

function ScenarioEngine({ scenario, party, onUpdateParty, onRestart }) {
  const [currentNodeId, setCurrentNodeId] = useState(scenario.startNode)
  const node = scenario.nodes[currentNodeId]

  function choose(choice) {
    if (choice.effect) {
      onUpdateParty(applyEffect(choice.effect, party))
    }
    setCurrentNodeId(choice.nextNode)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
      <div className="border border-stone-700 p-4 space-y-4">
        <p className="leading-relaxed">{node.text}</p>

        {node.isEnd ? (
          <button
            type="button"
            className="px-4 py-2 border border-amber-500 text-amber-400 hover:bg-stone-800"
            onClick={onRestart}
          >
            Restart Tutorial
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {node.choices.map((choice) => (
              <button
                key={choice.label}
                type="button"
                className="px-4 py-2 border border-stone-600 text-left hover:bg-stone-800"
                onClick={() => choose(choice)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <PartyTracker party={party} />
    </div>
  )
}

export default ScenarioEngine
