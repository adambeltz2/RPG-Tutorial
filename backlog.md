# Backlog

Prioritized work for the Four Against Darkness Web Tutorial System. Items are
grouped by priority tier, then tagged `[BUG]`, `[FEATURE]`, `[REFACTOR]`, or
`[DEBT]` per the Scope Management protocol in `CLAUDE.md`.

## P0 — Project Foundation
- [FEATURE] Scaffold the Vite + React + Tailwind project (`package.json`,
  `vite.config.js`, `tailwind.config.js`, `index.html`, `src/main.jsx`).
  Affected files: repo root, `src/`.
- [FEATURE] Establish top-level app shell with the two-phase state machine
  (`character_creation` vs `scenario_runner`). Affected files: `src/App.jsx`.

## P1 — Character Creation Wizard
- [FEATURE] `PartyBuilder` component: 4-slot party overview + active editor.
  Affected files: `src/components/PartyBuilder.jsx`.
- [FEATURE] Class selection UI (Warrior, Cleric, Rogue, Wizard, Elf, Dwarf,
  Halfling, Barbarian). Affected files: `src/components/ClassSelector.jsx`.
- [FEATURE] Starting-gold dice roller. Affected files:
  `src/components/DiceRoller.jsx`.
- [FEATURE] `EquipmentShop` component for spending starting gold. Affected
  files: `src/components/EquipmentShop.jsx`.

## P2 — Scenario Engine
- [FEATURE] Scenario state machine that walks scenario-node JSON and renders
  narrative + choices. Affected files: `src/engine/ScenarioEngine.jsx`.
- [FEATURE] Persistent party tracker (HP/resources) visible during encounters.
  Affected files: `src/components/PartyTracker.jsx`.
- [FEATURE] Author the introductory tutorial scenario JSON (combat, traps,
  fleeing, magic). Affected files: `src/data/scenarios/intro.json`.

## P3 — Polish & Deployment
- [FEATURE] Terminal/parchment visual theme via Tailwind config. Affected
  files: `tailwind.config.js`, `src/index.css`.
- [FEATURE] GitHub Pages deployment workflow. Affected files:
  `.github/workflows/deploy.yml`, `vite.config.js` (base path).
- [DEBT] Add persistence (e.g. `localStorage`) so an in-progress party/session
  survives a page reload. Affected files: `src/App.jsx`.

## Unscheduled / Ideas
_(New feature ideas, edge cases, and non-critical bugs get logged here as
they're discovered, instead of being implemented ad hoc.)_
