import { useEffect, useState } from 'react'
import PartyBuilder from './components/PartyBuilder.jsx'
import ScenarioEngine from './engine/ScenarioEngine.jsx'
import introScenario from './data/scenarios/intro.json'
import { loadSession, saveSession, clearSession } from './utils/storage.js'

const PHASES = {
  CHARACTER_CREATION: 'character_creation',
  SCENARIO_RUNNER: 'scenario_runner',
}

const savedSession = loadSession()

function App() {
  const [phase, setPhase] = useState(savedSession?.phase ?? PHASES.CHARACTER_CREATION)
  const [party, setParty] = useState(savedSession?.party ?? [])
  const [scenarioNodeId, setScenarioNodeId] = useState(savedSession?.scenarioNodeId ?? introScenario.startNode)

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
    <div className="min-h-screen bg-parchment-100 text-ink-700 font-mono">
      <header className="border-b border-ink-400 p-4">
        <h1 className="text-xl">Four Against Darkness — Web Tutorial</h1>
      </header>

      <main className="p-6">
        {phase === PHASES.CHARACTER_CREATION && (
          <section>
            <h2 className="text-lg mb-4">Character Creation Wizard</h2>
            <PartyBuilder party={party} onChangeParty={setParty} />
            <button
              type="button"
              className="mt-6 px-4 py-2 border border-ink-500 hover:bg-parchment-200 disabled:opacity-30"
              disabled={readyCount < 4}
              onClick={() => setPhase(PHASES.SCENARIO_RUNNER)}
            >
              Begin Adventure ({readyCount}/4)
            </button>
          </section>
        )}

        {phase === PHASES.SCENARIO_RUNNER && (
          <section>
            <h2 className="text-lg mb-4">Scenario Engine</h2>
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
