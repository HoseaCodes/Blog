import React from 'react';
import { useSudokuContext } from './sudokucontext';

/**
 * React component for the Difficulty Selector.
 */
export const Difficulty = (props) => {
  let { difficulty } = useSudokuContext();

  return (
    <div className="sudoku-status__difficulty">
      <span className="sudoku-status__difficulty-text">Difficulty:&nbsp;&nbsp;</span>
      <select name="sudoku-status__difficulty-select" className="sudoku-status__difficulty-select" defaultValue={difficulty} onChange={props.onChange}>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
    </div>
  )
}
