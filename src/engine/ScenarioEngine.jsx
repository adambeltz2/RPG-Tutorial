import { useState } from 'react'
import PartyTracker from '../components/PartyTracker.jsx'
import { applyEffect } from './applyEffect.js'
import { rollDie } from '../utils/dice.js'

function ScenarioEngine({ scenario, party, onUpdateParty, onRestart, initialNodeId, onNodeChange }) {
  const [currentNodeId, setCurrentNodeId] = useState(initialNodeId ?? scenario.startNode)
  const [lastRoll, setLastRoll] = useState(null)
  const node = scenario.nodes[currentNodeId]

  function goTo(nodeId) {
    setCurrentNodeId(nodeId)
    onNodeChange?.(nodeId)
  }

  function choose(choice) {
    if (choice.roll) {
      const { sides, target, successNode, failNode, successEffect, failEffect } = choice.roll
      const result = rollDie(sides)
      const success = result >= target
      if (success && successEffect) onUpdateParty(applyEffect(successEffect, party))
      if (!success && failEffect) onUpdateParty(applyEffect(failEffect, party))
      setLastRoll({ result, sides, target, success })
      goTo(success ? successNode : failNode)
      return
    }

    setLastRoll(null)
    if (choice.effect) {
      onUpdateParty(applyEffect(choice.effect, party))
    }
    goTo(choice.nextNode)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
      <div className="border border-ink-400 p-4 space-y-4">
        {lastRoll && (
          <p className={`text-sm ${lastRoll.success ? 'text-green-700' : 'text-red-700'}`}>
            🎲 Rolled {lastRoll.result} on d{lastRoll.sides} (needed {lastRoll.target}+) —{' '}
            {lastRoll.success ? 'Success!' : 'Failure.'}
          </p>
        )}
        <p className="leading-relaxed">{node.text}</p>

        {node.isEnd ? (
          <button
            type="button"
            className="px-4 py-2 border border-amber-600 text-amber-700 hover:bg-parchment-200"
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
                className="px-4 py-2 border border-ink-400 text-left hover:bg-parchment-200"
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
