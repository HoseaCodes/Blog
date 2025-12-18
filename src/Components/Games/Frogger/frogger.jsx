import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import turtle from "../../SVG/turtle-svgrepo-com.svg";
import ambulance from "../../SVG/ambulance-svgrepo-com.svg";
import bicycle from "../../SVG/bicycle-bike-svgrepo-com.svg";
import bus from "../../SVG/bus-front-view-svgrepo-com.svg";
import cab from "../../SVG/cab-svgrepo-com.svg";
import car from "../../SVG/car-svgrepo-com.svg";
import truck from "../../SVG/truck-lorry-svgrepo-com.svg";

// Game constants
const GRID_SIZE = 40; // Size of each grid cell
const GAME_WIDTH = 800;
const GAME_HEIGHT = 480;
const COLS = Math.floor(GAME_WIDTH / GRID_SIZE);
const ROWS = Math.floor(GAME_HEIGHT / GRID_SIZE);

// Styled components
const GameWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    #4CAF50 0%,
    #4CAF50 10%,
    #333 10%,
    #333 20%,
    #333 20%,
    #333 30%,
    #333 30%,
    #333 40%,
    #333 40%,
    #333 50%,
    #333 50%,
    #333 60%,
    #333 60%,
    #333 70%,
    #333 70%,
    #333 80%,
    #4CAF50 80%,
    #4CAF50 90%,
    #4CAF50 90%,
    #4CAF50 100%
  );
  cursor: pointer;
  overflow: hidden;
  min-height: 400px;
  max-width: ${GAME_WIDTH}px;
  max-height: ${GAME_HEIGHT}px;
  margin: 0 auto;
  border: 2px solid #2E7D32;
`;

const InstructionText = styled.div`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 100;
  font-family: 'Amatic SC', cursive;
  text-align: center;
  user-select: none;
  margin: 0;
  z-index: 10;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  background: rgba(0, 0, 0, 0.5);
  padding: 5px 10px;
  border-radius: 5px;

  @media (max-width: 600px) {
    font-size: 14px;
    top: 5px;
  }
`;

const GameArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
`;

const Frog = styled.div`
  position: absolute;
  width: ${GRID_SIZE - 4}px;
  height: ${GRID_SIZE - 4}px;
  background-image: url(${turtle});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transform: ${props => {
    switch(props.direction) {
      case 'up': return 'rotate(0deg)';
      case 'right': return 'rotate(90deg)';
      case 'down': return 'rotate(180deg)';
      case 'left': return 'rotate(270deg)';
      default: return 'rotate(0deg)';
    }
  }};
  transition: all 0.2s ease;
  z-index: 10;
  border-radius: 50%;
  border: 2px solid #2E7D32;
`;

const Vehicle = styled.div`
  position: absolute;
  width: ${props => props.size || GRID_SIZE * 2}px;
  height: ${GRID_SIZE - 4}px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  transform: scaleX(${props => props.direction === 'left' ? -1 : 1});
  transition: none;
  z-index: 5;
`;

const Lane = styled.div`
  position: absolute;
  width: 100%;
  height: ${GRID_SIZE}px;
  top: ${props => props.row * GRID_SIZE}px;
  background: ${props => props.isRoad ? '#333' : 'transparent'};
  border-top: ${props => props.isRoad ? '1px dashed #555' : 'none'};
`;

const GoalArea = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${GRID_SIZE}px;
  background: #4CAF50;
  border-bottom: 2px solid #2E7D32;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Amatic SC', cursive;
  font-size: 20px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const StartArea = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${GRID_SIZE}px;
  background: #4CAF50;
  border-top: 2px solid #2E7D32;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Amatic SC', cursive;
  font-size: 16px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const HeartsDisplay = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  display: flex;
  gap: 8px;
  z-index: 15;
  font-family: 'Amatic SC', cursive;
  font-size: 24px;
`;

const GameOverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  border-radius: 8px;
`;

const GameOverText = styled.div`
  font-family: 'Amatic SC', cursive;
  font-size: 48px;
  color: #ff6b6b;
  margin-bottom: 20px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8);
  font-weight: bold;
`;

const FinalScoreText = styled.div`
  font-family: 'Amatic SC', cursive;
  font-size: 32px;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

function ClickLots({ gameStarted: gameStartedProp, isTimerRunning, soundEnabled, musicEnabled, onScoreUpdate, onGameComplete }) {
  const [gameStarted, setGameStarted] = useState(false);
  const [frogPos, setFrogPos] = useState({ x: Math.floor(COLS / 2), y: ROWS - 1 });
  const [frogDirection, setFrogDirection] = useState('up');
  const [vehicles, setVehicles] = useState([]);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef(null);

  // Start game when gameStartedProp changes
  useEffect(() => {
    if (gameStartedProp) {
      setGameStarted(true);
      setScore(0);
      setHearts(3);
      setGameOver(false);
      setFrogPos({ x: Math.floor(COLS / 2), y: ROWS - 1 });
      setFrogDirection('up');
    }
  }, [gameStartedProp]);

  const squeek = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/squeek.wav";
  const win = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/99636__tomlija__small-crowd-yelling-yeah.wav";
  const crashSound = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/crash.wav";

  const trafficArray = [ambulance, bicycle, bus, cab, car, truck];

  // Initialize vehicles for each lane
  useEffect(() => {
    const initialVehicles = [];
    // Create vehicles for road lanes (rows 2-8)
    for (let row = 2; row <= 8; row++) {
      const isLeftMoving = row % 2 === 0;
      const vehicleCount = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < vehicleCount; i++) {
        initialVehicles.push({
          id: `${row}-${i}`,
          x: isLeftMoving ? 
            (i * (COLS / vehicleCount) + Math.random() * 3) : 
            (COLS - (i * (COLS / vehicleCount)) + Math.random() * 3),
          y: row,
          direction: isLeftMoving ? 'left' : 'right',
          speed: 0.5 + Math.random() * 1.5,
          type: trafficArray[Math.floor(Math.random() * trafficArray.length)],
          size: GRID_SIZE + Math.random() * GRID_SIZE
        });
      }
    }
    setVehicles(initialVehicles);
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = setInterval(() => {
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => {
          let newX = vehicle.x;
          
          if (vehicle.direction === 'left') {
            newX -= vehicle.speed;
            if (newX < -3) newX = COLS + 2;
          } else {
            newX += vehicle.speed;
            if (newX > COLS + 2) newX = -3;
          }
          
          return { ...vehicle, x: newX };
        })
      );
      
      // Check collisions
      checkCollisions();
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, frogPos]);

  const checkCollisions = () => {
    vehicles.forEach(vehicle => {
      const vehicleLeft = vehicle.x * GRID_SIZE;
      const vehicleRight = vehicleLeft + vehicle.size;
      const vehicleTop = vehicle.y * GRID_SIZE;
      const vehicleBottom = vehicleTop + GRID_SIZE;
      
      const frogLeft = frogPos.x * GRID_SIZE;
      const frogRight = frogLeft + GRID_SIZE;
      const frogTop = frogPos.y * GRID_SIZE;
      const frogBottom = frogTop + GRID_SIZE;
      
      if (
        frogLeft < vehicleRight &&
        frogRight > vehicleLeft &&
        frogTop < vehicleBottom &&
        frogBottom > vehicleTop
      ) {
        // Collision detected
        if (soundEnabled) {
          let crash = new Audio(crashSound);
          crash.loop = false;
          crash.play();
        }
        
        const newHearts = hearts - 1;
        setHearts(newHearts);
        
        // Check if game over
        if (newHearts <= 0) {
          setGameOver(true);
          setGameStarted(false);
          if (onGameComplete) {
            onGameComplete(score);
          }
        } else {
          resetFrog();
        }
      }
    });
  };

  const resetFrog = () => {
    setFrogPos({ x: Math.floor(COLS / 2), y: ROWS - 1 });
    setFrogDirection('up');
  };

  const moveFrog = (direction) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    let newX = frogPos.x;
    let newY = frogPos.y;
    
    switch (direction) {
      case 'up':
        newY = Math.max(0, frogPos.y - 1);
        break;
      case 'down':
        newY = Math.min(ROWS - 1, frogPos.y + 1);
        break;
      case 'left':
        newX = Math.max(0, frogPos.x - 1);
        break;
      case 'right':
        newX = Math.min(COLS - 1, frogPos.x + 1);
        break;
    }
    
    if (newX !== frogPos.x || newY !== frogPos.y) {
      if (soundEnabled) {
        let move = new Audio(squeek);
        move.loop = false;
        move.play();
      }
      
      setFrogPos({ x: newX, y: newY });
      setFrogDirection(direction);
      
      // Check if reached goal
      if (newY === 0) {
        if (soundEnabled) {
          let winGame = new Audio(win);
          winGame.loop = false;
          winGame.play();
        }
        
        const newScore = score + 1;
        setScore(newScore);
        
        // Call score update callback
        if (onScoreUpdate) {
          onScoreUpdate(newScore);
        }
        
        resetFrog();
      }
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          moveFrog('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveFrog('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveFrog('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveFrog('right');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [frogPos, gameStarted, score]);

  // Handle click movement (click on area around frog to move in that direction)
  const handleAreaClick = (e) => {
    const rect = gameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const scale = rect.width / GAME_WIDTH;
    const gameX = x / scale;
    const gameY = y / scale;
    
    const frogCenterX = (frogPos.x + 0.5) * GRID_SIZE;
    const frogCenterY = (frogPos.y + 0.5) * GRID_SIZE;
    
    const deltaX = gameX - frogCenterX;
    const deltaY = gameY - frogCenterY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      moveFrog(deltaX > 0 ? 'right' : 'left');
    } else {
      moveFrog(deltaY > 0 ? 'down' : 'up');
    }
  };

  return (
    <GameWrapper ref={gameRef} onClick={handleAreaClick}>
      <InstructionText>
        {!gameStarted 
          ? "Click or use arrow keys to move • Reach the top!" 
          : `Score: ${score} • Avoid traffic!`
        }
      </InstructionText>

      <HeartsDisplay>
        {Array.from({ length: 3 }, (_, i) => (
          <span key={i}>
            {i < hearts ? '❤️' : '🖤'}
          </span>
        ))}
      </HeartsDisplay>
      
      <GameArea>
        {/* Render lanes */}
        {Array.from({ length: ROWS }, (_, row) => (
          <Lane 
            key={row} 
            row={row} 
            isRoad={row >= 2 && row <= 8}
          />
        ))}
        
        <GoalArea>🏁 GOAL 🏁</GoalArea>
        <StartArea>START</StartArea>
        
        {/* Render vehicles */}
        {vehicles.map(vehicle => (
          <Vehicle
            key={vehicle.id}
            style={{
              left: `${vehicle.x * GRID_SIZE}px`,
              top: `${vehicle.y * GRID_SIZE + 2}px`,
            }}
            src={vehicle.type}
            direction={vehicle.direction}
            size={vehicle.size}
          />
        ))}
        
        {/* Render frog */}
        <Frog
          style={{
            left: `${frogPos.x * GRID_SIZE + 2}px`,
            top: `${frogPos.y * GRID_SIZE + 2}px`,
          }}
          direction={frogDirection}
        />

        {/* Game Over Overlay */}
        {gameOver && (
          <GameOverOverlay>
            <GameOverText>Game Over!</GameOverText>
            <FinalScoreText>Final Score: {score}</FinalScoreText>
          </GameOverOverlay>
        )}
      </GameArea>
    </GameWrapper>
  );
}

export default ClickLots;