import React from 'react';
import { useSudokuContext } from './sudokucontext';

/**
 * React component for the Header Section.
 */
export const Header = (props) => {
  const { lives } = useSudokuContext();

  return (
    <header className="sudoku-header">
      <div className="sudoku-header__left">
        <h1>
          Su<span className="sudoku-header__group-one">do</span><span className="sudoku-header__group-two">ku</span>
        </h1>
        <div className="sudoku-header__lives">
          <span className="sudoku-header__livesLabel">Lives:</span>
          <span className="sudoku-header__hearts">
            {Array.from({ length: 3 }, (_, index) => (
              <span key={index} className={index < lives ? 'sudoku-header-heart sudoku-header-heart--full' : 'sudoku-header-heart sudoku-header-heart--empty'}>
                ❤️
              </span>
            ))}
          </span>
        </div>
      </div>
      <h2 onClick={props.onClick}>
        New Game
      </h2>
    </header>
  )
}
