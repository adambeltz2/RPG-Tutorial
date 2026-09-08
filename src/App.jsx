import { useState } from 'react'

const PHASES = {
  CHARACTER_CREATION: 'character_creation',
  SCENARIO_RUNNER: 'scenario_runner',
}

function App() {
  const [phase, setPhase] = useState(PHASES.CHARACTER_CREATION)
  const [party, setParty] = useState([])

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-mono">
      <header className="border-b border-stone-700 p-4">
        <h1 className="text-xl">Four Against Darkness — Web Tutorial</h1>
      </header>

      <main className="p-6">
        {phase === PHASES.CHARACTER_CREATION && (
          <section>
            <h2 className="text-lg mb-2">Character Creation Wizard</h2>
            <p className="text-stone-400">
              Party builder coming soon. Party members so far: {party.length}/4
            </p>
            <button
              type="button"
              className="mt-4 px-4 py-2 border border-stone-500 hover:bg-stone-800"
              disabled={party.length < 4}
              onClick={() => setPhase(PHASES.SCENARIO_RUNNER)}
            >
              Begin Adventure
            </button>
          </section>
        )}

        {phase === PHASES.SCENARIO_RUNNER && (
          <section>
            <h2 className="text-lg mb-2">Scenario Engine</h2>
            <p className="text-stone-400">Scenario engine coming soon.</p>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
