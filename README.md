# Four Against Darkness — Web Tutorial System

A lightweight, purely client-side web app that acts as an interactive
companion to the solo/co-op tabletop RPG **Four Against Darkness**. It
walks a new player through building a party of four and running an
introductory "Choose Your Own Adventure" style scenario alongside the
rulebook, making the core mechanics easier to pick up — not replacing the
rulebook or the game it accompanies.

Built for personal use, runs entirely in the browser (no backend/database),
and deploys as a static site (e.g. GitHub Pages).

## Tech Stack
- **React** — UI and party/scenario state management
- **Vite 8** — dev server and static build/export
- **Tailwind CSS 4** — terminal/parchment styling, via `@tailwindcss/vite`
- **Static JSON/Markdown** — scenario content, no backend database

## Status
The full tutorial loop is complete end-to-end and deployable: the Character
Creation Wizard (`PartyBuilder`, class selection, starting-gold roller,
`EquipmentShop`), the Scenario Engine (`ScenarioEngine`, `PartyTracker`, and
an introductory tutorial scenario covering combat, traps, fleeing, and
magic, now with a fork, a flee-and-retry loop, and a fallen-party game-over
state), a terminal/parchment visual theme, a GitHub Pages deploy workflow,
`localStorage` session persistence across reloads, and real d6 dice-roll
resolution for the combat choice. Unit tests (Vitest) cover the pure logic
modules and gate CI on every PR. The toolchain is fully current (Vite 8,
Tailwind 4, `npm audit` clean) and every item in the original P0–P4
backlog is done — see `backlog.md`'s "Unscheduled / Ideas" for what's
next, and `CHANGELOG.md` for a per-PR history.

## Getting Started
```bash
npm install
npm run dev      # start the Vite dev server
npm run build    # produce a static production build
npm test         # run the Vitest unit tests
```

## Project Structure
```
src/
  components/   # PartyBuilder, ClassSelector, EquipmentShop, PartyTracker
  engine/       # Scenario state machine
  data/         # Scenario node JSON
```

## Contributing / Development Workflow
Development follows `CLAUDE.md`:
- Work is tracked and prioritized in `backlog.md`.
- All changes land via pull request — no direct pushes to `main`.
- New feature ideas, edge cases, or non-critical bugs found along the way are
  logged in `backlog.md` rather than built ad hoc.
- Each merged PR gets an entry in `CHANGELOG.md`.
- **Stacking PRs:** if a PR's base is another not-yet-merged PR's branch
  rather than `main`, merging it only updates that base branch — it does
  *not* reach `main` until the whole chain does. Either merge the stack
  strictly bottom-up (repointing each PR's base to `main` as the one below
  it lands), or land the final PR straight into `main` once every PR in
  the chain shows merged, and confirm with `git log main..<branch>` that
  the branch is actually ahead of `main` before assuming the work landed.
