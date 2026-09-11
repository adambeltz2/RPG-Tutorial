import { useState } from 'react'
import PartyTracker from '../components/PartyTracker.jsx'
import { applyEffect, useHealingPotion } from './applyEffect.js'
import { rollDie } from '../utils/dice.js'

function ScenarioEngine({ scenario, party, onUpdateParty, onRestart, initialNodeId, onNodeChange }) {
  const [currentNodeId, setCurrentNodeId] = useState(initialNodeId ?? scenario.startNode)
  const [lastRoll, setLastRoll] = useState(null)
  const node = scenario.nodes[currentNodeId]
  const visibleChoices = (node.choices ?? []).filter(
    (choice) => !choice.requiresClass || party.some((m) => m.class === choice.requiresClass),
  )

  function goTo(nodeId) {
    setCurrentNodeId(nodeId)
    onNodeChange?.(nodeId)
  }

  function usePotion(memberId) {
    onUpdateParty(useHealingPotion(party, memberId))
  }

  function applyAndNavigate(effect, nextNodeId) {
    const nextParty = effect ? applyEffect(effect, party) : party
    if (effect) onUpdateParty(nextParty)

    const wiped = nextParty.length > 0 && nextParty.every((m) => m.hp <= 0)
    goTo(wiped && scenario.nodes.party_wiped ? 'party_wiped' : nextNodeId)
  }

  function choose(choice) {
    if (choice.roll) {
      const { sides, target, successNode, failNode, successEffect, failEffect } = choice.roll
      const result = rollDie(sides)
      const success = result >= target
      setLastRoll({ result, sides, target, success })
      applyAndNavigate(success ? successEffect : failEffect, success ? successNode : failNode)
      return
    }

    setLastRoll(null)
    applyAndNavigate(choice.effect, choice.nextNode)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
      <div className="fantasy-panel p-5 space-y-4">
        {lastRoll && (
          <p className={`text-sm font-heading tracking-wide ${lastRoll.success ? 'text-green-700' : 'text-red-700'}`}>
            🎲 Rolled {lastRoll.result} on d{lastRoll.sides} (needed {lastRoll.target}+) —{' '}
            {lastRoll.success ? 'Success!' : 'Failure.'}
          </p>
        )}
        <p className="leading-relaxed">{node.text}</p>

        {node.isEnd ? (
          <button
            type="button"
            className="px-4 py-2 fantasy-panel font-heading tracking-wide text-amber-700 !border-amber-600 hover:bg-parchment-200"
            onClick={onRestart}
          >
            ↺ Restart Tutorial
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {visibleChoices.map((choice) => (
              <button
                key={choice.label}
                type="button"
                className="px-4 py-2 fantasy-panel text-left hover:bg-parchment-200"
                onClick={() => choose(choice)}
              >
                {choice.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <PartyTracker party={party} onUsePotion={usePotion} />
    </div>
  )
}

export default ScenarioEngine
