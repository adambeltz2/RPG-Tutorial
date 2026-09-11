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
- [x] [BUG] If a party member's HP reaches 0 there's no "fallen" handling
  beyond the strikethrough name in `PartyTracker` — no game-over state or
  exclusion from further random-target effects. Affected files:
  `src/components/PartyTracker.jsx`, `src/engine/ScenarioEngine.jsx`,
  `src/engine/applyEffect.js`, `src/data/scenarios/intro.json`. (PR #9)
- [x] [FEATURE] A second tutorial scenario (or deeper branches on the first)
  to reinforce combat/trap/flee/magic mechanics beyond one playthrough.
  Affected files: `src/data/scenarios/intro.json`. (PR #10 — added a
  `corridor_fork` decision point with a trap-free `quiet_passage`
  alternative, and turned fleeing into a real retry loop back to the fork
  instead of a hard dead end.)
- [x] [DEBT] No automated tests exist yet — verification has been manual
  `npm run build` + Playwright browser runs per PR. Consider a lightweight
  component/unit test setup (e.g. Vitest) so regressions are caught in CI,
  not just by hand. Affected files: `package.json`,
  `src/utils/dice.test.js`, `src/engine/applyEffect.test.js`,
  `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`. (PR #11 —
  added Vitest unit tests for the pure logic modules (dice, applyEffect),
  wired `npm test` into both a new PR-gating CI workflow and the deploy
  workflow. Manual Playwright browser runs remain the process for UI/flow
  verification per PR — this covers the pure-logic layer only.)
- [x] [DEBT] `npm audit` flags a moderate esbuild dev-server advisory via the
  Vite 5 toolchain; the only fix is a breaking Vite 8 upgrade
  (`npm audit fix --force`). Dev-server-only exposure, low risk for this
  personal-use project — revisit as its own dedicated PR given the breaking
  change. Affected files: `package.json`. (PR #12 — upgraded to Vite 8.2.2,
  `@vitejs/plugin-react` 5.2.0, and Vitest 5.0.0; kept Tailwind CSS on 3.x
  since Tailwind 4 is a separate breaking rewrite out of scope here.
  `npm audit` now reports 0 vulnerabilities.)

All P0–P4 backlog items are complete as of PR #12. Found while reviewing the
codebase against the backlog (2026-09-11) — none of these are implemented
yet, logged here per the Scope Management protocol rather than fixed ad hoc.

## P5 — Gameplay Correctness & Content Follow-through
- [ ] [BUG] `PartyBuilder` lets a player reroll an already-equipped hero's
  gold without resetting `equipment` — since owned items aren't re-charged
  against the new roll, buy gear, save, reopen the hero, reroll to a lower
  amount, and keep all the equipment for free. Fix: reset `equipment: []`
  (or block rerolling) once a hero has purchased items. Affected files:
  `src/components/PartyBuilder.jsx`.
- [ ] [BUG] `applyEffect`'s `goldDelta` handling only works correctly for
  spending (negative deltas) — a positive `goldDelta` (e.g. a reward)
  dumps the entire amount onto whichever party member is processed first
  instead of distributing it. Nothing hits this today only because no
  scenario node uses a positive `goldDelta` yet, but it will silently
  misbehave the moment one does. Affected files: `src/engine/applyEffect.js`.
- [ ] [BUG] A restored session's `scenarioNodeId` is trusted without
  checking it still exists in the current scenario's `nodes` map. The
  scenario graph has already changed once (PR #10 added `corridor_fork`);
  a returning visitor with an old session pointing at a since-renamed or
  removed node will crash on `node.text` (`node` is `undefined`) with no
  recovery except manually clearing `localStorage`. Fix: validate on load
  and fall back to `scenario.startNode` (or `character_creation`) if the
  saved node id isn't found. Affected files: `src/App.jsx`,
  `src/utils/storage.js`.
- [ ] [FEATURE] `treasure_found`'s narrative promises "a stash of gold and
  a masterwork dagger," but no `effect` actually grants gold or adds the
  dagger to `equipment` — the reward is cosmetic text only. Wire up a real
  `effect` once the positive-`goldDelta` bug above is fixed. Affected
  files: `src/data/scenarios/intro.json`.
- [ ] [FEATURE] "Healing Potion" is purchasable (12 gold) in
  `EquipmentShop` but has no in-scenario use — nothing ever consumes it or
  restores HP. Either add a "Drink Healing Potion" action available
  during encounters (consuming it from `equipment`, healing some HP), or
  remove it from the shop until it does something. Affected files:
  `src/data/equipment.js`, `src/engine/ScenarioEngine.jsx`,
  `src/engine/applyEffect.js`.
- [ ] [FEATURE] `magic_lesson` narrates "Your Wizard channels arcane
  energy..." regardless of whether the party actually has a Wizard (or
  any spellcaster) in it. Consider gating or varying this choice/text on
  party composition for a more coherent moment. Affected files:
  `src/data/scenarios/intro.json`, `src/engine/ScenarioEngine.jsx`.

## Unscheduled / Ideas
_(New feature ideas, edge cases, and non-critical bugs get logged here as
they're discovered, instead of being implemented ad hoc.)_
- [x] [FEATURE] Document the `choice.effect` and `choice.roll` scenario-node
  schema extensions (introduced in PR #4 and PR #8) in `CLAUDE.md` itself,
  not just `backlog.md`/`CHANGELOG.md`, now that two mechanics depend on
  them. Affected files: `CLAUDE.md`. (PR #14 — added a full "Choice Schema
  Extensions" subsection under Data Structures, plus refreshed the stale
  "Current Status & Next Steps" section that still referenced the very
  first milestone.)
- [x] [DEBT] Tailwind CSS is still on 3.x; Tailwind 4 is a separate breaking
  rewrite (CSS-based config via `@import "tailwindcss"` instead of
  `tailwind.config.js` + PostCSS plugins) deliberately left out of the
  Vite 8 upgrade (PR #12) to keep that change focused. Affected files:
  `tailwind.config.js`, `postcss.config.js`, `src/index.css`,
  `package.json`, `vite.config.js`. (PR #14 — migrated to Tailwind 4 via
  the `@tailwindcss/vite` plugin; removed `tailwind.config.js`,
  `postcss.config.js`, and the `autoprefixer`/`postcss` dependencies
  entirely; moved the custom `parchment`/`ink` palette and monospace font
  into a `@theme` block in `src/index.css`. Verified pixel-identical
  rendering via Playwright, including hover states, before and after.)
- [x] [DEBT] GitHub Pages hosting (Settings → Pages) needs its Source set to
  "GitHub Actions" for `.github/workflows/deploy.yml` to actually publish —
  this is a one-time repo setting, not something a PR can change. Flagged
  in PR #6 for the repo owner to enable. (Done — repo owner enabled it;
  confirmed via the workflow logs and a successful re-run. Live at
  https://adambeltz2.github.io/RPG-Tutorial/, linked from `README.md`.)
- [DEBT] Every dev-server/build screenshot and Playwright run logs a single
  harmless `404` for a missing favicon (no `favicon.ico` or `<link rel=
  "icon">` in `index.html`). Cosmetic/log-noise only, but a two-minute fix:
  add a favicon (even a plain parchment/dice-themed one) and reference it
  in `index.html`. Affected files: `index.html`, a new `public/` asset.
- [PROCESS] Stacked PRs (#7–#12) were each merged successfully but only
  into their own base branch, not into `main` — since every base was the
  previous branch in the stack rather than `main`, none of that work
  actually reached `main` until a manual follow-up integration PR (#13)
  merged the fully-consolidated tip branch into `main` directly. When
  stacking PRs again: either retarget/merge them strictly bottom-up
  (merge the PR into `main` first, then repoint the next PR's base to
  `main`, and so on up the stack) or open one final PR from the top of
  the stack straight to `main` once every PR in the chain shows
  `merged: true`, and confirm with `git log main..<branch>` that the
  branch is actually ahead of `main` before assuming the work landed.
- [x] [FEATURE] Redesign the visual theme for a fantasy/storybook feel
  rather than the flat terminal-style look, while staying highly readable.
  Affected files: `index.html`, `src/index.css`, `src/App.jsx`, and every
  component in `src/components/` and `src/engine/`. (Added Google Fonts
  Cinzel (headings) and EB Garamond (body) via `index.html`; added
  `parchment-bg`, `fantasy-panel`, and `fantasy-divider`/`fantasy-divider-
  mark` custom Tailwind v4 `@utility` classes in `src/index.css` — a soft
  parchment vignette background and ornate double-bordered "scroll" panels
  used throughout; swapped `font-mono` for `font-serif`/`font-heading`
  everywhere; added themed touches (⚔️/📜/🎲/↺ and an ornamental divider
  mark). Verified with Playwright that the full playthrough, dice-roll
  banner, and party-wipe screens all still render correctly and legibly.)
