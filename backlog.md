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

## P3 — Polish & Deployment ✅
- [x] [FEATURE] Terminal/parchment visual theme via Tailwind config. Affected
  files: `tailwind.config.js`, `src/App.jsx`, `src/components/*.jsx`,
  `src/engine/ScenarioEngine.jsx`. (PR #5)
- [x] [FEATURE] GitHub Pages deployment workflow. Affected files:
  `.github/workflows/deploy.yml`, `vite.config.js` (base path). (PR #6)
- [x] [DEBT] Add persistence (e.g. `localStorage`) so an in-progress party/session
  survives a page reload. Affected files: `src/App.jsx`,
  `src/utils/storage.js`, `src/engine/ScenarioEngine.jsx`. (PR #7)

All four original priority tiers (P0–P3) are complete. The items below are
follow-ups discovered along the way, now organized as the next tier.

## P4 — Depth & Robustness
- [x] [FEATURE] Real dice-roll resolution for combat choices (e.g. a d6
  roll-under/roll-over vs. a target number, shown to the player) instead of
  narrative-only "you roll to attack and win" outcomes. Affected files:
  `src/engine/ScenarioEngine.jsx`, `src/utils/dice.js`,
  `src/data/scenarios/intro.json`. (PR #8)
- [ ] [BUG] If a party member's HP reaches 0 there's no "fallen" handling
  beyond the strikethrough name in `PartyTracker` — no game-over state or
  exclusion from further random-target effects. Affected files:
  `src/components/PartyTracker.jsx`, `src/engine/ScenarioEngine.jsx`,
  `src/engine/applyEffect.js`.
- [ ] [FEATURE] A second tutorial scenario (or deeper branches on the first)
  to reinforce combat/trap/flee/magic mechanics beyond one playthrough.
  Affected files: `src/data/scenarios/`.
- [ ] [DEBT] No automated tests exist yet — verification has been manual
  `npm run build` + Playwright browser runs per PR. Consider a lightweight
  component/unit test setup (e.g. Vitest) so regressions are caught in CI,
  not just by hand.
- [ ] [DEBT] `npm audit` flags a moderate esbuild dev-server advisory via the
  Vite 5 toolchain; the only fix is a breaking Vite 8 upgrade
  (`npm audit fix --force`). Dev-server-only exposure, low risk for this
  personal-use project — revisit as its own dedicated PR given the breaking
  change. Affected files: `package.json`.

## Unscheduled / Ideas
_(New feature ideas, edge cases, and non-critical bugs get logged here as
they're discovered, instead of being implemented ad hoc.)_
- [FEATURE] Scenario nodes support an optional `choice.effect`
  (`hpDelta`/`goldDelta`, `target: "random"`) resolved by
  `src/engine/applyEffect.js` — extends the CLAUDE.md scenario-node schema so
  choices can actually move the needle on HP/gold, not just branch narrative.
  Introduced in PR #4; consider promoting this to a documented part of the
  scenario data structure in CLAUDE.md if more scenarios adopt it.
- [FEATURE] Choices can also carry a `choice.roll` (`sides`, `target`,
  `successNode`/`failNode`, optional `successEffect`/`failEffect`) resolved
  in `ScenarioEngine.choose()` — a second schema extension (alongside
  `choice.effect`) so a choice can branch on a real dice roll instead of a
  fixed `nextNode`. Introduced in PR #8; worth documenting in CLAUDE.md
  alongside `choice.effect` if a third scenario schema extension shows up.
- [DEBT] GitHub Pages hosting (Settings → Pages) needs its Source set to
  "GitHub Actions" for `.github/workflows/deploy.yml` to actually publish —
  this is a one-time repo setting, not something a PR can change. Flagged
  in PR #6 for the repo owner to enable.
