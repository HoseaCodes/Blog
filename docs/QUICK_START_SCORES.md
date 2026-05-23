# Quick Start: Score Tracking Setup

## Step 1: Wrap Your App with GameScoreProvider

Find your main App.js file and add the GameScoreProvider:

```javascript
// src/App.js
import React from 'react';
import { GameScoreProvider } from './Context/GameScoreContext';
// ... other imports

function App() {
  return (
    <GameScoreProvider>
      {/* All your existing app content */}
      <YourRoutes />
      <YourComponents />
    </GameScoreProvider>
  );
}

export default App;
```

## Step 2: Update Your Game Components

For each game (Sudoku, Scroll, Race, Frogger, FoodFall), add these props:

```javascript
const YourGame = ({ onScoreUpdate, onGameComplete, onTimerUpdate }) => {
  const [score, setScore] = useState(0);

  // When score changes:
  const updateScore = (newPoints) => {
    const newScore = score + newPoints;
    setScore(newScore);
    onScoreUpdate?.(newScore); // Update parent
  };

  // When game ends:
  const endGame = () => {
    onGameComplete?.(score); // Save final score
  };

  return (
    // Your game JSX
  );
};
```

## Step 3: Add HighScores Page (Optional)

Create a route to display the leaderboard:

```javascript
import HighScores from './Components/HighScores/HighScores';

// In your router:
<Route path="/leaderboard" element={<HighScores />} />
```

## That's it!

The system will automatically:
- Track scores for each game
- Maintain high scores across sessions
- Calculate statistics (average, plays, best time)
- Display leaderboards
- Persist everything in localStorage

## Quick Test

1. Start any game
2. Play and get a score
3. Complete the game
4. Check the game stats panel (right side)
5. Visit the leaderboard to see all-time high scores

## Scoring Example

```javascript
// In your game component:
const handlePointScore = () => {
  const newScore = score + 10;
  setScore(newScore);
  onScoreUpdate?.(newScore); // Real-time update
};

const handleGameWin = () => {
  onGameComplete?.(score); // Save to high scores
};
```
