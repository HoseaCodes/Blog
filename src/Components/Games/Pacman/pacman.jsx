import { Button, Grid, Result } from "../common";
import { layout, legends } from "./resource";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import PacmanImg from "../../../Assets/Gif/pacman.gif";


const ClydeImg = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/clyde.png";
const BlinkyImg = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/blinky.png";
const InkyImg = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/inky.png";
const PinkyImg = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/pinky.png";
const GhostImg = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/scared-ghost.png";
const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14.3px;
  height: 14.3px;
`;
const Wall = styled(Block)`
  background: #182e60;
`;
const Dot = styled(Block)`
  div {
    width: 3px;
    height: 3px;
    background: white;
    border-radius: 50%;
  }
`;
const PowerPellet = styled(Block)`
  div {
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
  }
`;
const Empty = styled(Block)``;
const PacManChar = styled(Block)`
  transform: rotate(${({ rotate }) => rotate + "deg"});
  img {
    width: 70%;
  }
`;
const Alien = styled(Block)`
  img {
    width: 70%;
  }
`;
export const Components = {
  0: Dot,
  1: Wall,
  2: Empty,
  3: PowerPellet,
  4: Empty,
};
const getRotationDeg = (direction) => {
  const degrees = {
    RIGHT: "0",
    LEFT: "180",
    UP: "270",
    DOWN: "90",
  };
  return degrees[direction];
};
let pacmanTimer = null;
let ghostTimer = [];
let energyTimer = null;
let width = 28;
const directionAmt = {
  RIGHT: 1,
  LEFT: -1,
  UP: -width,
  DOWN: width,
};
const PacMan = () => {
  const [cells, setCells] = useState(layout);
  const [pacman, setPacman] = useState(490);
  const [direction, setDirection] = useState("LEFT");
  const [start, setStart] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState("");
  const [energize, setEnergize] = useState(false);
  const [ghosts, setGhosts] = useState([
    { index: 403, direction: 1, img: BlinkyImg },
    { index: 405, direction: -1, img: ClydeImg },
    { index: 408, direction: width, img: PinkyImg },
    { index: 379, direction: -width, img: InkyImg },
  ]);
  useEffect(() => {
    //packman slider
    if (start && !gameOver) {
      let newPosition = pacman + directionAmt[direction];
      let leftTunnel = direction === "LEFT" && pacman === 364;
      let rightTunnel = direction === "RIGHT" && pacman === 391;
      if (leftTunnel) newPosition = pacman + width - 1;
      if (rightTunnel) newPosition = pacman - width + 1;
      if (cells[newPosition] !== legends.wall)
        pacmanTimer = setTimeout(() => {
          setPacman(newPosition);
        }, 200);
      let ghostPresent = ghosts.find((e) => e.index === pacman);
      if (ghostPresent) setGameOver("Game Over");
    }
    return () => clearTimeout(pacmanTimer);
  }, [pacman, start, cells, direction, gameOver]);

  const getValidSquare = (value, addAmount) => {
    const dir = [1, -1, width, -width];
    const newPos = addAmount || dir[Math.floor(Math.random() * dir.length)];
    const otherGhost = ghosts.find((e) => e.index === value + newPos);
    if (cells[value + newPos] !== legends.wall && !otherGhost) {
      return { index: value + newPos, direction: newPos };
    } else {
      return getValidSquare(value);
    }
  };
  const moveGhosts = (values, callback) => {
    ghostTimer.push(
      setTimeout(() => {
        let newValue = [];
        values.forEach(({ index, direction, img }) => {
          newValue.push({ img, ...getValidSquare(index, direction) });
        });
        callback(newValue);
      }, 200)
    );
  };
  useEffect(() => {
    //blinky quick path search
    if (start && !gameOver) moveGhosts(ghosts, setGhosts);
    return () => ghostTimer.forEach((e) => clearTimeout(e));
  }, [ghosts, direction, start, gameOver]);
  const keyHandler = (e) => {
    let keyMap = {
      ArrowUp: "UP",
      ArrowDown: "DOWN",
      ArrowLeft: "LEFT",
      ArrowRight: "RIGHT",
    };
    if (keyMap[e.key]) setDirection(keyMap[e.key]);
  };
  useEffect(() => {
    if (start) window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [start]);
  useEffect(() => {
    //eating pellet
    if (cells[pacman] === legends.pacDots) {
      setScore((prev) => prev + 1);
      let newCells = [...cells];
      newCells[pacman] = legends.empty;
      setCells(newCells);
    }
    if (cells[pacman] === legends.powerPellet) {
      let newCells = [...cells];
      newCells[pacman] = legends.empty;
      setEnergize("id" + pacman);
      setCells(newCells);
    }
    if (!cells.includes(legends.pacDots)) {
      setGameOver("Success!!!");
    }
  }, [pacman, score, cells]);
  useEffect(() => {
    if (energize) {
      energyTimer = setTimeout(() => {
        setEnergize(false);
      }, 10000);
    }
    return () => clearTimeout(energyTimer);
  }, [energize]);
  const resetGame = () => {
    setCells(layout);
    setPacman(490);
    setDirection("LEFT");
    setGameOver(false);
  };
  const toggleGame = () => {
    if (start) setStart(false);
    else {
      resetGame();
      setStart(true);
    }
  };
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "4%",
    }}>
      <Grid color={"black"} width={401} height={401}>
        {cells.map((e, i) => {
          if (i === pacman)
            return (
              <PacManChar key={i} rotate={getRotationDeg(direction)}>
                <img src={PacmanImg} />
              </PacManChar>
            );
          let ghost = ghosts.find((e) => e.index === i);
          if (ghost)
            return (
              <Alien key={i}>
                <img src={energize ? GhostImg : ghost.img} />
              </Alien>
            );
          let Comp = Components[e];
          return (
            <Comp key={i}>
              <div></div>
            </Comp>
          );
        })}
      </Grid>
      <div>
        <Button onClick={toggleGame}>{start ? "Stop" : "Start"}</Button>
        {score}
        {gameOver ? <Result>{gameOver}</Result> : ""}
      </div>
    </div>
  );
};

export default PacMan;