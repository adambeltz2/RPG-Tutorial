import { useState } from 'react'
import PartyBuilder from './components/PartyBuilder.jsx'
import ScenarioEngine from './engine/ScenarioEngine.jsx'
import introScenario from './data/scenarios/intro.json'

const PHASES = {
  CHARACTER_CREATION: 'character_creation',
  SCENARIO_RUNNER: 'scenario_runner',
}

function App() {
  const [phase, setPhase] = useState(PHASES.CHARACTER_CREATION)
  const [party, setParty] = useState([])

  const readyCount = party.filter(Boolean).length

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-mono">
      <header className="border-b border-stone-700 p-4">
        <h1 className="text-xl">Four Against Darkness — Web Tutorial</h1>
      </header>

      <main className="p-6">
        {phase === PHASES.CHARACTER_CREATION && (
          <section>
            <h2 className="text-lg mb-4">Character Creation Wizard</h2>
            <PartyBuilder party={party} onChangeParty={setParty} />
            <button
              type="button"
              className="mt-6 px-4 py-2 border border-stone-500 hover:bg-stone-800 disabled:opacity-30"
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
              onRestart={() => {
                setParty([])
                setPhase(PHASES.CHARACTER_CREATION)
              }}
            />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
