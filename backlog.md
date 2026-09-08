# Backlog

Prioritized work for the Four Against Darkness Web Tutorial System. Items are
grouped by priority tier, then tagged `[BUG]`, `[FEATURE]`, `[REFACTOR]`, or
`[DEBT]` per the Scope Management protocol in `CLAUDE.md`. Checked items are
merged or in an open PR (noted inline).

## P0 — Project Foundation ✅
- [x] [FEATURE] Scaffold the Vite + React + Tailwind project (`package.json`,
  `vite.config.js`, `tailwind.config.js`, `index.html`, `src/main.jsx`).
  Affected files: repo root, `src/`. (PR #2, merged)
- [x] [FEATURE] Establish top-level app shell with the two-phase state machine
  (`character_creation` vs `scenario_runner`). Affected files: `src/App.jsx`.
  (PR #2, merged)

## P1 — Character Creation Wizard ✅
- [x] [FEATURE] `PartyBuilder` component: 4-slot party overview + active editor.
  Affected files: `src/components/PartyBuilder.jsx`. (PR #3)
- [x] [FEATURE] Class selection UI (Warrior, Cleric, Rogue, Wizard, Elf, Dwarf,
  Halfling, Barbarian). Affected files: `src/components/ClassSelector.jsx`. (PR #3)
- [x] [FEATURE] Starting-gold dice roller. Affected files:
  `src/components/DiceRoller.jsx`. (PR #3)
- [x] [FEATURE] `EquipmentShop` component for spending starting gold. Affected
  files: `src/components/EquipmentShop.jsx`. (PR #3)

## P2 — Scenario Engine ✅
- [x] [FEATURE] Scenario state machine that walks scenario-node JSON and renders
  narrative + choices. Affected files: `src/engine/ScenarioEngine.jsx`. (PR #4)
- [x] [FEATURE] Persistent party tracker (HP/resources) visible during encounters.
  Affected files: `src/components/PartyTracker.jsx`. (PR #4)
- [x] [FEATURE] Author the introductory tutorial scenario JSON (combat, traps,
  fleeing, magic). Affected files: `src/data/scenarios/intro.json`. (PR #4)

## P3 — Polish & Deployment
- [x] [FEATURE] Terminal/parchment visual theme via Tailwind config. Affected
  files: `tailwind.config.js`, `src/App.jsx`, `src/components/*.jsx`,
  `src/engine/ScenarioEngine.jsx`. (PR #5)
- [ ] [FEATURE] GitHub Pages deployment workflow. Affected files:
  `.github/workflows/deploy.yml`, `vite.config.js` (base path).
- [ ] [DEBT] Add persistence (e.g. `localStorage`) so an in-progress party/session
  survives a page reload. Affected files: `src/App.jsx`.

## Unscheduled / Ideas
_(New feature ideas, edge cases, and non-critical bugs get logged here as
they're discovered, instead of being implemented ad hoc.)_
- [DEBT] `npm audit` flags a moderate esbuild dev-server advisory via the
  Vite 5 toolchain; the only fix is a breaking Vite 8 upgrade
  (`npm audit fix --force`). Dev-server-only exposure, low risk for this
  personal-use project — revisit when doing a Vite major-version bump.
  Affected files: `package.json`.
- [FEATURE] Scenario nodes support an optional `choice.effect`
  (`hpDelta`/`goldDelta`, `target: "random"`) resolved by
  `src/engine/applyEffect.js` — extends the CLAUDE.md scenario-node schema so
  choices can actually move the needle on HP/gold, not just branch narrative.
  Introduced in PR #4; consider promoting this to a documented part of the
  scenario data structure in CLAUDE.md if more scenarios adopt it.
- [FEATURE] Combat/trap/attack resolution is currently narrative-only (no real
  dice roll against a target number). A future scenario could add an actual
  d6 roll-under/roll-over check before applying `effect`, closer to the
  tabletop rules. Affected files: `src/engine/ScenarioEngine.jsx`.
- [BUG] If a party member's HP reaches 0 there's no "fallen" handling beyond
  the strikethrough name in `PartyTracker` — no game-over or bench logic yet.
  Low priority since the intro scenario's only HP loss is a minor trap dart.
  Affected files: `src/components/PartyTracker.jsx`, `src/engine/ScenarioEngine.jsx`.
