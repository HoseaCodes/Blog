import React from 'react';
import { Game } from './game';
import { SudokuProvider } from './sudokucontext';
import './sudoku.css';

export default function Sudoku({ gameStarted, isTimerRunning, soundEnabled, musicEnabled, mistakesMode, fastMode, difficulty, onScoreUpdate, onGameComplete }) {
  return (
    <SudokuProvider>
      <Game 
        gameStarted={gameStarted}
        isTimerRunning={isTimerRunning}
        soundEnabled={soundEnabled}
        musicEnabled={musicEnabled}
        mistakesMode={mistakesMode}
        fastMode={fastMode}
        difficulty={difficulty}
        onScoreUpdate={onScoreUpdate}
        onGameComplete={onGameComplete}
      />
    </SudokuProvider>
  )
}
