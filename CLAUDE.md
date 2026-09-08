# Four Against Darkness - Web Tutorial System

## 🎯 Overview & Purpose
This project is a lightweight, purely client-side web application designed to act as an interactive tutorial for the solo and co-op tabletop role-playing game **Four Against Darkness**. 

The primary goal of this application is to lower the barrier to entry for new players by digitally guiding them through:
1. **Character Creation:** Assembling a party of four, selecting classes, rolling starting gold, and purchasing initial equipment without needing to flip through the rulebook.
2. **Tutorial Scenarios:** Running through introductory "Choose Your Own Adventure" style encounters that teach the core mechanics (combat, traps, fleeing, magic) step-by-step.

It is designed for **personal use** and built to run entirely in the browser without a backend database. This allows for simple, free deployment to static hosting services like **GitHub Pages**.

## 🛠 Tech Stack
* **Frontend Framework:** React (Handles the complex state management of a four-character party).
* **Build Tool:** Vite (For fast, modern frontend tooling and easy static exporting).
* **Styling:** Tailwind CSS (For rapid UI development with a clean, terminal/parchment aesthetic).
* **Data Storage:** Local component state for active sessions; static JSON or Markdown files for scenario data.

## 🏗 Core Architecture

### 1. Global State Management
The application tracks two primary state objects:
* **Party State:** Tracks the 4 party members, their HP, classes, gold, and inventory.
* **Scenario State:** Tracks the current phase of the application (e.g., `character_creation` vs `scenario_runner`) and the active node in the story.

### 2. Application Phases
* **Phase 1: Character Creation Wizard:** A step-by-step UI to build the roster. Features a 4-slot party overview, an active editor for assigning classes (Warrior, Cleric, Rogue, Wizard, Elf, Dwarf, Halfling, Barbarian), a dice roller for starting wealth, and an interactive equipment shop.
* **Phase 2: Scenario Engine:** A narrative viewport that presents a situation (e.g., "Two goblins block the door"), contextual action buttons, and a persistent party tracker to manage HP and resources during the encounter.

## 🗂 Data Structures

### Party State Example
```json
{
  "party": [
    {
      "id": 1,
      "name": "Thorin",
      "class": "Dwarf",
      "level": 1,
      "hp": 6,
      "gold": 12,
      "equipment": ["Hand Weapon", "Shield"]
    }
  ]
}
```

### Scenario Node Example
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

## 🚀 Current Status & Next Steps
* **Current Focus:** Building out the `PartyBuilder` React components, specifically the logic for assigning classes, tracking starting gold, and implementing the `EquipmentShop`.
* **Next Milestone:** Drafting the introductory scenario JSON to feed into the Scenario Engine state machine.
