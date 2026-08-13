# Games and score tracking

How the Game Zone is wired: the score context, the contract each game implements, and how scores become points.

The product concept — what the Game Zone is for and what is planned — is in [FEATURES.md](FEATURES.md#game-zone).

- [Quick start](#quick-start)
- [The pieces](#the-pieces)
- [The game component contract](#the-game-component-contract)
- [The `useGameScore` API](#the-usegamescore-api)
- [Scoring guidelines](#scoring-guidelines)
- [Points: local and server](#points-local-and-server)
- [Worked example: Frogger](#worked-example-frogger)
- [Testing an integration](#testing-an-integration)
- [Troubleshooting](#troubleshooting)

---

## Quick start

Adding score tracking to a game is three steps, and the first is already done.

### Step 1 — Wrap the app in `GameScoreProvider`

```jsx
// src/App.js
import { GameScoreProvider } from "./Context/GameScoreContext";

<GameScoreProvider>
  {/* routes and components */}
</GameScoreProvider>
```

Already in place at `src/App.js:297`. **Nothing to do** — this step appears here only because older guides open with it.

### Step 2 — Accept the score props in your game

```jsx
const YourGame = ({ onScoreUpdate, onGameComplete }) => {
  const [score, setScore] = useState(0);

  const updateScore = (points) => {
    const next = score + points;
    setScore(next);
    onScoreUpdate?.(next);      // real-time display
  };

  const endGame = () => onGameComplete?.(score);   // persists the score
};
```

That is the whole contract. `Game.jsx` injects the props; you call them. Details in [the game component contract](#the-game-component-contract).

### Step 3 — Add a leaderboard route

```jsx
// src/App.js — React Router v5
import HighScores from "./Components/HighScores/HighScores";

<Route path="/leaderboard" exact={true} component={HighScores} />
```

> **No leaderboard route exists today.** `HighScores.jsx` is written but unreachable — nothing routes to it, so scores are recorded and never displayed outside the in-game stats panel.
>
> Note the syntax: this project is on **React Router v5** (`^5.2.0`), which uses `component={}` / `render={}`. Older guides show the v6 form `element={<HighScores />}`, which in v5 renders **nothing at all**, silently — a blank page with no error.

### That's it

With those in place the system handles the rest automatically:

- tracks the score for each game
- keeps high scores across sessions
- calculates stats — `totalPlays`, `averageScore`, `bestTime`, `lastPlayed`
- builds per-game and all-time leaderboards
- persists everything to `localStorage`, and syncs **points** to the server once signed in

**Quick test:** start a game → play to a score → finish it → check the stats panel → check the leaderboard.

---

## The pieces

| Piece | File | Role |
|---|---|---|
| `GameScoreProvider` | `src/Context/GameScoreContext.jsx` | Global score, high-score and points state |
| `useGameScore` | same | The hook every game or page consumes |
| `Game.jsx` | `src/Pages/GameStore/Game.jsx` | Host page — clones the game element with score props, runs the timer |
| `HighScores` | `src/Components/HighScores/HighScores.jsx` | Leaderboard — **written but not routed**, see [Quick start](#step-3--add-a-leaderboard-route) |
| `PointsHUD` | `src/Pages/GameStore/PointsHUD.jsx` | Live points display |
| Game components | `src/Components/Games/*` | 13 game components — **only 3 are listed**, see below |

The provider is **already mounted** — `src/App.js:297` wraps the app in `<GameScoreProvider>`. You do not need to add it.

### Built vs listed

**Thirteen game components exist on disk. Three are reachable.**

`src/Constants/games.js` is the catalogue the Game Store renders, and only three of its entries are active:

| Listed | Built but commented out of the catalogue |
|---|---|
| Sweet Crush · Pacman · Space Invaders | Frogger · Connect Four · Food Fall · Race · Scroll · Bird Shooter · Whac-A-Mole · Tic Tac Toe · Sudoku · Speed Test |

The commented-out entries are complete components with imports still at the top of the file — they were disabled, not abandoned. **Frogger is among them**, which is worth knowing given it is the worked example below: the code is correct and current, and you cannot currently reach it from the Game Store.

Re-listing a game is uncommenting its object in `games.js`. Before you do, check it honours [the contract](#the-game-component-contract) — several of these predate it.

Score and leaderboard state persists to `localStorage` (`gameScores`, `highScores`, `totalScore`). Points are separate, and sync to the server — see below.

---

## The game component contract

`Game.jsx` clones the selected game element and injects the score props:

```jsx
<GameContainer>
  {currentGame && React.cloneElement(currentGame.link, {
    onScoreUpdate: handleScoreUpdate,
    onGameComplete: handleGameComplete,
    onTimerUpdate: setTimer,
  })}
</GameContainer>
```

So a game implements four props:

| Prop | Type | When to call it |
|---|---|---|
| `gameStarted` | `boolean` | Read it — start/stop and reset on transition |
| `onScoreUpdate(score)` | function | **Every time the score changes**, for the live display |
| `onGameComplete(finalScore)` | function | **Exactly once, when the game ends** — this is what saves the score |
| `soundEnabled` | `boolean` | Gate **every** sound effect on this |
| `musicEnabled` | `boolean` | Reserved. Frogger destructures it and never reads it — no game implements background music yet |

```jsx
const YourGame = ({ gameStarted, onScoreUpdate, onGameComplete, soundEnabled }) => {
  const [score, setScore] = useState(0);

  const award = (points) => {
    const next = score + points;
    setScore(next);
    onScoreUpdate?.(next);        // live update
  };

  const endGame = () => onGameComplete?.(score);   // persist — call exactly once
};
```

**The single most common integration bug is never calling `onGameComplete`.** The score displays correctly the whole way through and then vanishes, because nothing wrote it.

### Alternative: use the context directly

A game can bypass the props and write to the context itself:

```jsx
import { useGameScore } from '../../Context/GameScoreContext';

const { updateGameScore } = useGameScore();
updateGameScore(gameId, gameName, finalScore, timeInSeconds);
```

Prefer the props. They keep the game component ignorant of where scores go, which is what makes the games individually testable.

---

## The `useGameScore` API

```js
const {
  scores,                 // object: all game scores keyed by gameId
  totalScore,             // number: sum of high scores
  highScores,             // array: top scores across all games
  updateGameScore,        // (gameId, gameName, score, time)
  getGameStats,           // (gameId) => stats | null
  getGameLeaderboard,     // (gameId) => top 10 for that game
  getAllTimeHighScores,   // () => top 10 overall
  resetAllScores,
  resetGameScores,        // (gameId)
} = useGameScore();
```

A stats object:

```js
{
  gameName: string,
  highScore: number,
  totalPlays: number,
  averageScore: number,
  bestTime: number,        // seconds
  lastPlayed: string,      // ISO date
}
```

---

## Scoring guidelines

> **These are a proposed convention, not a description of the code.** They were drafted so scores would be comparable on a shared leaderboard. Several games predate them and do not follow them.

| Game | Proposed | Actually implemented |
|---|---|---|
| **Sudoku** | Correct cell 10 · row/column/box +50 · puzzle +500 · time bonus `max(0, 300 − seconds)` under 5 min | not verified |
| **Scroll** | 1 per distance unit · obstacle avoided 10 · power-up 25 | `score + 10` per event — broadly consistent |
| **Race** | Position multiplier `(racers − position + 1) × 100` · lap 50 · fast-lap bonus | not verified |
| **Frogger** | Reach goal 100 · level completion `level × 100` · remaining seconds × 2 | **`score + 1` per goal. No level concept exists in the component at all** |
| **FoodFall** | Food 10–50 by type · combo `consecutive × 1.5` · centre catch doubles | not verified |

**This is a real problem, not a documentation nit.** `highScores` is a single cross-game leaderboard, so a game awarding 1 per event and a game awarding 500 are ranked against each other directly. Frogger can never place. Either normalise the scales or make the leaderboard per-game — `getGameLeaderboard(gameId)` already exists and does the second thing.

---

## Points: local and server

Scores and **points** are different things. Scores are a leaderboard; points are the currency spent in the [store](API.md#points-and-store).

The context handles both modes:

- **Anonymous** — points accumulate in `localStorage` under the offline-points key, and spending is local.
- **Authenticated** — points live server-side through `PointsAPI`; balance, earn, spend and the transaction ledger all go to `/api/points/*`.
- **On first login**, a one-shot claim calls `pointsAPI.syncOfflinePoints(amount)` to migrate locally-earned points into the server account.

Server errors during sync are deliberately swallowed — the UI falls back to the local cache rather than losing the player's session. That means a failed sync is silent, so check `/api/points/balance` if points seem to disappear after login.

---

## Worked example: Frogger

Frogger is the reference implementation of the full contract.

**Lives.** Three hearts, rendered top-right — ❤️ for remaining, 🖤 for lost.

**Collision.** Hitting a vehicle plays a sound (if `soundEnabled`), removes a heart, and resets the frog to the start. Play continues while hearts remain.

**Scoring.** `score + 1` each time the frog reaches the goal, with `onScoreUpdate` called on each change. Score persists across goals until every heart is gone. Note this diverges from the [proposed convention](#scoring-guidelines) of 100 per goal.

**Game over.** At zero hearts an overlay renders — "Game Over!", the final score, a semi-transparent backdrop — and `onGameComplete(finalScore)` fires once. The game stops and cannot continue.

**Reset.** On `gameStarted` transitioning to true: hearts back to 3, score to 0, board cleared.

State: `hearts`, `gameOver`. Updated functions: `checkCollisions` (deducts hearts, triggers game over), `moveFrog` (calls `onScoreUpdate` on reaching the goal). Styled components: `HeartsDisplay`, `GameOverOverlay`, `GameOverText`, `FinalScoreText`.

The internal component name is `ClickLots`, not `Frogger` — a leftover that `games.js` aliases on import. Harmless, and confusing exactly once.

### Frogger acceptance checklist

The per-game checks, distinct from the [generic integration steps](#testing-an-integration):

- [ ] Start button begins play — `gameStarted` transitions and the board resets
- [ ] Hearts render correctly at start: **3 red ❤️, 0 black 🖤**
- [ ] A vehicle collision reduces hearts by exactly 1 and resets the frog to the start
- [ ] Play continues while hearts remain
- [ ] Reaching the goal increases the score and resets the frog
- [ ] Game over fires at 0 hearts — overlay renders, input stops, final score shown
- [ ] `onGameComplete` fires **exactly once** on game over, never on an intermediate death
- [ ] Sound effects respect `soundEnabled` — collision, movement and win sounds all mute
- [ ] Starting a new game resets hearts to 3 and score to 0
- [ ] The score reaches `Game.jsx` and updates the stats panel

Note the game is currently **not listed** in `games.js`, so reaching it means re-enabling its catalogue entry first.

---

## Testing an integration

1. Start the game from the Game Store.
2. Play and accumulate score — confirm the live display updates.
3. End the game deliberately (lose, or complete it).
4. Check that:
   - the final score is written, not just displayed
   - the stats panel updates (`totalPlays`, `averageScore`, `bestTime`)
   - the score appears in `HighScores` — *requires the [leaderboard route](#step-3--add-a-leaderboard-route), which does not exist yet; until it does, inspect `localStorage.highScores` instead*
   - it survives a page reload — that is the `localStorage` write
5. Sound respects `soundEnabled`; music respects `musicEnabled`.
6. Starting a new game resets cleanly rather than resuming.

None of this is covered by automated tests. A first unit test around `updateGameScore` — high-score replacement, average recalculation, leaderboard truncation — would be worth more than any of the manual steps above.

---

## Troubleshooting

**Score not saving.** `onGameComplete` is not being called, or is called with a stale score. Confirm the `gameId` matches between the games array and the component.

**Score resets mid-game.** The component is remounting — usually a `key` change or a parent re-render recreating the element.

**Timer not updating.** Either use `onTimerUpdate` to push game time to the parent, or let `Game.jsx` own timing. Doing both fights.

**Points wrong after login.** The offline-points claim runs once and swallows errors. Check `/api/points/balance` against the local cache.

**`localStorage` problems.** Check the quota, verify the stored shape matches what the provider expects, and test in a private window to rule out extensions.
