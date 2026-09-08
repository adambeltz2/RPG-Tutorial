# Changelog

All notable changes to this project are logged here, one entry per PR.

## [Unreleased]

### PR #4 — Scenario Engine
- Added `ScenarioEngine` (state machine over scenario-node JSON), `PartyTracker`
  (persistent HP/gold display during encounters), and `src/data/scenarios/intro.json`
  (the introductory tutorial scenario: trap, goblin encounter with
  fight/bribe/flee branches, and a magic-assisted treasure room).
- Added `src/engine/applyEffect.js` to resolve optional `choice.effect`
  (`hpDelta`, `goldDelta`) against the party — an extension to the scenario
  node schema so choices can affect party state, not just branch narrative.
- Wired the Scenario Engine into `App.jsx`'s `scenario_runner` phase, with a
  restart action that returns to Character Creation.

### PR #3 — Character Creation Wizard
- Added `PartyBuilder`, `ClassSelector` (8 classes), `DiceRoller` (2d6x10
  starting gold), and `EquipmentShop` (buy/remove items against gold).
- `App.jsx` now unlocks "Begin Adventure" once all 4 party slots are filled.

### PR #2 — Project Foundation
- Scaffolded the Vite + React + Tailwind project.
- Added the `App.jsx` shell implementing the two-phase state machine
  (`character_creation` vs `scenario_runner`).

### PR #1 — Documentation
- Restructured `CLAUDE.md` into numbered sections with a merged project
  overview and technology stack.
- Added `README.md` and the initial prioritized `backlog.md`.
