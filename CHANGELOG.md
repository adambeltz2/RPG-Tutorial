# Changelog

All notable changes to this project are logged here, one entry per PR.

## [Unreleased]

### PR #14 — Tailwind 4 Migration + CLAUDE.md Schema Docs
- Migrated Tailwind CSS 3 → 4 via the `@tailwindcss/vite` plugin: removed
  `tailwind.config.js`, `postcss.config.js`, and the `postcss`/
  `autoprefixer` dependencies entirely; the custom `parchment`/`ink`
  palette and monospace font now live in a `@theme` block in
  `src/index.css` (`@import "tailwindcss"` + `--color-*`/`--font-mono`
  custom properties), which Tailwind 4 turns into the same utility
  classes already used throughout the app (`bg-parchment-100`,
  `text-ink-500`, `font-mono`, etc.) — no component changes needed.
  Verified pixel-identical rendering (including hover states) via
  Playwright before/after. `npm audit`: still 0 vulnerabilities.
- Documented the `choice.effect` and `choice.roll` scenario-node schema
  extensions in `CLAUDE.md` itself (previously only in `backlog.md`/
  `CHANGELOG.md`), and refreshed the "Current Status & Next Steps"
  section, which had been stale since the very first milestone.
- Closes out the last two "Unscheduled / Ideas" items from the P0–P4
  backlog; added a `[PROCESS]` note about the stacked-PR merge gap found
  and fixed in PR #13.

### PR #13 — Integrate P4 Work Into Main
- PRs #7–#12 had each merged successfully, but only into their own base
  branch in the stack rather than into `main` — so none of that work had
  actually reached `main`. Traced this via the GitHub API (`merged: true`
  on all six, but `main` unchanged since PR #6) and `git log main..branch`
  on each intermediate branch.
- Found that `claude/fallen-party-handling`, `claude/scenario-depth`,
  `claude/vitest-setup`, and `claude/vite-8-upgrade` had already converged
  to be byte-identical, containing the full cumulative P4 work. Branched
  from the tip (`claude/vite-8-upgrade`), merged current `main` in (clean,
  no conflicts), re-ran the full test/build/Playwright regression suite,
  and opened a single PR straight to `main`.
- This is the PR that actually brought PRs #7–#12's work into `main`.

### PR #12 — Vite 8 Upgrade
- Upgraded `vite` (^5.4.11 → ^8.2.2), `@vitejs/plugin-react` (^4.3.4 →
  ^5.2.0), and `vitest` (^3.2.6 → ^5.0.0), resolving the moderate esbuild
  dev-server advisory that was the last remaining `npm audit` finding.
  `npm audit` now reports 0 vulnerabilities.
- Deliberately left Tailwind CSS on 3.x — Tailwind 4 is a separate breaking
  config rewrite, logged as its own follow-up in `backlog.md`.
- Last item in the P4 tier done — all of P0–P4 are now complete.

### PR #11 — Automated Tests (Vitest)
- Added `vitest` (pinned to `^3.2.6` — the first release patching a
  critical Vitest UI-server RCE advisory that affects `^2.x`/earlier `^3.x`,
  while still supporting our Vite 5 toolchain) as a dev dependency and a
  `npm test` script.
- Added unit tests for the pure logic modules: `src/utils/dice.test.js`
  (bounds/shape of `rollDie`/`rollDice`/`rollStartingGold`) and
  `src/engine/applyEffect.test.js` (immutability, random-target excludes
  fallen members, HP/gold never go negative, gold deduction order).
- Added `.github/workflows/ci.yml` (runs `npm test` + `npm run build` on
  every pull request) and wired `npm test` into `deploy.yml` before the
  build step, so a regression fails CI instead of only being caught by
  manual review.
- Fourth P4 item done; `backlog.md` and `CHANGELOG.md` updated. Manual
  Playwright browser runs remain the process for UI/flow verification per
  PR — this adds automated coverage for the pure-logic layer only.

### PR #10 — Scenario Depth (Fork + Flee Retry Loop)
- Added a `corridor_fork` decision node right after entering the dungeon,
  with a trap-free `quiet_passage` alternative to the existing trap path —
  a real branch point where different choices carry different risk.
- Fleeing the goblin room (`goblin_flee`) no longer dead-ends the tutorial —
  it now loops back to `corridor_fork` so the player can regroup and try a
  different approach, reinforcing that fleeing is a real tactic, not a loss
  state.
- Third P4 item done; `backlog.md` and `CHANGELOG.md` updated.

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
