# StudySprint: Active Spaced-Repetition & Vocabulary Recall Aid

An interactive, single-page learning workbench for mastering domain-specific vocabulary and technical terminology. Built using **Svelte 5** (runes) and **Vite**, featuring zero-friction keyboard navigation, real-time reactive telemetry, and persistent local storage.

---

## Project Overview & Core Architecture

StudySprint is an active-recall flashcard workbench built to eliminate interaction friction during intensive vocabulary and concept review. The platform pairs an interactive 3D spatial card canvas with an inline CRUD card management table, combining responsive design with deterministic state boundaries.

### Technical Highlights
- **Svelte 5 Runes Reactivity:** Powered entirely by `$state`, `$derived`, and `$props`. A modular domain class (`DeckManager`) encapsulates deck state, filter pipelines, cyclic navigation indices, and persistence logic without external store dependencies.
- **Full-Spectrum CRUD Support:**
  - **Create:** Fast-entry input strip with instant validation, categorization tagging, and `crypto.randomUUID()` generation.
  - **Read:** Bi-directional deck traversal, automated cyclic wrapping, dynamic category filtering (`ALL`, `LEARNING`, `REVIEWING`, `MASTERED`), and real-time deck telemetry.
  - **Update:** Dual-mode state updates via keyboard shortcuts (`1`, `2`, `3`) during practice and inline text editing in the manager table.
  - **Delete:** Immutable array filtering with index-boundary clamping to avoid out-of-bounds reads.
- **Keyboard-First Ergonomics:** Hardware-accelerated 3D flips (`preserve-3d`, `backface-visibility: hidden`), `Space` to flip, arrow keys to navigate, and input guards to avoid shortcut collisions while typing.
- **Quality Assurance:** Headless unit test suite with **Vitest**, executing 5 comprehensive test assertions across the entire CRUD lifecycle (`tests/deck.test.js`).
- **Production Deployment:** Built with Vite and deployed to edge infrastructure on **Vercel** (`https://study-sprint-wheat.vercel.app`).

---

## 1. Problem Identification
- **Problem Statement:** Students preparing for technical exams or learning domain vocabulary face high interaction friction in traditional tools (cluttered menus, delayed card generation, rigid review schedules).
- **Solution:** A lightweight, client-side workbench combining a 3D-perspective active recall flashcard interface with an instant CRUD card manager.

---

## 2. CRUD Operations & Requirements Mapping
| Operation | Implementation | UI Location |
| :--- | :--- | :--- |
| **Create** | `DeckManager.addCard(term, definition, tag)` | Card Manager: Top Fast-Entry Form |
| **Read** | `DeckManager.currentCard`, `filteredCards`, `flipCard()` | Practice Mode: 3D Flip Flashcard & Metrics |
| **Update** | `DeckManager.updateMastery(id, tier)`, `editCard(...)` | Practice Dock (1/2/3) & Manager Table Inline Edit |
| **Delete** | `DeckManager.deleteCard(id)` | Card Manager: Row Action Button |

---

## 3. Generative AI Experimentation & Reflection

### What Worked
- **Deterministic Test Generation:** Prompting the LLM to output a Vitest test matrix for core CRUD boundaries caught edge cases (array index clamping on deletion, empty filter pools) before UI wiring.
- **Micro-Interaction Boilerplate:** AI accelerated generating the CSS 3D perspective flip rules (`preserve-3d`, `backface-visibility: hidden`) and keyboard event listeners (`Space`, `1-3`, `ArrowRight`).

### What Failed
- **Outdated Syntax Hallucinations:** When prompted for reactive state, models frequently suggested Svelte 4 store patterns (`writable`, `$store`) rather than modern Svelte 5 runes (`$state`, `$derived`), requiring manual refactoring.
- **Build Tool Configuration Drift:** Automated scaffolding prompts generated deprecated Rollup/Vite plugin flags, necessitating manual alignment with standard Vite presets.

### Protocol for Future Projects
1. **Human State Invariants:** Hand-craft the reactive data model and class methods before touching the UI.
2. **AI Boundary Testing:** Use GenAI to generate edge-case input suites rather than writing repetitive manual assertions.
3. **Official Docs First:** Always verify cutting-edge framework syntax against official documentation rather than unconstrained LLM output.

---

## 4. Local Setup & Testing

```bash
# Install dependencies
npm install

# Run Vitest CRUD test suite (5 passed)
npm run test

# Launch development server
npm run dev
