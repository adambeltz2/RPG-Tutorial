import { useEffect, useState } from 'react'
import PartyBuilder from './components/PartyBuilder.jsx'
import GuideNote from './components/GuideNote.jsx'
import ScenarioEngine from './engine/ScenarioEngine.jsx'
import introScenario from './data/scenarios/intro.json'
import { loadSession, saveSession, clearSession } from './utils/storage.js'

const PHASES = {
  CHARACTER_CREATION: 'character_creation',
  SCENARIO_RUNNER: 'scenario_runner',
}

const savedSession = loadSession()

export function isValidNodeId(nodeId) {
  return typeof nodeId === 'string' && Object.prototype.hasOwnProperty.call(introScenario.nodes, nodeId)
}

function App() {
  const [phase, setPhase] = useState(savedSession?.phase ?? PHASES.CHARACTER_CREATION)
  const [party, setParty] = useState(savedSession?.party ?? [])
  const [scenarioNodeId, setScenarioNodeId] = useState(
    isValidNodeId(savedSession?.scenarioNodeId) ? savedSession.scenarioNodeId : introScenario.startNode,
  )

  useEffect(() => {
    saveSession({ phase, party, scenarioNodeId })
  }, [phase, party, scenarioNodeId])

  const readyCount = party.filter(Boolean).length

  function restart() {
    setParty([])
    setScenarioNodeId(introScenario.startNode)
    setPhase(PHASES.CHARACTER_CREATION)
    clearSession()
  }

  return (
    <div className="min-h-screen parchment-bg text-ink-700 font-serif">
      <header className="px-6 pt-8 pb-5 text-center">
        <h1 className="font-heading text-2xl md:text-3xl tracking-wide text-ink-700">
          Four Against Darkness
        </h1>
        <p className="mt-1 italic text-ink-500">A Web Companion for the Tabletop Adventure</p>
        <div className="fantasy-divider mt-5 max-w-md mx-auto" role="presentation">
          <span className="fantasy-divider-mark">⚜</span>
        </div>
      </header>

      <main className="px-6 pb-10 max-w-5xl mx-auto">
        {phase === PHASES.CHARACTER_CREATION && (
          <section>
            <h2 className="font-heading text-xl tracking-wide text-ink-700 mb-4">
              ⚔️ Character Creation
            </h2>
            <GuideNote title="Setup — Building Your Party">
              In Four Against Darkness, every adventure begins by assembling a
              party of <strong>four</strong> heroes. Click each empty slot below
              to create one: give them a name, pick a class (this decides their
              starting Hit Points — how much damage they can take before
              falling), roll for starting gold, and spend it in the equipment
              shop. There's no wrong way to build a party, but a mix of classes
              (a tough front-liner, a Wizard for magic, etc.) tends to handle
              the dungeon's variety of threats better than four of the same
              class.
            </GuideNote>
            <div className="mt-4">
              <PartyBuilder party={party} onChangeParty={setParty} />
            </div>
            <button
              type="button"
              className="mt-6 px-5 py-2 fantasy-panel font-heading tracking-wide text-ink-700 hover:bg-parchment-200 disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={readyCount < 4}
              onClick={() => setPhase(PHASES.SCENARIO_RUNNER)}
            >
              Begin Adventure ({readyCount}/4)
            </button>
          </section>
        )}

        {phase === PHASES.SCENARIO_RUNNER && (
          <section>
            <h2 className="font-heading text-xl tracking-wide text-ink-700 mb-4">
              📜 The Adventure Unfolds
            </h2>
            <ScenarioEngine
              scenario={introScenario}
              party={party}
              onUpdateParty={setParty}
              onRestart={restart}
              initialNodeId={scenarioNodeId}
              onNodeChange={setScenarioNodeId}
            />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
