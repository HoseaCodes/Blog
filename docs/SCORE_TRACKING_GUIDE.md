# Game Score Tracking Integration Guide

This guide explains how to integrate the score tracking system with your individual game components (Sudoku, Scroll, Race, Frogger, FoodFall, etc.).

## Overview

The score tracking system consists of:
1. **GameScoreContext** - Global state management for all game scores
2. **Updated Game.jsx** - Main game page with score tracking integration
3. **HighScores Component** - Leaderboard display

## Setup

### 1. Wrap Your App with GameScoreProvider

In your `App.js` or main entry point, wrap your application with the `GameScoreProvider`:

```javascript
import { GameScoreProvider } from './Context/GameScoreContext';

function App() {
  return (
    <GameScoreProvider>
      {/* Your app content */}
    </GameScoreProvider>
  );
}
```

### 2. Integrate Score Tracking in Individual Game Components

Each game component needs to communicate its score back to the parent Game.jsx component.

#### Method 1: Props Passing (Recommended)

Update `Game.jsx` to pass score handlers as props to game components:

```javascript
// In Game.jsx GameContainer section:
<GameContainer>
  {currentGame && React.cloneElement(currentGame.link, {
    onScoreUpdate: handleScoreUpdate,
    onGameComplete: handleGameComplete,
    onTimerUpdate: setTimer,
  })}
</GameContainer>
```

#### Method 2: Use Context Directly in Game Components

Each game component can use the context directly:

```javascript
import { useGameScore } from '../../Context/GameScoreContext';

const YourGameComponent = () => {
  const { updateGameScore } = useGameScore();
  
  // When game completes:
  const handleGameEnd = () => {
    updateGameScore(gameId, gameName, finalScore, timeInSeconds);
  };
};
```

## Individual Game Integration Examples

### Example 1: Sudoku

```javascript
import React, { useState, useEffect } from 'react';

const Sudoku = ({ onScoreUpdate, onGameComplete, onTimerUpdate }) => {
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    // Update parent score whenever local score changes
    if (onScoreUpdate) {
      onScoreUpdate(score);
    }
  }, [score, onScoreUpdate]);

  const handleSolveCell = () => {
    // Award points for correct cell
    setScore(prev => prev + 10);
  };

  const handlePuzzleComplete = () => {
    setGameComplete(true);
    if (onGameComplete) {
      onGameComplete(score);
    }
  };

  // Rest of Sudoku logic...
};
```

### Example 2: Scroll/Race/Action Games

```javascript
const ScrollGame = ({ onScoreUpdate, onGameComplete, onTimerUpdate }) => {
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleCollectItem = (points) => {
    const newScore = score + points;
    setScore(newScore);
    if (onScoreUpdate) {
      onScoreUpdate(newScore);
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
    if (onGameComplete) {
      onGameComplete(score);
    }
  };

  // Game logic...
};
```

### Example 3: Frogger

```javascript
const Frogger = ({ onScoreUpdate, onGameComplete, onTimerUpdate }) => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  const handleReachGoal = () => {
    const levelBonus = level * 100;
    const newScore = score + levelBonus;
    setScore(newScore);
    
    if (onScoreUpdate) {
      onScoreUpdate(newScore);
    }
  };

  const handleDeath = () => {
    if (onGameComplete) {
      onGameComplete(score);
    }
  };

  // Game logic...
};
```

### Example 4: FoodFall

```javascript
const FoodFall = ({ onScoreUpdate, onGameComplete, onTimerUpdate }) => {
  const [score, setScore] = useState(0);
  const [missedItems, setMissedItems] = useState(0);

  const handleCatchFood = (foodValue) => {
    const newScore = score + foodValue;
    setScore(newScore);
    
    if (onScoreUpdate) {
      onScoreUpdate(newScore);
    }
  };

  const handleMissFood = () => {
    const newMissed = missedItems + 1;
    setMissedItems(newMissed);
    
    if (newMissed >= 3) {
      // Game over after 3 misses
      if (onGameComplete) {
        onGameComplete(score);
      }
    }
  };

  // Game logic...
};
```

## Score Calculation Guidelines

### Point Systems per Game Type:

**Sudoku:**
- Correct cell: 10 points
- Complete row/column/box: 50 bonus
- Complete puzzle: 500 bonus
- Time bonus: (max 300 - seconds) if under 5 minutes

**Scroll:**
- Distance traveled: 1 point per unit
- Obstacles avoided: 10 points each
- Power-ups collected: 25 points each

**Race:**
- Position multiplier: (total racers - position + 1) × 100
- Lap completion: 50 points per lap
- Time bonus for fast laps

**Frogger:**
- Reach goal: 100 points
- Level completion: level × 100 bonus
- Time remaining: remaining seconds × 2

**FoodFall:**
- Food caught: 10-50 points based on type
- Combo multiplier: consecutive catches × 1.5
- Perfect catch (center): double points

## Using the HighScores Component

Add the HighScores component to any page:

```javascript
import HighScores from './Components/HighScores/HighScores';

function LeaderboardPage() {
  return (
    <div>
      <h1>Game Leaderboard</h1>
      <HighScores />
    </div>
  );
}
```

Or add it to the game browser page to show across all games.

## Testing the Integration

1. Start a game
2. Play and accumulate score
3. Complete the game
4. Check that:
   - Score updates in real-time during gameplay
   - Final score is saved when game completes
   - High scores appear in the leaderboard
   - Stats are persisted in localStorage

## API Reference

### useGameScore Hook

```javascript
const {
  scores,              // Object: All game scores by gameId
  totalScore,          // Number: Sum of all high scores
  highScores,          // Array: Top 20 scores across all games
  updateGameScore,     // Function: (gameId, gameName, score, time)
  getGameStats,        // Function: (gameId) => stats object
  getGameLeaderboard,  // Function: (gameId) => top 10 for that game
  getAllTimeHighScores, // Function: () => top 10 across all games
  resetAllScores,      // Function: Clear all scores
  resetGameScores,     // Function: (gameId) => clear one game's scores
} = useGameScore();
```

### Game Stats Object Structure

```javascript
{
  gameName: string,
  highScore: number,
  totalPlays: number,
  averageScore: number,
  bestTime: number (seconds),
  lastPlayed: string (ISO date)
}
```

## Tips

1. **Always call onGameComplete** when the game ends to save the score
2. **Update score frequently** using onScoreUpdate for real-time display
3. **Time tracking** is automatic in Game.jsx but games can override
4. **Test localStorage** to ensure scores persist across sessions
5. **Handle edge cases** like incomplete games or user exits

## Troubleshooting

**Score not saving?**
- Ensure onGameComplete is called with the final score
- Check that GameScoreProvider wraps your app
- Verify gameId matches between games array and component

**Timer not updating?**
- Use onTimerUpdate prop to sync game time with parent
- Or let Game.jsx handle timing automatically

**LocalStorage issues?**
- Check browser localStorage isn't full
- Verify data format matches expected structure
- Test in incognito to rule out extensions
