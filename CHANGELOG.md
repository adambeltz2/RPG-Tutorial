# Changelog

All notable changes to this project are logged here, one entry per PR.

## [Unreleased]

### PR #22 — Guide-Heavy Setup and Turn-by-Turn Rules Teaching
- Added `src/components/GuideNote.jsx`, a reusable callout (dashed border,
  "📖 [title]" label) visually distinct from the game's own `fantasy-panel`
  UI elements, for rules-teaching prose separate from narrative/story text.
- Character Creation now opens with a Setup overview (`GuideNote` in
  `App.jsx`) explaining party assembly, plus a `GuideNote` under each of
  Class, Starting Gold, and Equipment in `PartyBuilder` explaining what
  that step means and why it matters in FAD terms.
- Every node in `src/data/scenarios/intro.json` gained a `turn` number
  (shown by `ScenarioEngine` as a small "TURN N" label) and a `guide`
  string explaining the actual FAD mechanic behind that turn — e.g. why
  fight/bribe/flee are all legitimate, what a failed attack roll costs
  and why, why fleeing is free. `ScenarioEngine` renders `node.guide` in
  a `GuideNote` beneath the narrative text whenever present.
- Documented the `turn`/`guide` node fields in `CLAUDE.md`'s Scenario Node
  Example, framing the experience as deliberately guide-heavy.
- Verified with Playwright across the full playthrough (including the
  Wizard-gated and Wizard-less paths) and the party-wipe screen that guide
  notes render correctly throughout without disrupting existing behavior;
  all 26 existing tests still pass unchanged (this was a content/UI-only
  change, no logic modified).

### PR #21 — Favicon and Real Equipment Rewards
- Added an inline base64-encoded SVG favicon (a die emoji) via a
  `<link rel="icon">` in `index.html` — no separate asset file needed.
  Eliminates the harmless-but-noisy 404 that showed up on every
  dev-server/build run.
- Added a generic `effect.itemsGranted` extension in `applyEffect.js`
  that adds item(s) to one random living party member's `equipment`
  (falling back to the whole party if everyone has fallen), combinable
  with `hpDelta`/`goldDelta` in the same effect.
- `treasure_found`'s "Open the chest" choices now grant a "Masterwork
  Dagger" alongside the gold, matching the narrative for the first time.
- `PartyTracker` now shows each member's carried items ("Carrying: ...",
  hidden when the list is empty) during a scenario, so a granted item is
  actually visible to the player instead of only showing up in
  `EquipmentShop` during character creation.
- Documented `itemsGranted` and the new `PartyTracker` equipment display
  in `CLAUDE.md`. Added 4 new tests to `applyEffect.test.js` (26 total).
- Verified with Playwright that the dagger lands on a party member and
  displays correctly, and that the favicon 404 is gone.
- Closes out every actionable item in `backlog.md` to date.

### PR #20 — Complete the P5 Backlog: Rewards, Healing, Class-Gated Choices
- Fixed `applyEffect`'s `goldDelta` for positive amounts (rewards): now
  splits evenly across living party members (falling back to the whole
  party if everyone has fallen), handing out any remainder one gold at a
  time instead of dumping the whole amount on the first member.
- Wired a real reward into `treasure_found`: both "Open the chest"
  choices (from `treasure_room` and `magic_lesson`) now carry
  `"effect": { "goldDelta": 30 }`, matching the narrative's "stash of
  gold" line. The masterwork dagger stays flavor-only by deliberate
  scope choice — logged as a follow-up since granting it mechanically
  would need equipment displayed during the scenario phase, which is a
  separate feature.
- Added a real Healing Potion mechanic: `PartyBuilder.saveMember` now
  sets `maxHp` on created heroes (equal to class base HP); a new pure
  `useHealingPotion(party, memberId, healAmount = 3)` in
  `applyEffect.js` heals a living, non-full member and consumes one
  potion from their `equipment`; `PartyTracker` shows a "🧪 Heal" button
  per eligible member, wired through `ScenarioEngine`.
- Added a generic `choice.requiresClass` schema extension — a choice is
  hidden unless the party includes at least one member of that class.
  Applied to `magic_lesson`'s "Study the rune with Magic" choice so it
  never appears (and its "Your Wizard channels..." text is never shown)
  to a party without a Wizard.
- Documented `maxHp`, the Healing Potion mechanic, the corrected
  `goldDelta` behavior, and `requiresClass` in `CLAUDE.md`.
- Added 11 new unit tests (`applyEffect.test.js`) covering positive
  `goldDelta` distribution and `useHealingPotion`'s edge cases (heal,
  cap at `maxHp`, no-op when fallen, no-op without a potion, only
  affects the targeted member) — 22 tests total, all passing.
- Verified end-to-end with Playwright: the gold reward split correctly
  across a full 4-member party; a Wizard-less party never saw the magic
  choice; a hero hit by the trap drank her own potion, healed, and the
  Heal button correctly disappeared afterward.
- Completes the entire P5 backlog tier.

### PR #19 — Fix Equipment-Reroll Exploit and Stale-Session Crash
- `PartyBuilder`'s `DiceRoller.onRoll` handler now resets `equipment: []`
  whenever a hero's gold is rerolled, closing an exploit where a player
  could buy gear, reroll to a lower gold amount, and keep the equipment
  for free since it was never re-charged against the new roll.
- `App.jsx` now validates a restored session's `scenarioNodeId` against
  the current scenario's `nodes` map (new exported `isValidNodeId`
  helper) before trusting it, falling back to `scenario.startNode`
  instead of crashing on `node.text` when a returning visitor's saved
  node id no longer exists (the scenario graph has already changed once,
  in PR #10, so this was a real risk).
- Added `src/App.test.js` covering `isValidNodeId` against every real
  intro-scenario node id, a nonexistent id, and non-string/missing input.
- Fixes the first two items in the P5 backlog tier; the remaining P5
  items (positive `goldDelta` distribution, `treasure_found`'s cosmetic
  reward, unusable Healing Potion, and `magic_lesson`'s Wizard reference)
  are unchanged.

### PR #17 — Fantasy Storybook Visual Redesign
- Added Google Fonts **Cinzel** (headings) and **EB Garamond** (body text)
  via `index.html`, replacing the flat monospace/terminal look.
- Added `parchment-bg` (a soft radial-gradient parchment vignette),
  `fantasy-panel` (an ornate double-bordered "scroll" panel style), and
  `fantasy-divider`/`fantasy-divider-mark` (an ornamental rule with a
  centered mark) as custom Tailwind v4 `@utility` classes in
  `src/index.css`.
- Applied the new theme across `App.jsx` and every component
  (`PartyBuilder`, `ClassSelector`, `DiceRoller`, `EquipmentShop`,
  `PartyTracker`, `ScenarioEngine`): swapped `font-mono` for
  `font-serif`/`font-heading`, replaced plain borders with `fantasy-panel`,
  italicized secondary labels for a book-like feel, and added small themed
  touches (⚔️ Character Creation, 📜 The Adventure Unfolds, 🎲 Roll for
  Gold, ↺ Restart Tutorial, ⚜ The Fellowship).
- Updated the styling description in `CLAUDE.md` and `README.md` from
  "terminal/parchment" to "fantasy storybook."
- Verified with Playwright that the full playthrough, the dice-roll
  success/failure banners, and the party-wipe game-over screen all still
  render correctly and legibly under the new theme.

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
