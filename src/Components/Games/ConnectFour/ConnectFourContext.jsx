import React, { createContext, useState } from "react";

export const ConnectFourContext = createContext({});

export function ConnectFourContextProvider(props) {
  const [board, setBoard] = useState([]);
  const [playerTurn, setPlayerTurn] = useState(1);
  const [computerPlayer, setComputerPlayer] = useState(false);
  const [phase, setPhase] = useState("play");
  const [winner, setWinner] = useState(0);

  const [error, setError] = useState({});

  const handleComputerMove = () => {
    console.log("handlingcomputermove!");
    let newBoard = [...board];
    for (let i = 0; i < newBoard.length; i++) {
      for (let x = 0; x < newBoard[i].length; x++) {
        if (newBoard[i][x].available === true) {
          console.log("found free square");
          console.log(i, x);
          newBoard[i][x].selected = 2;
          newBoard[i][x].available = false;
          console.log(newBoard[i][x]);
          // setBoard(newBoard);
          let validatedBoard = checkForValidSquares(newBoard);
          setBoard(validatedBoard);
          return;
        }
      }
    }
  };

  const handleSetup = (computer) => {
    setComputerPlayer(computer);
    setPhase("play");
  };

  const resetGame = () => {
    setPhase("reset");
    makeBoard();
    setPhase("play");
  };

  const makeBoard = () => {
    let array = [];
    let subArray = [];
    for (let i = 0; i < 6; i++) {
      for (let x = 0; x < 8; x++) {
        let indexArray = [i, x];
        let index = Number(indexArray.join(""));
        subArray.push({
          indexArray: indexArray,
          index: index,
          selected: 0,
          available: index >= 50 ? true : false,
        });
      }
      array.push(subArray);
      subArray = [];
    }
    setBoard(array); // Abstract this out into separate file
  };

  const handlePickSquare = (numOne, numTwo) => {
    let newBoard = [...board];
    if (newBoard[numOne][numTwo].available == true) {
      newBoard[numOne][numTwo].selected = playerTurn;
      newBoard[numOne][numTwo].available = false;
      // setBoard(newBoard);
      let validatedBoard = checkForValidSquares(board);
      setBoard(validatedBoard);
    } else {
      setError({
        message: "Square not available",
        color: "red",
        visible: true,
      });
      setTimeout(() => {
        setError({
          message: "",
          color: null,
          visible: false,
        });
      }, 3000);
    }
  };

  const checkForValidSquares = (array) => {
    let arrayCopy = [...array];
    for (let i = arrayCopy.length - 1; i >= 0; i--) {
      for (let x = arrayCopy[i].length - 1; x >= 0; x--) {
        if (i > 0) {
          let bottomSquare = arrayCopy[i][x];
          let topSquare = arrayCopy[i - 1][x];
          if (bottomSquare.selected !== 0 && topSquare.selected === 0) {
            topSquare.available = true;
          }
        }
      }
    }
    return arrayCopy;
  };

  const checkForVerticalWin = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
      for (let x = array[i].length - 1; x >= 0; x--) {
        if (i - 3 > 0) {
          let firstSquare = array[i][x];
          let secondSquare = array[i - 1][x];
          let thirdSquare = array[i - 2][x];
          let fourthSquare = array[i - 3][x];
          if (
            firstSquare.selected === secondSquare.selected &&
            secondSquare.selected === thirdSquare.selected &&
            thirdSquare.selected === fourthSquare.selected &&
            firstSquare.selected !== 0
          ) {
            setWinner(playerTurn);
          }
        }
      }
    }
  };

  const checkForHorizontalWin = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
      for (let x = array[i].length - 1; x >= 0; x--) {
        if (x - 3 > 0) {
          let firstSquare = array[i][x];
          let secondSquare = array[i][x - 1];
          let thirdSquare = array[i][x - 2];
          let fourthSquare = array[i][x - 3];
          if (
            firstSquare.selected === secondSquare.selected &&
            secondSquare.selected === thirdSquare.selected &&
            thirdSquare.selected === fourthSquare.selected &&
            firstSquare.selected !== 0
          ) {
            setWinner(playerTurn);
          }
        }
      }
    }
  };

  const checkForAscendingWin = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
      for (let x = array[i].length - 1; x >= 0; x--) {
        if (x - 3 > 0 && i - 3 > 0) {
          let firstSquare = array[i][x];
          let secondSquare = array[i - 1][x - 1];
          let thirdSquare = array[i - 2][x - 2];
          let fourthSquare = array[i - 3][x - 3];
          if (
            firstSquare.selected === secondSquare.selected &&
            secondSquare.selected === thirdSquare.selected &&
            thirdSquare.selected === fourthSquare.selected &&
            firstSquare.selected !== 0
          ) {
            setWinner(playerTurn);
          }
        }
      }
    }
  };

  const checkForDescendingWin = (array) => {
    for (let i = array.length - 1; i >= 0; i--) {
      for (let x = array[i].length - 1; x >= 0; x--) {
        if (x + 3 < array[i].length && i - 3 > 0) {
          let firstSquare = array[i][x];
          let secondSquare = array[i - 1][x + 1];
          let thirdSquare = array[i - 2][x + 2];
          let fourthSquare = array[i - 3][x + 3];
          if (
            firstSquare.selected === secondSquare.selected &&
            secondSquare.selected === thirdSquare.selected &&
            thirdSquare.selected === fourthSquare.selected &&
            firstSquare.selected !== 0
          ) {
            setWinner(playerTurn);
          }
        }
      }
    }
  };

  /**
   * Context Component to handle Connect Four Game Logic
   */

  return (
    <ConnectFourContext.Provider
      value={{
        board,
        playerTurn,
        setPlayerTurn,
        computerPlayer,
        phase,
        winner,
        error,
        handleComputerMove,
        handleSetup,
        resetGame,
        makeBoard,
        handlePickSquare,
        checkForValidSquares,
        checkForAscendingWin,
        checkForDescendingWin,
        checkForHorizontalWin,
        checkForVerticalWin,
      }}
    >
      {props.children}
    </ConnectFourContext.Provider>
  );
}