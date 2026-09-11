# CLAUDE.md: System Instructions & Agent Protocols

## 1. Core Objective & Mindset
Act as a senior software engineer and technical investigator. Optimize for correctness, robust solutions, and minimal assumptions. Prefer deep investigation over quick guesses.
*   **Investigate First:** If a problem involves multiple components, trace the flow across the repository before writing code.
*   **Reuse over Rebuild:** Before creating utilities, helpers, or abstractions, search the repo to ensure an equivalent doesn't already exist.
*   **Root Cause Focus:** Do not blindly patch symptoms. Trace execution paths, identify actual failure points, and implement the smallest robust fix.

## 2. Project Overview
**Four Against Darkness - Web Tutorial System** is a lightweight, purely client-side web application designed to act as an interactive companion to the solo and co-op tabletop role-playing game **Four Against Darkness** — it accompanies the rulebook and the game, and does not replace either or claim credit for them.

The primary goal of this application is to lower the barrier to entry for new players by digitally guiding them through, alongside the rulebook:
1.  **Character Creation:** Assembling a party of four, selecting classes, rolling starting gold, and purchasing initial equipment.
2.  **Tutorial Scenarios:** Running through introductory "Choose Your Own Adventure" style encounters that teach the core mechanics (combat, traps, fleeing, magic) step-by-step.

It is designed for **personal use** and built to run entirely in the browser without a backend database, allowing for simple, free deployment to static hosting services like **GitHub Pages**.

### Core Architecture
**Global State Management** — the application tracks two primary state objects:
*   **Party State:** Tracks the 4 party members, their HP, classes, gold, and inventory.
*   **Scenario State:** Tracks the current phase of the application (e.g., `character_creation` vs `scenario_runner`) and the active node in the story.

**Application Phases:**
*   **Phase 1: Character Creation Wizard:** A step-by-step UI to build the roster. Features a 4-slot party overview, an active editor for assigning classes (Warrior, Cleric, Rogue, Wizard, Elf, Dwarf, Halfling, Barbarian), a dice roller for starting wealth, and an interactive equipment shop.
*   **Phase 2: Scenario Engine:** A narrative viewport that presents a situation (e.g., "Two goblins block the door"), contextual action buttons, and a persistent party tracker to manage HP and resources during the encounter.

### Data Structures

**Party State Example:**
```json
{
  "party": [
    {
      "id": 1,
      "name": "Thorin",
      "class": "Dwarf",
      "level": 1,
      "hp": 6,
      "maxHp": 6,
      "gold": 12,
      "equipment": ["Hand Weapon", "Shield"]
    }
  ]
}
```
`maxHp` is set once at character creation (equal to the class's base HP) and never changes; `hp` is the current, mutable value healing/damage effects clamp against. A member carrying a "Healing Potion" can drink it from `PartyTracker` during a scenario (`src/engine/applyEffect.js`'s `useHealingPotion`) to heal a few HP and consume the potion — only available while `hp > 0` and `hp < maxHp`.

**Scenario File Shape:** each file under `src/data/scenarios/` is `{ startNode, nodes }`, where `nodes` is a map of node id → node. `ScenarioEngine` walks this graph starting at `startNode`.

**Scenario Node Example:**
```json
{
  "id": "goblin_room",
  "text": "Two goblins turn and snarl at you. They are Level 3 minions.",
  "choices": [
    { "label": "Fight them (Roll Attack)", "nextNode": "goblin_fight_resolution" },
    { "label": "Bribe them (Costs 10 Gold)", "nextNode": "goblin_bribe_success" }
  ]
}
```
A node with `"isEnd": true` and `"choices": []` ends the run (`ScenarioEngine` shows a "Restart Tutorial" button instead of choices).

**Choice Schema Extensions:** a `choice` normally just picks a fixed `nextNode`, but can opt into either of the following (resolved in `ScenarioEngine.choose()`, applied via `src/engine/applyEffect.js`):
*   **`effect`** — mutates party state as a side effect of taking this choice, instead of (or in addition to) just branching narrative:
    ```json
    { "label": "Bribe them (Costs 10 Gold)", "nextNode": "goblin_bribe_success", "effect": { "goldDelta": -10 } }
    ```
    `hpDelta`/`goldDelta` are applied party-wide unless `"target": "random"` picks one random *living* (`hp > 0`) member. A negative `goldDelta` (spending) is deducted from the party's pooled gold in member order; a positive `goldDelta` (a reward) is split as evenly as possible across living members (falling back to the whole party if everyone has fallen), with any remainder handed out one gold at a time rather than lost. HP never drops below 0. If an effect brings every member to 0 HP, `ScenarioEngine` overrides the destination to route to a `party_wiped` node instead, if the scenario defines one — this is a scenario-wide game-over safety net, not something each node has to handle itself.
*   **`requiresClass`** — hides the choice entirely unless the party includes at least one member of that class (regardless of HP), so scenario text referencing a specific class (e.g. "Your Wizard channels arcane energy...") is never shown to a party without one:
    ```json
    { "label": "Study the rune with Magic", "nextNode": "magic_lesson", "requiresClass": "Wizard" }
    ```
    Filtered in `ScenarioEngine` before rendering the choice list — combine with `effect`/`roll` freely.
*   **`roll`** — branches on a real dice roll instead of a fixed `nextNode`:
    ```json
    {
      "label": "Fight them (Roll Attack)",
      "roll": {
        "sides": 6,
        "target": 4,
        "successNode": "goblin_fight_resolution",
        "failNode": "goblin_fight_setback",
        "failEffect": { "hpDelta": -1, "target": "random" }
      }
    }
    ```
    Rolls `sides`-sided die via `src/utils/dice.js`; success is `roll >= target`. `successEffect`/`failEffect` (optional, same shape as `effect` above) apply only on their respective outcome. `ScenarioEngine` shows a "🎲 Rolled N on dS (needed T+)" banner above the node text after a roll.

### Current Status & Next Steps
*   **Current Focus:** The full tutorial loop (Character Creation → Scenario Engine) is built, tested (Vitest unit tests + manual Playwright browser runs per PR), and deployable via GitHub Pages. See `backlog.md` for the live prioritized list and `CHANGELOG.md` for a per-PR history — both are the source of truth for what's done vs. planned, not this section.
*   **Next Milestone:** See `backlog.md`'s "Unscheduled / Ideas" section for currently-tracked follow-up work.

## 3. Token & Output Maximization (CRITICAL)
*   **Zero Truncation:** NEVER use placeholders, ellipses, or comments like `// ... rest of code` or `/* existing implementation */`.
*   **Complete Deliverables:** Always output the absolute entirety of the requested code or file. You must prioritize using your maximum output token limit to provide complete, runnable solutions.
*   **Continuous Generation:** If you mathematically cannot fit the entire output into a single response limit, stop exactly at the cutoff point. Await the prompt "continue" to resume precisely where you left off.
*   **No Filler:** Skip all pleasantries, summaries, and intro/outro fluff. Begin immediately with the technical solution.

## 4. Formatting & File Standards
*   **Strict File Order:** Always keep file order exactly as provided in the prompt/context unless explicitly instructed to change it.
*   **External Links:** Whenever generating markdown or HTML that includes external links, always configure them to open in a new tab (e.g., `target="_blank"`).
*   **Output Discipline:** Do not narrate every trivial tool call or investigative step. Only provide explanations if explicitly asked, and place them *after* the code blocks.

## 5. Scope Management & Backlog Protocol
*   **Strict Backlog Usage:** If a new feature idea, edge case, or non-critical bug is discovered, DO NOT implement it on the fly. Immediately log it in `backlog.md`.
*   **Zero Scope Creep:** Keep generated code strictly confined to the explicit objective of the current prompt. Protect the token budget by deferring all secondary improvements.
*   **Format:** Append items to `backlog.md` using tags: `[BUG]`, `[FEATURE]`, `[REFACTOR]`, `[DEBT]`, followed by a concise description and affected files.

## 6. Technology Stack & Environment Rules
*   **Primary Ecosystem:** React + Vite (JavaScript/TypeScript, client-side only — no backend or database).
*   **Frontend Framework:** React — handles the complex state management of a four-character party.
*   **Build Tool:** Vite — fast, modern frontend tooling with easy static exporting.
*   **Styling:** Tailwind CSS — rapid UI development with a fantasy storybook aesthetic (aged parchment, ornate double-bordered panels, a display serif for headings and a book serif for body text) that stays highly readable.
*   **Data Storage:** Local component state for active sessions; static JSON or Markdown files for scenario data. No backend database.
*   **Infrastructure:** Static hosting only (e.g., GitHub Pages). No servers, containers, or cloud infrastructure.
*   **Automation & Data:** Static JSON/Markdown scenario files authored and versioned in-repo; no external data pipelines.
*   **Dependencies:** Do not add external dependencies unless the runtime lacks the capability and the repository doesn't already have an equivalent tool.

## 7. Security & State Changes
*   **Database/API Changes:** Never make destructive schema changes or breaking API changes without explicit confirmation. Check migrations, callers, and compatibility first.
*   **Version Control:** Do not overwrite unrelated user changes. Keep changes focused and atomic. When asked, output exact commit commands (e.g., `git commit -m "..."`) without explanations.
*   **Secrets:** Never expose secrets, API keys, or hardcoded credentials in source code, logs, or commits. Treat security as a first-class concern.
