import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";

// Mouse animation keyframes
const mouseAnimation = keyframes`
  0% { left: 40%; top: 35%; transform: scale(1); }
  50% { left: 50%; top: 45%; transform: scale(1.1); }
  100% { left: 40%; top: 35%; transform: scale(1); }
`;

// Pulse animation for food
const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Styled components
const GameWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgb(159, 136, 86) 0%, rgb(180, 150, 100) 100%);
  cursor: none;
  overflow: hidden;
  min-height: 400px;
  border-radius: 8px;
`;

const InstructionText = styled.p`
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  font-weight: 100;
  font-family: 'Amatic SC', cursive;
  text-align: center;
  user-select: none;
  margin: 0;
  z-index: 10;
  color: #2c1810;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(5px);

  @media (max-width: 600px) {
    font-size: 16px;
    top: 10px;
    padding: 6px 12px;
  }
`;

const Snail = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  transform: scaleX(${props => props.direction});
  cursor: none;
  user-select: none;
  z-index: 5;
  transition: transform 0.2s ease;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "🐌";
    display: block;
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 32px;
  }
`;

const Food = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  cursor: pointer;
  user-select: none;
  z-index: 3;
  transition: all 0.3s ease;
  filter: drop-shadow(1px 1px 3px rgba(0,0,0,0.4));
  font-size: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${pulseAnimation} 2s infinite;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);

  &::before {
    content: "🍃";
    display: block;
  }

  &:hover {
    transform: scale(1.2);
    filter: brightness(1.2) drop-shadow(2px 2px 5px rgba(0,0,0,0.5));
    background: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 600px) {
    width: 35px;
    height: 35px;
    font-size: 25px;
  }
`;

const MouseIndicator = styled.div`
  width: 50px;
  height: 50px;
  opacity: 0.6;
  position: absolute;
  left: 40%;
  top: 35%;
  animation: ${mouseAnimation} 2s infinite;
  pointer-events: none;
  user-select: none;
  z-index: 8;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  backdrop-filter: blur(5px);

  &::before {
    content: "🖱️";
    display: block;
  }

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 30px;
  }
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 20px;
  font-family: 'Amatic SC', cursive;
  font-weight: bold;
  color: #2c1810;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  user-select: none;
  z-index: 10;
  backdrop-filter: blur(5px);

  @media (max-width: 600px) {
    font-size: 18px;
    top: 10px;
    right: 10px;
    padding: 6px 12px;
  }
`;

const HeartsDisplay = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  font-size: 20px;
  font-family: 'Amatic SC', cursive;
  font-weight: bold;
  color: #2c1810;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 20px;
  user-select: none;
  z-index: 10;
  backdrop-filter: blur(5px);
  display: flex;
  gap: 4px;

  @media (max-width: 600px) {
    font-size: 18px;
    top: 10px;
    left: 10px;
    padding: 6px 12px;
  }
`;

const StartButton = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.9);
  border: 3px solid rgba(255, 255, 255, 0.9);
  padding: 12px 32px;
  border-radius: 25px;
  font-family: 'Amatic SC', cursive;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  color: #2c1810;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translate(-50%, -50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translate(-50%, -50%) scale(0.95);
  }

  @media (max-width: 600px) {
    font-size: 20px;
    padding: 10px 24px;
  }
`;

const ResetButton = styled.button`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.9);
  padding: 8px 20px;
  border-radius: 20px;
  font-family: 'Amatic SC', cursive;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  color: #2c1810;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(-50%) scale(1.05);
  }

  &:active {
    transform: translateX(-50%) scale(0.95);
  }

  @media (max-width: 600px) {
    font-size: 16px;
    padding: 6px 16px;
    bottom: 10px;
  }
`;

const GameArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: transparent;
`;

export default function Race({ gameStarted: gameStartedProp, isTimerRunning, soundEnabled, musicEnabled, onScoreUpdate, onGameComplete }) {
  const crunch = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/429591__inspectorj__chewing-breadstick-single-d.wav";
  const loseSound = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/521665__mickleness__game-sound-wrong.mp3";
  
  // Changed to pixels for consistency
  const [foodPositionX, setFoodPositionX] = useState(300);
  const [foodPositionY, setFoodPositionY] = useState(150);
  const [snailX, setSnailX] = useState(200);
  const [snailY, setSnailY] = useState(200);
  const [direction, setDirection] = useState(1);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showMouse, setShowMouse] = useState(true);
  const [hearts, setHearts] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [totalMissed, setTotalMissed] = useState(0);
  const [currentFoodId, setCurrentFoodId] = useState(null);
  
  const gameRef = useRef();
  const lastX = useRef(200);
  const missTimeoutRef = useRef(null);
  const lastEatenRef = useRef(null);

  // Start game when gameStartedProp changes
  useEffect(() => {
    if (gameStartedProp) {
      startNewGame();
    }
  }, [gameStartedProp]);

  // Generate random position for food in pixels
  const getRandomFoodPosition = () => {
    if (!gameRef.current) return { x: 300, y: 150 };
    
    const rect = gameRef.current.getBoundingClientRect();
    const margin = 50; // Keep food away from edges
    
    return {
      x: Math.random() * (rect.width - margin * 2) + margin,
      y: Math.random() * (rect.height - margin * 2) + margin
    };
  };

  // Start a new game
  const startNewGame = () => {
    setGameStarted(true);
    setScore(0);
    setHearts(3);
    setGameOver(false);
    setTotalMissed(0);
    setShowMouse(false);
    setSnailX(200);
    setSnailY(200);
    setDirection(1);
    
    // Position food randomly
    const newPos = getRandomFoodPosition();
    setFoodPositionX(newPos.x);
    setFoodPositionY(newPos.y);
    
    // Create a unique ID for this food
    const newFoodId = `${Date.now()}-${Math.random()}`;
    setCurrentFoodId(newFoodId);
    
    // Clear any existing timeout
    if (missTimeoutRef.current) {
      clearTimeout(missTimeoutRef.current);
      missTimeoutRef.current = null;
    }
    
    lastEatenRef.current = null;
  };

  // Start the miss timer for the current food
  const startMissTimer = (foodId) => {
    if (missTimeoutRef.current) {
      clearTimeout(missTimeoutRef.current);
    }

    missTimeoutRef.current = setTimeout(() => {
      // Only execute if this is still the current food and game is active
      if (gameStarted && !gameOver && foodId === currentFoodId) {
        const newHearts = hearts - 1;
        setHearts(newHearts);
        setTotalMissed(prev => prev + 1);

        // Play lose sound
        if (soundEnabled) {
          try {
            let lose = new Audio(loseSound);
            lose.loop = false;
            lose.volume = 0.3;
            lose.play().catch(() => {});
          } catch (error) {
            // Silently fail
          }
        }

        if (newHearts <= 0) {
          setGameOver(true);
          setGameStarted(false);
          if (onGameComplete) {
            onGameComplete(score);
          }
        } else {
          // Move food to new position and reset timer
          spawnNewFood();
        }
      }
    }, 3000); // 3 seconds to eat food (CHANGED FROM 30000 to 3000)
  };

  // Spawn new food and start its timer
  const spawnNewFood = () => {
    const newPos = getRandomFoodPosition();
    setFoodPositionX(newPos.x);
    setFoodPositionY(newPos.y);
    
    // Create a unique ID for this new food
    const newFoodId = `${Date.now()}-${Math.random()}`;
    setCurrentFoodId(newFoodId);
    
    lastEatenRef.current = null;
    
    // Start the timer for this specific food
    startMissTimer(newFoodId);
  };

  function handleMouseMove(e) {
    if (!gameRef.current || !gameStarted || gameOver) return;

    // Get the game wrapper's bounding rect to calculate relative position
    const rect = gameRef.current.getBoundingClientRect();
    
    // Calculate position relative to game wrapper
    const relativeX = e.clientX - rect.left;
    const relativeY = e.clientY - rect.top;
    
    // Set snail position (center the snail on the cursor)
    const newX = Math.max(0, Math.min(rect.width - 50, relativeX - 25));
    const newY = Math.max(0, Math.min(rect.height - 50, relativeY - 25));
    
    setSnailX(newX);
    setSnailY(newY);
    
    // Update direction based on movement
    if (lastX.current < relativeX) {
      setDirection(1);
    } else if (lastX.current > relativeX) {
      setDirection(-1);
    }
    lastX.current = relativeX;
  }

  // Handle eating food
  const eatFood = () => {
    if (!gameStarted || gameOver) return;
    
    // Play sound if available and enabled
    if (soundEnabled) {
      try {
        let eatSound = new Audio(crunch);
        eatSound.loop = false;
        eatSound.volume = 0.3;
        eatSound.play().catch(() => {
          // Silently fail if audio doesn't work
        });
      } catch (error) {
        // Silently fail if audio doesn't work
      }
    }
    
    // Increase score
    setScore(prev => prev + 1);
    
    // Clear any pending miss timeout
    if (missTimeoutRef.current) {
      clearTimeout(missTimeoutRef.current);
      missTimeoutRef.current = null;
    }
    
    // Spawn new food
    spawnNewFood();
  };

  function resetGame() {
    setScore(0);
    setHearts(3);
    setGameStarted(false);
    setGameOver(false);
    setTotalMissed(0);
    setShowMouse(true);
    setSnailX(200);
    setSnailY(200);
    setDirection(1);
    setCurrentFoodId(null);
    
    const newPos = getRandomFoodPosition();
    setFoodPositionX(newPos.x);
    setFoodPositionY(newPos.y);
    
    if (missTimeoutRef.current) {
      clearTimeout(missTimeoutRef.current);
      missTimeoutRef.current = null;
    }
    
    lastEatenRef.current = null;
  }

  // Check proximity for automatic eating
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const snailCenterX = snailX + 25;
    const snailCenterY = snailY + 25;
    const foodCenterX = foodPositionX + 20;
    const foodCenterY = foodPositionY + 20;
    
    const distance = Math.sqrt(
      Math.pow(snailCenterX - foodCenterX, 2) + Math.pow(snailCenterY - foodCenterY, 2)
    );
    
    // If snail is close enough to food, eat it
    if (distance < 40 && lastEatenRef.current !== currentFoodId) {
      lastEatenRef.current = currentFoodId;
      eatFood();
    }
  }, [snailX, snailY, foodPositionX, foodPositionY, gameStarted, gameOver, currentFoodId, soundEnabled]);

  // Start miss timer when new food spawns (only when currentFoodId changes)
  useEffect(() => {
    if (gameStarted && !gameOver && currentFoodId) {
      startMissTimer(currentFoodId);
    }
    
    return () => {
      if (missTimeoutRef.current) {
        clearTimeout(missTimeoutRef.current);
      }
    };
  }, [currentFoodId]); // Only depend on currentFoodId, not food position

  // Update score callback
  useEffect(() => {
    if (onScoreUpdate && gameStarted) {
      onScoreUpdate(score);
    }
  }, [score, gameStarted, onScoreUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (missTimeoutRef.current) {
        clearTimeout(missTimeoutRef.current);
      }
    };
  }, []);

  return (
    <GameWrapper ref={gameRef} onMouseMove={handleMouseMove}>
      <GameArea>
        {!gameStarted && showMouse && (
          <>
            <InstructionText>
              🐌 Guide the snail to the leaf with your mouse! 🍃<br />
              You have 3 seconds per leaf!
            </InstructionText>
            <StartButton onClick={startNewGame}>
              ▶ Start Game
            </StartButton>
          </>
        )}

        {gameStarted && (
          <>
            <ScoreDisplay>
              🍃 Leaves Eaten: {score}
            </ScoreDisplay>
            <HeartsDisplay>
              {[...Array(3)].map((_, i) => (
                <span key={i}>
                  {i < hearts ? '❤️' : '🖤'}
                </span>
              ))}
            </HeartsDisplay>
          </>
        )}

        <Snail
          x={snailX}
          y={snailY}
          direction={direction}
        />

        <Food
          onClick={eatFood}
          x={foodPositionX}
          y={foodPositionY}
        />

        {!gameStarted && showMouse && (
          <MouseIndicator />
        )}

        {gameOver && (
          <>
            <InstructionText>
              Game Over! Final Score: {score} 🎮<br />
              Missed: {totalMissed} leaves
            </InstructionText>
            <ResetButton onClick={resetGame}>
              🔄 Play Again
            </ResetButton>
          </>
        )}

        {gameStarted && score > 0 && !gameOver && (
          <ResetButton onClick={resetGame}>
            🔄 Reset Game
          </ResetButton>
        )}
      </GameArea>
    </GameWrapper>
  );
}