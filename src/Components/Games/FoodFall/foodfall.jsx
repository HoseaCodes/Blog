import React, { useEffect, useState, useRef } from "react";
import styled, { keyframes } from "styled-components";

// Animation keyframes
const fallAnimation = keyframes`
  0% { transform: translateY(-100px) scale(1); }
  100% { transform: translateY(400px) scale(1); }
`;

const plateAnimation = keyframes`
  0% { transform: translateX(-10px); }
  50% { transform: translateX(10px); }
  100% { transform: translateX(-10px); }
`;

const shrinkAnimation = keyframes`
  0% { transform: scale(1); }
  100% { transform: scale(0); }
`;

// Styled components
const GameWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: linear-gradient(180deg, #ffcccc 0%, #ffb3b3 50%, #ff9999 100%);
  cursor: none;
  overflow: hidden;
  border-radius: 8px;
`;

const InstructionText = styled.p`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: 100;
  font-family: 'Amatic SC', cursive;
  text-align: center;
  user-select: none;
  margin: 0;
  z-index: 15;
  color: #8B0000;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.3);
  padding: 10px 20px;
  border-radius: 20px;
  backdrop-filter: blur(5px);

  @media (max-width: 600px) {
    font-size: 18px;
    top: 15px;
    padding: 8px 16px;
  }
`;

const GameArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: transparent;
`;

const Plate = styled.div`
  position: absolute;
  bottom: 30px;
  left: ${props => props.x}px;
  width: 80px;
  height: 60px;
  font-size: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: left 0.1s ease;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
  user-select: none;

  @media (max-width: 600px) {
    width: 60px;
    height: 45px;
    font-size: 45px;
    bottom: 20px;
  }
`;

const FallingFood = styled.div`
  position: absolute;
  left: ${props => props.x}px;
  top: ${props => props.y}px;
  width: 50px;
  height: 50px;
  font-size: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  transform: scale(${props => props.scale});
  filter: drop-shadow(1px 1px 3px rgba(0,0,0,0.4));
  transition: transform 0.1s ease;
  user-select: none;

  @media (max-width: 600px) {
    width: 40px;
    height: 40px;
    font-size: 32px;
  }
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  font-family: 'Amatic SC', cursive;
  font-weight: bold;
  color: #8B0000;
  text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.3);
  padding: 10px 16px;
  border-radius: 20px;
  user-select: none;
  z-index: 15;
  backdrop-filter: blur(5px);

  @media (max-width: 600px) {
    font-size: 20px;
    top: 15px;
    right: 15px;
    padding: 8px 12px;
  }
`;

const ExampleContainer = styled.div`
  position: absolute;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  z-index: 15;
  background: rgba(255, 255, 255, 0.2);
  padding: 20px;
  border-radius: 20px;
  backdrop-filter: blur(5px);

  @media (max-width: 600px) {
    bottom: 60px;
    padding: 15px;
    gap: 10px;
  }
`;

const FoodExamples = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;

  @media (max-width: 600px) {
    gap: 10px;
  }
`;

const ExampleFood = styled.div`
  font-size: 35px;
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
  opacity: 0.8;

  @media (max-width: 600px) {
    font-size: 28px;
  }
`;

const IndicatorContainer = styled.div`
  display: flex;
  gap: 30px;
  align-items: center;
  margin-top: 10px;

  @media (max-width: 600px) {
    gap: 20px;
  }
`;

const Indicator = styled.div`
  font-size: 50px;
  animation: ${plateAnimation} 2s infinite;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));

  @media (max-width: 600px) {
    font-size: 40px;
  }
`;

const StartButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(139, 0, 0, 0.3);
  padding: 12px 24px;
  border-radius: 25px;
  font-family: 'Amatic SC', cursive;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  z-index: 15;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  color: #8B0000;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateX(-50%) scale(1.05);
  }

  &:active {
    transform: translateX(-50%) scale(0.95);
  }

  @media (max-width: 600px) {
    font-size: 18px;
    padding: 10px 20px;
    bottom: 15px;
  }
`;

// Food emoji mapping
const FOOD_EMOJIS = {
  burger: "🍔",
  pizza: "🍕", 
  burrito: "🌯",
  donut: "🍩",
  fire: "🔥"
};

const GOOD_FOODS = ["🍔", "🍕", "🌯", "🍩"];

export default function FoodFall({ gameStarted: gameStartedProp, isTimerRunning, soundEnabled, musicEnabled, onScoreUpdate, onGameComplete }) {
  const winSound = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/445974__breviceps__cartoon-slurp.wav";
  const loseSound = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/burn.wav";

  const [plateX, setPlateX] = useState(200);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [containerWidth, setContainerWidth] = useState(0);

  // Food items state - using pixel coordinates
  const [foods, setFoods] = useState([
    { id: 1, emoji: "🍔", x: 50, y: -50, scale: 1, speed: 2 },
    { id: 2, emoji: "🔥", x: 200, y: -50, scale: 1, speed: 2.5 },
    { id: 3, emoji: "🍩", x: 150, y: -100, scale: 1, speed: 2 }
  ]);

  const gameRef = useRef();

  // Start game when gameStartedProp changes
  useEffect(() => {
    if (gameStartedProp) {
      setGameStarted(true);
      setScore(0);
      setLives(3);
      setPlateX(200);
    }
  }, [gameStartedProp]);

  // Generate random food
  const getRandomFood = () => {
    const allFoods = [...GOOD_FOODS, "🔥"];
    return allFoods[Math.floor(Math.random() * allFoods.length)];
  };

  // Mouse tracking
  const handleMouseMove = (e) => {
    if (!gameRef.current || !gameStarted) return;

    const rect = gameRef.current.getBoundingClientRect();
    
    // Set container width on first move
    if (containerWidth === 0) {
      setContainerWidth(rect.width);
    }
    
    const relativeX = e.clientX - rect.left;
    
    // Center the plate on mouse position and keep within bounds
    setPlateX(Math.max(0, Math.min(rect.width - 80, relativeX - 40)));
  };

  // Game loop
  useEffect(() => {
    if (!gameStarted || !containerWidth) return;

    const gameLoop = setInterval(() => {
      setFoods(prevFoods => {
        return prevFoods.map(food => {
          let newY = food.y + food.speed;
          let newFood = { ...food, y: newY };

          // Plate is at the bottom (around 430px in a 500px container)
          const plateY = 430;

          // Reset food when it goes off screen or was eaten
          if (newY > 500 || food.scale === 0) {
            newFood = {
              ...food,
              y: -50,
              x: Math.random() * (containerWidth - 50),
              emoji: getRandomFood(),
              scale: 1,
              speed: 1.5 + Math.random() * 1.5
            };
          }

          // Check collision when food is at plate level and not eaten yet
          if (newY >= plateY - 25 && newY <= plateY + 25 && food.scale === 1) {
            const foodRight = food.x + 50;
            const plateLeft = plateX;
            const plateRight = plateX + 80;

            // Check if food hits the plate (with some tolerance)
            if (foodRight >= plateLeft && food.x <= plateRight) {
              // Mark food as eaten
              newFood.scale = 0;
              
              // Play sound and update score
              setTimeout(() => {
                if (GOOD_FOODS.includes(food.emoji)) {
                  try {
                    let winGame = new Audio(winSound);
                    winGame.loop = false;
                    winGame.volume = 0.3;
                    winGame.play().catch(() => {});
                  } catch (e) {}
                  
                  setScore(prev => prev + 1);
                } else {
                  try {
                    let lose = new Audio(loseSound);
                    lose.loop = false;
                    lose.volume = 0.3;
                    lose.play().catch(() => {});
                  } catch (e) {}
                  
                  setLives(prev => Math.max(0, prev - 1));
                }
              }, 100);
            }
          }

          return newFood;
        });
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameStarted, plateX, containerWidth, winSound, loseSound]);

  // Game over check
  useEffect(() => {
    if (lives <= 0 && gameStarted) {
      setGameStarted(false);
      
      // Trigger game complete callback with final score
      if (onGameComplete) {
        onGameComplete(score);
      }
    }
  }, [lives, gameStarted, score, onGameComplete]);

  // Update score callback
  useEffect(() => {
    if (onScoreUpdate && gameStarted) {
      onScoreUpdate(score);
    }
  }, [score, gameStarted, onScoreUpdate]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setLives(3);
    
    // Reset foods with pixel-based coordinates
    const width = containerWidth || 400;
    setFoods([
      { id: 1, emoji: getRandomFood(), x: 50, y: -50, scale: 1, speed: 2 },
      { id: 2, emoji: getRandomFood(), x: Math.random() * (width - 50), y: -100, scale: 1, speed: 2.5 },
      { id: 3, emoji: getRandomFood(), x: Math.random() * (width - 50), y: -150, scale: 1, speed: 2 }
    ]);
  };

  const resetGame = () => {
    setGameStarted(false);
    setScore(0);
    setLives(3);
    setPlateX(200);
  };

  return (
    <GameWrapper ref={gameRef} onMouseMove={handleMouseMove}>
      <GameArea>
        {!gameStarted && (
          <InstructionText>
            🍽️ Catch the good food! Avoid the fire! 🔥
          </InstructionText>
        )}

        {gameStarted && (
          <ScoreDisplay>
            Score: {score} | Lives: {"❤️".repeat(lives)}
          </ScoreDisplay>
        )}

        <Plate x={plateX}>🍽️</Plate>

        {/* Render falling foods */}
        {foods.map(food => (
          <FallingFood
            key={food.id}
            emoji={food.emoji}
            x={food.x}
            y={food.y}
            scale={food.scale}
          >
            {food.emoji}
          </FallingFood>
        ))}

        {!gameStarted && lives > 0 && (
          <>
            <ExampleContainer>
              <div style={{ fontSize: '16px', fontFamily: 'Amatic SC', color: '#8B0000', textAlign: 'center' }}>
                Catch Good Food • Avoid Fire
              </div>
              
              <FoodExamples>
                <ExampleFood>🍔</ExampleFood>
                <ExampleFood>🍕</ExampleFood>
                <ExampleFood>🌯</ExampleFood>
                <ExampleFood>🍩</ExampleFood>
              </FoodExamples>
              
              <div style={{ fontSize: '24px', color: '#8B0000' }}>VS</div>
              
              <ExampleFood style={{ fontSize: '40px' }}>🔥</ExampleFood>
              
              <IndicatorContainer>
                <Indicator>✅</Indicator>
                <Indicator>❌</Indicator>
              </IndicatorContainer>
            </ExampleContainer>

            <StartButton onClick={startGame}>
              🚀 Start Game
            </StartButton>
          </>
        )}

        {!gameStarted && lives <= 0 && (
          <ExampleContainer>
            <div style={{ fontSize: '24px', fontFamily: 'Amatic SC', color: '#8B0000', textAlign: 'center' }}>
              Game Over!
            </div>
            <div style={{ fontSize: '20px', fontFamily: 'Amatic SC', color: '#8B0000' }}>
              Final Score: {score}
            </div>
            <StartButton onClick={resetGame} style={{ position: 'relative', bottom: 'auto', left: 'auto', transform: 'none', marginTop: '15px' }}>
              🔄 Play Again
            </StartButton>
          </ExampleContainer>
        )}
      </GameArea>
    </GameWrapper>
  );
}