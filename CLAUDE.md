# Poker Pot Calculator — Claude Code Build Instructions

## Goal

Build and publish a browser-based poker pot calculator to a public GitHub Pages URL that colleagues can access. The app lets users configure a poker game state and calculate pot-sized bets in both directions (raise amount ↔ pot %).

---

## Prerequisites (confirm before starting)

- `git` is installed and authenticated with GitHub (`gh auth status` or SSH key configured)
- `node` >= 18 and `npm` are installed
- The GitHub CLI (`gh`) is installed — used to create the repo
- Ask the user for:
  - Their GitHub username or org to create the repo under
  - Preferred repo name (default: `pot-calculator`)
  - Whether the repo should be public or private (GitHub Pages requires public for free accounts)

---

## Step 1 — Create the GitHub repo

```bash
gh repo create pot-calculator --public --description "Poker pot % calculator" --clone
cd pot-calculator
```

---

## Step 2 — Scaffold the project with Vite + React

```bash
npm create vite@latest . -- --template react
npm install
```

Install Tailwind CSS:

```bash
npm install -D tailwindcss @tailwindcss/vite
```

In `vite.config.js`, add the Tailwind plugin and set the base path for GitHub Pages:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/pot-calculator/',   // must match the repo name exactly
})
```

In `src/index.css`, replace contents with:
```css
@import "tailwindcss";
```

---

## Step 3 — Set up GitHub Pages deployment via GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then enable GitHub Pages in the repo settings:
```bash
gh api repos/:owner/:repo/pages -X POST -f source='{"branch":"gh-pages","path":"/"}' || true
# If that fails, the Actions workflow will create the Pages environment automatically on first push
```

---

## Step 4 — Build the application

Delete the Vite boilerplate (`src/App.jsx`, `src/App.css`, `public/vite.svg`, `src/assets/`).

### File structure to create

```
src/
├── main.jsx                  # unchanged from Vite scaffold (mounts App)
├── index.css                 # Tailwind import only
├── App.jsx                   # Root: holds all state, composes layout
├── logic/
│   ├── potCalc.js            # Pure calculation functions
│   ├── seatLabels.js         # Position label assignment (SB, BB, UTG, etc.)
│   └── defaults.js           # Default game state factory
└── components/
    ├── GameSetup.jsx          # Street selector, blinds, player count
    ├── PlayerEditor.jsx       # Per-player committed chips + fold toggle
    ├── PokerTable.jsx         # SVG overhead table visualization
    ├── Calculator.jsx         # Mode toggle + inputs/outputs
    └── FormulaBreakdown.jsx   # Step-by-step arithmetic display
```

---

## Step 5 — Implement `src/logic/potCalc.js`

All functions are pure (no side effects). Unit-test each against the worked examples below.

```js
/**
 * Given a raise-to amount, returns what % of pot it represents.
 *
 * Formula: (raiseToAmount - activeTableBet) / (totalPot + toCall)
 *
 * @param {number} raiseToAmount  - The total amount hero is raising to
 * @param {number} totalPot       - Sum of all chips in middle + all committed this street
 * @param {number} activeTableBet - Highest bet/raise on the table this street
 * @param {number} alreadyCommitted - Chips hero has already put in this street
 * @returns {number} percentage as a decimal, e.g. 0.875 for 87.5%
 */
export function findPercent(raiseToAmount, totalPot, activeTableBet, alreadyCommitted) {
  const toCall = activeTableBet - alreadyCommitted
  const denominator = totalPot + toCall
  if (denominator === 0) return 0
  return (raiseToAmount - activeTableBet) / denominator
}

/**
 * Given a target pot %, returns the raise-to amount.
 *
 * Formula: (targetPct × (totalPot + toCall)) + activeTableBet
 *
 * @param {number} targetPct      - Desired raise size as decimal, e.g. 0.5 for 50%
 * @param {number} totalPot       - Sum of all chips in middle + all committed this street
 * @param {number} activeTableBet - Highest bet/raise on the table this street
 * @param {number} alreadyCommitted - Chips hero has already put in this street
 * @returns {number} raise-to amount
 */
export function findRaiseTo(targetPct, totalPot, activeTableBet, alreadyCommitted) {
  const toCall = activeTableBet - alreadyCommitted
  return (targetPct * (totalPot + toCall)) + activeTableBet
}

/**
 * Returns a breakdown object for display in the UI.
 */
export function calcBreakdown(totalPot, activeTableBet, alreadyCommitted) {
  const toCall = activeTableBet - alreadyCommitted
  const potIfCalled = totalPot + toCall
  return { toCall, potIfCalled }
}
```

### Verification — test these exact examples before moving on

**Example A** (from spec — find raise_to):
- Pot = 10, Hero bets 5, Villain raises to 10
- Hero wants 50% pot raise
- `totalPot = 25`, `activeTableBet = 10`, `alreadyCommitted = 5`
- Expected: `findRaiseTo(0.5, 25, 10, 5) === 25` ✓

**Example B** (from spec — find percent):
- Pot = 10, Hero bets 5, Villain raises to 15
- Hero wants to raise to 50
- `totalPot = 30`, `activeTableBet = 15`, `alreadyCommitted = 5`
- Expected: `findPercent(50, 30, 15, 5) === 0.875` (87.5%) ✓

---

## Step 6 — Implement `src/logic/seatLabels.js`

Assigns positional labels (BTN, SB, BB, UTG, etc.) based on number of players and dealer position.

```js
const LABELS_BY_COUNT = {
  2:  ['BTN/SB', 'BB'],
  3:  ['BTN', 'SB', 'BB'],
  4:  ['BTN', 'SB', 'BB', 'UTG'],
  5:  ['BTN', 'SB', 'BB', 'UTG', 'CO'],
  6:  ['BTN', 'SB', 'BB', 'UTG', 'HJ', 'CO'],
  7:  ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'HJ', 'CO'],
  8:  ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'HJ', 'CO'],
  9:  ['BTN', 'SB', 'BB', 'UTG', 'UTG+1', 'UTG+2', 'MP', 'HJ', 'CO'],
}

export function getSeatLabels(numPlayers) {
  return LABELS_BY_COUNT[numPlayers] ?? LABELS_BY_COUNT[6]
}

export function getSBIndex(numPlayers) { return 1 }
export function getBBIndex(numPlayers) { return 2 % numPlayers }
```

---

## Step 7 — Implement `src/logic/defaults.js`

```js
import { getSeatLabels } from './seatLabels.js'

export function makeDefaultPlayers(numPlayers, smallBlind, bigBlind, street) {
  const labels = getSeatLabels(numPlayers)
  return labels.map((label, i) => ({
    id: i,
    label,
    committed: street === 'preflop'
      ? (i === 1 ? smallBlind : i === 2 ? bigBlind : 0)
      : 0,
    isHero: i === 0,   // BTN/hero by default
    isFolded: false,
  }))
}

export const DEFAULT_STATE = {
  street: 'preflop',
  smallBlind: 1,
  bigBlind: 2,
  numPlayers: 6,
  basePot: 0,
  heroIndex: 0,
}
```

---

## Step 8 — Implement `src/App.jsx`

Holds all game state with `useState`. Computes derived values inline (no separate store needed). Renders a two-column layout: left panel (GameSetup + PlayerEditor) and right panel (PokerTable on top, Calculator below).

Key derived values computed before render:
```js
const totalPot = basePot + players.reduce((sum, p) => sum + p.committed, 0)
const hero = players[heroIndex]
const activeTableBet = Math.max(...players.filter((p, i) => i !== heroIndex && !p.isFolded).map(p => p.committed), 0)
const alreadyCommitted = hero.committed
const toCall = activeTableBet - alreadyCommitted
const potIfCalled = totalPot + toCall
```

---

## Step 9 — Implement `src/components/PokerTable.jsx`

SVG overhead poker table. Key implementation notes:

- Outer felt: green ellipse, `rx=320 ry=180`, centered at `(350, 200)`, `viewBox="0 0 700 400"`
- Rail: slightly larger ellipse in brown/dark tone
- Seat positions: distribute N seats evenly around the ellipse using parametric coordinates:
  ```js
  const angle = (2 * Math.PI * i / numSeats) - Math.PI / 2  // start at top
  const x = 350 + 280 * Math.cos(angle)
  const y = 200 + 155 * Math.sin(angle)
  ```
- Each seat renders: circle background (highlight hero in gold, folded in grey), label text, committed chip amount below
- Pot total centered on table
- Dealer button (small white circle with "D") shown next to BTN seat
- Active bet: show a small chip-stack icon or ring around that player

---

## Step 10 — Implement `src/components/Calculator.jsx`

Two-tab interface:

**Tab A — "What % is this raise?"**
- Number input: "Raise to" amount
- Displays: calculated %, and full breakdown (toCall, potIfCalled, formula)
- Real-time as user types

**Tab B — "What's X% of pot?"**
- Quick buttons: 25% / 33% / 50% / 67% / 75% / 100%
- Or type a custom %
- Displays: raise-to amount, and full breakdown
- Real-time

Both tabs show a "Formula Breakdown" section (collapsible) with labeled steps.

---

## Step 11 — Implement `src/components/FormulaBreakdown.jsx`

Renders the step-by-step arithmetic. Example output for "find raise_to at 50%":

```
Total pot:           25
Hero needs to call:   5
Pot if hero calls:   30
× 50%:               15
+ standing bet:      10
─────────────────────
Raise to:            25
```

Use a monospace font and right-align the numbers for readability.

---

## Step 12 — Deploy

```bash
git add .
git commit -m "Initial implementation of poker pot calculator"
git push origin main
```

GitHub Actions will automatically build and deploy to:
`https://<your-github-username>.github.io/pot-calculator/`

The Actions tab in GitHub will show build progress. First deploy typically takes ~2 minutes.

---

## Edge Cases to Handle

| Scenario | Handling |
|---|---|
| Hero is first to act (no standing bet) | `activeTableBet = 0`, `toCall = 0`, formula = pure % of pot |
| Preflop, hero is BB facing no raise | `alreadyCommitted = bigBlind`, `toCall = 0` |
| Preflop, hero is SB | `alreadyCommitted = smallBlind`, `toCall = bigBlind - smallBlind` |
| Raise-to < active bet | Show validation error: "Must be more than the current bet" |
| Only 2 players active | Works normally; ignore folded players in `activeTableBet` calc |
| All players check (post-flop) | `activeTableBet = 0`, calculator shows pure pot % |

---

## Definition of Done

- [ ] `findPercent` and `findRaiseTo` pass both worked examples from the spec
- [ ] Calculator correctly handles preflop SB/BB edge cases
- [ ] Poker table SVG renders with correct seat count and shows pot total
- [ ] App is live at the GitHub Pages URL
- [ ] Colleagues can open the URL and calculate pot bets without any login or setup
