# Changelog

All notable changes to this project are logged here, one entry per PR.

## [Unreleased]

### PR #9 — Fallen-Party (Game Over) Handling
- `ScenarioEngine` now detects a full party wipe (every member at 0 HP) after
  any `effect` resolves and routes to a dedicated `party_wiped` end node
  instead of the choice's normal destination, if the active scenario defines
  one. Added `party_wiped` to `src/data/scenarios/intro.json`.
- `applyEffect`'s random-target selection already excluded fallen (0 HP)
  members from being re-targeted — confirmed via a seeded-party test rather
  than changed, since it was already correct.
- Second P4 item done; `backlog.md` and `CHANGELOG.md` updated.

### PR #8 — Dice-Roll Combat Resolution
- The goblin room's "Fight them" choice now resolves with a real d6 roll
  (needs 4+) instead of an automatic narrative win, via a new `choice.roll`
  schema (`sides`, `target`, `successNode`/`failNode`, optional
  `successEffect`/`failEffect`) resolved in `ScenarioEngine.choose()`.
- Added a `goblin_fight_setback` node for the failure branch (a random party
  member takes 1 HP damage but the story continues to the treasure room).
- `ScenarioEngine` shows a "🎲 Rolled N on dS (needed T+) — Success!/Failure."
  banner above the node text after a roll, colored green/red.
- First tier P4 item done; `backlog.md` and `CHANGELOG.md` updated.

### PR #7 — Session Persistence
- Added `src/utils/storage.js` (`loadSession`/`saveSession`/`clearSession`,
  wrapped in try/catch for private-browsing/quota safety).
- `App.jsx` now initializes `phase`, `party`, and the scenario's current node
  from `localStorage` and persists them on every change, so an in-progress
  party or scenario position survives a page reload.
- `ScenarioEngine` accepts optional `initialNodeId`/`onNodeChange` props
  (backward compatible — falls back to internal state) so `App.jsx` can
  control and persist the current node.
- Marks all of P0–P3 complete in `backlog.md`; added a new P4 tier for
  follow-up work (real dice-roll resolution, fallen-party handling, a
  second scenario, automated tests, the Vite 8 upgrade).

### PR #6 — GitHub Pages Deployment
- Added `.github/workflows/deploy.yml`: builds with `npm ci && npm run build`
  and publishes `dist/` to GitHub Pages via `actions/deploy-pages` on every
  push to `main` (plus manual `workflow_dispatch`).
- Set `base: '/RPG-Tutorial/'` in `vite.config.js` so built asset URLs resolve
  correctly when served from the project pages path.
- Note: the repo's Settings → Pages → Source must be set to "GitHub Actions"
  once for the workflow to actually publish (logged in `backlog.md`).

### PR #5 — Terminal/Parchment Theme
- Added a `parchment`/`ink` color palette to `tailwind.config.js` and set the
  monospace font stack, replacing the placeholder dark `stone`/`amber` theme
  across `App.jsx` and all components with the light terminal/parchment
  aesthetic described in `CLAUDE.md`.

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
