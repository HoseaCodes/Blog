import React from 'react';
import { useSudokuContext } from './sudokucontext';

/**
 * React component for the Number Selector in the Status Section.
 */
export const Numbers = ({ onClickNumber }) => {
  let { numberSelected } = useSudokuContext();

  return (
    <div className="sudoku-status__numbers">
      {
        [1,2,3,4,5,6,7,8,9].map((number) => {
          if (numberSelected === number.toString()) {
            return (
              <div className="sudoku-status__number sudoku-status__number--selected" key={number} onClick={() => onClickNumber(number.toString())}>{number}</div>
            )
          } else {
            return (
              <div className="sudoku-status__number" key={number} onClick={() => onClickNumber(number.toString())}>{number}</div>
            )
          }
        })
      }
    </div>
  )
}
