import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Header } from './header';
import { GameSection } from './gamesection';
import { StatusSection } from './statussection';
import { Footer } from './footer';
import { getUniqueSudoku } from './uniquesudoku';
import { useSudokuContext } from './sudokucontext';

/**
 * Game is the main React component.
 */
export const Game = ({ gameStarted, isTimerRunning, soundEnabled, musicEnabled, mistakesMode, fastMode, difficulty, onScoreUpdate, onGameComplete }) => {
  /**
   * All the variables for holding state:
   * gameArray: Holds the current state of the game.
   * initArray: Holds the initial state of the game.
   * solvedArray: Holds the solved position of the game.
   * difficulty: Difficulty level - 'Easy', 'Medium' or 'Hard'
   * numberSelected: The Number selected in the Status section.
   * timeGameStarted: Time the current game was started.
   * mistakesMode: Is Mistakes allowed or not?
   * fastMode: Is Fast Mode enabled?
   * cellSelected: If a game cell is selected by the user, holds the index.
   * history: history of the current game, for 'Undo' purposes.
   * overlay: Is the 'Game Solved' overlay enabled?
   * won: Is the game 'won'?
   */
  let { numberSelected, setNumberSelected,
        gameArray, setGameArray,
        setDifficulty,
        setTimeGameStarted,
        setFastMode,
        cellSelected, setCellSelected,
        initArray, setInitArray,
        setWon,
        won,
        setLives, 
        setMistakes,
        lives,
        mistakes } = useSudokuContext();
  let [ mistakesModeState, setMistakesModeState ] = useState(false);
  let [ history, setHistory ] = useState([]);
  let [ solvedArray, setSolvedArray ] = useState([]);
  let [ overlay, setOverlay ] = useState(false);

  // Start game when gameStarted prop is true
  useEffect(() => {
    if (gameStarted && !overlay) {
      _createNewGame(null);
      setTimeGameStarted(moment());
    }
  }, [gameStarted]);

  // Calculate and report score when game is won
  useEffect(() => {
    if (overlay && onScoreUpdate) {
      // Calculate score based on difficulty, lives remaining, and time
      let difficultyMultiplier = 1;
      switch (difficulty) {
        case 'Easy':
          difficultyMultiplier = 100;
          break;
        case 'Medium':
          difficultyMultiplier = 300;
          break;
        case 'Hard':
          difficultyMultiplier = 500;
          break;
        case 'Expert':
          difficultyMultiplier = 750;
          break;
        default:
          difficultyMultiplier = 100;
      }
      
      // Bonus for remaining lives
      let lifeBonus = lives * 50;
      let score = difficultyMultiplier + lifeBonus;
      
      onScoreUpdate(score);
      
      if (onGameComplete) {
        onGameComplete(score);
      }
    }
  }, [overlay]);

  // Sync mistakesMode and fastMode from props
  useEffect(() => {
    if (mistakesMode !== undefined) {
      setMistakesModeState(mistakesMode);
    }
  }, [mistakesMode]);

  useEffect(() => {
    if (fastMode !== undefined) {
      setFastMode(fastMode);
    }
  }, [fastMode]);

  useEffect(() => {
    if (difficulty !== undefined) {
      setDifficulty(difficulty);
    }
  }, [difficulty]);

  /**
   * Creates a new game and initializes the state variables.
   */
  function _createNewGame(e) {
    let [ temporaryInitArray, temporarySolvedArray ] = getUniqueSudoku(difficulty, e);

    setInitArray(temporaryInitArray);
    setGameArray(temporaryInitArray);
    setSolvedArray(temporarySolvedArray);
    setNumberSelected('0');
    setTimeGameStarted(moment());
    setCellSelected(-1);
    setHistory([]);
    setWon(false);
    setLives(3);
    setMistakes(0);
  }

  /**
   * Checks if the game is solved.
   */
  function _isSolved(index, value) {
    if (gameArray.every((cell, cellIndex) => {
          if (cellIndex === index)
            return value === solvedArray[cellIndex];
          else
            return cell === solvedArray[cellIndex];
        })) {
      return true;
    }
    return false;
  }

  /**
   * Fills the cell with the given 'value'
   * Used to Fill / Erase as required.
   */
  function _fillCell(index, value) {
    if (initArray[index] === '0') {
      // Direct copy results in interesting set of problems, investigate more!
      let tempArray = gameArray.slice();
      let tempHistory = history.slice();

      // Can't use tempArray here, due to Side effect below!!
      tempHistory.push(gameArray.slice());
      setHistory(tempHistory);

      tempArray[index] = value;
      setGameArray(tempArray);

      if (_isSolved(index, value)) {
        setOverlay(true);
        setWon(true);
      }
    }
  }

  /**
   * A 'user fill' will be passed on to the
   * _fillCell function above.
   */
  function _userFillCell(index, value) {
    if (mistakesMode) {
      if (value === solvedArray[index]) {
        _fillCell(index, value);
      }
      else {
        // Mistake made - deduct a life
        if (value !== '0') {
          setMistakes(mistakes + 1);
          const newLives = Math.max(0, lives - 1);
          setLives(newLives);
          
          // End game if no lives left
          if (newLives === 0) {
            setOverlay(true);
            setWon(false);
          }
        }
      }
    } else {
      _fillCell(index, value);
    }
  }

  /**
   * On Click of 'New Game' link,
   * create a new game.
   */
  function onClickNewGame() {
    _createNewGame();
  }

  /**
   * On Click of a Game cell.
   */
  function onClickCell(indexOfArray) {
    if (fastMode && numberSelected !== '0') {
      _userFillCell(indexOfArray, numberSelected);
    }
    setCellSelected(indexOfArray);
  }

  /**
   * On Change Difficulty,
   * 1. Update 'Difficulty' level
   * 2. Create New Game
   */
  function onChangeDifficulty(e) {
    const newDifficulty = e.target.value;
    setDifficulty(newDifficulty);
    // Create new game with the updated difficulty
    setTimeout(() => {
      let [ temporaryInitArray, temporarySolvedArray ] = getUniqueSudoku(newDifficulty, null);
      setInitArray(temporaryInitArray);
      setGameArray(temporaryInitArray);
      setSolvedArray(temporarySolvedArray);
      setNumberSelected('0');
      setTimeGameStarted(moment());
      setCellSelected(-1);
      setHistory([]);
      setWon(false);
      setLives(3);
      setMistakes(0);
    }, 0);
  }

  /**
   * On Click of Number in Status section,
   * either fill cell or set the number.
   */
  function onClickNumber(number) {
    if (fastMode) {
      setNumberSelected(number)
    } else if (cellSelected !== -1) {
      _userFillCell(cellSelected,number);
    }
  }

  /**
   * On Click Undo,
   * try to Undo the latest change.
   */
  function onClickUndo() {
    if(history.length) {
      let tempHistory = history.slice();
      let tempArray = tempHistory.pop();
      setHistory(tempHistory);
      if (tempArray !== undefined)
        setGameArray(tempArray);
    }
  }

  /**
   * On Click Erase,
   * try to delete the cell.
   */
  function onClickErase() {
    if(cellSelected !== -1 && gameArray[cellSelected] !== '0') {
      _fillCell(cellSelected, '0');
    }
  }

  /**
   * On Click Hint,
   * fill the selected cell if its empty or wrong number is filled.
   */
  function onClickHint() {
    if (cellSelected !== -1) {
      _fillCell(cellSelected, solvedArray[cellSelected]);
    }
  }

  /**
   * Toggle Mistakes Mode
   */
  function  onClickMistakesMode() {
    setMistakesMode(!mistakesMode);
  }

  /**
   * Toggle Fast Mode
   */
  function onClickFastMode() {
    if (fastMode) {
      setNumberSelected('0');
    }
    setCellSelected(-1);
    setFastMode(!fastMode);
  }

  /**
   * Close the overlay on Click.
   */
  function onClickOverlay() {
    setOverlay(false);
    _createNewGame();
  }

  /**
   * On load, create a New Game.
   */
  useEffect(() => {
    _createNewGame();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className={overlay?"sudoku-container sudoku-blur":"sudoku-container"}>
        <Header clickNew={onClickNewGame}/>
        <div className="sudoku-innercontainer">
          <GameSection
            onClick={(indexOfArray) => onClickCell(indexOfArray)}
          />
          <StatusSection
            onClickNumber={(number) => onClickNumber(number)}
            onChange={(e) => onChangeDifficulty(e)}
            onClickUndo={onClickUndo}
            onClickErase={onClickErase}
            onClickHint={onClickHint}
            onClickMistakesMode={onClickMistakesMode}
            onClickFastMode={onClickFastMode}
          />
        </div>
      </div>
      <div className= { overlay
                        ? "sudoku-overlay sudoku-overlay--visible"
                        : "sudoku-overlay"
                      }
           onClick={onClickOverlay}
      >
        {won ? (
          <h2 className="sudoku-overlay__text">
            You <span className="sudoku-overlay__textspan1">solved</span> <span className="sudoku-overlay__textspan2">it!</span>
          </h2>
        ) : (
          <h2 className="sudoku-overlay__text sudoku-overlay__text--gameover">
            Game <span className="sudoku-overlay__textspan1">Over!</span>
          </h2>
        )}
      </div>
    </>
  );
}
