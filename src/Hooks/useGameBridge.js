import { useEffect, useRef } from 'react';

/**
 * useGameBridge — connects a self-contained game component to the
 * GameCorner framework (Game.jsx + GameScoreContext + PointsHUD).
 *
 * The framework injects four props into every game it renders:
 *   { onScoreUpdate, onGameComplete, gameStarted, isTimerRunning }
 *
 * Wiring those by hand is tedious and easy to get wrong. This hook
 * collapses the boilerplate to one call. Drop it into any game and
 * the side-panel score, timer, and earned points all "just work."
 *
 * --- Convention for new games ---
 *
 *   import useGameBridge from '../../../Hooks/useGameBridge';
 *
 *   const MyGame = ({
 *     onScoreUpdate,
 *     onGameComplete,
 *     gameStarted = true,
 *   } = {}) => {
 *     const [score, setScore] = useState(0);
 *     const [gameOver, setGameOver] = useState(false);
 *
 *     const resetGame = useCallback(() => {
 *       setScore(0);
 *       setGameOver(false);
 *       // ...reset your board, position, etc.
 *     }, []);
 *
 *     useGameBridge({
 *       score,
 *       gameStarted,
 *       onScoreUpdate,
 *       onReset: resetGame,
 *       isGameOver: gameOver,   // omit if game has no win/lose condition
 *       onGameComplete,
 *     });
 *
 *     return ...
 *   };
 *
 * Then add it to src/Constants/games.js with a unique id.
 *
 * --- What the hook does ---
 *
 *  1. Whenever `score` changes, calls `onScoreUpdate(score)` so the
 *     framework's side-panel SCORE matches the in-game value.
 *  2. When `gameStarted` transitions false → true (user clicked Start),
 *     calls `onReset()` so the game starts fresh.
 *  3. When `isGameOver` transitions false → true *while* the session
 *     is active, calls `onGameComplete(score)` exactly once. This
 *     awards points 1:1 with the final score.
 *
 * Games without a win/lose condition (e.g. Sweet Crush) just omit
 * `isGameOver` + `onGameComplete`; the user ends the session manually
 * via the framework's "End Game" button instead.
 */
export default function useGameBridge({
  score,
  gameStarted,
  onScoreUpdate,
  onReset,
  isGameOver,
  onGameComplete,
}) {
  // 1. Sync score upward whenever it changes.
  useEffect(() => {
    if (typeof onScoreUpdate === 'function') onScoreUpdate(score);
  }, [score, onScoreUpdate]);

  // 2. Reset on Start (false → true transition of gameStarted).
  const prevStartedRef = useRef(gameStarted);
  useEffect(() => {
    const prev = prevStartedRef.current;
    if (!prev && gameStarted && typeof onReset === 'function') {
      onReset();
    }
    prevStartedRef.current = gameStarted;
  }, [gameStarted, onReset]);

  // 3. Auto-fire onGameComplete on false → true transition of isGameOver,
  //    only while session is active. Idempotent within a session.
  const prevGameOverRef = useRef(isGameOver);
  useEffect(() => {
    const prev = prevGameOverRef.current;
    if (
      !prev &&
      isGameOver &&
      gameStarted &&
      typeof onGameComplete === 'function'
    ) {
      onGameComplete(score);
    }
    prevGameOverRef.current = isGameOver;
  }, [isGameOver, gameStarted, onGameComplete, score]);
}
