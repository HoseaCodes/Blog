import React, { createContext, useContext, useState } from 'react';
import moment from 'moment';

const SudokuContext = createContext ({
  numberSelected: '0', setNumberSelected: () => { },
  gameArray: [], setGameArray: () => {},
  difficulty: 'Easy', setDifficulty: () => {},
  timeGameStarted: moment(), setTimeGameStarted: () => {},
  fastMode: false, setFastMode: () => {},
  cellSelected: -1, setCellSelected: () => {},
  initArray: [], setInitArray: () => {},
  won: false, setWon: () => {},
  lives: 3, setLives: () => {},
  mistakes: 0, setMistakes: () => {} });


export const SudokuProvider = ({ children }) => {
  let [ numberSelected, setNumberSelected ] = useState('0');
  let [ gameArray, setGameArray ] = useState([]);
  let [ difficulty,setDifficulty ] = useState('Easy');
  let [ timeGameStarted, setTimeGameStarted ] = useState(moment());
  let [ fastMode, setFastMode ] = useState(false);
  let [ cellSelected, setCellSelected ] = useState(-1);
  let [ initArray, setInitArray ] = useState([]);
  let [ won, setWon ] = useState(false);
  let [ lives, setLives ] = useState(3);
  let [ mistakes, setMistakes ] = useState(0);

  return (
    <SudokuContext.Provider value={
      {
        numberSelected, setNumberSelected,
        gameArray, setGameArray,
        difficulty,setDifficulty,
        timeGameStarted, setTimeGameStarted,
        fastMode, setFastMode,
        cellSelected, setCellSelected,
        initArray, setInitArray,
        won, setWon,
        lives, setLives,
        mistakes, setMistakes
      }
    }>
      {children}
    </SudokuContext.Provider>
  );
};

export const useSudokuContext = () => useContext(SudokuContext);
export default SudokuContext;