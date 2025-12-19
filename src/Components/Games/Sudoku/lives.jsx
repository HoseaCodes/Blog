import React from 'react';
import { useSudokuContext } from './sudokucontext';

/**
 * React component for displaying lives/hearts in the Status Section.
 */
export const Lives = () => {
  let { lives } = useSudokuContext();

  return (
    <div className="sudoku-status__lives">
      <span className="sudoku-status__livesLabel">Lives:</span>
      <span className="sudoku-status__hearts">
        {Array.from({ length: 3 }, (_, index) => (
          <span key={index} className={index < lives ? 'sudoku-heart sudoku-heart--full' : 'sudoku-heart sudoku-heart--empty'}>
            ❤️
          </span>
        ))}
      </span>
    </div>
  )
}
