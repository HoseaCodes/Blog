import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";

// Import your SVGs here - you'll need to update these paths
import animal from "../../SVG/animal-kingdom-coati-svgrepo-com.svg";
import arrow from "../../SVG/arrow-svgrepo-com.svg";
import axe from "../../SVG/axe-svgrepo-com.svg";
import bomb from "../../SVG/fuse-weapon-svgrepo-com.svg";
import cross from "../../SVG/cancel-svgrepo-com.svg";
import mouse from "../../SVG/computer-mouse-with-wheel.svg";

const ScrollGame = ({ gameStarted, isTimerRunning, soundEnabled, musicEnabled, onScoreUpdate, onGameComplete }) => {
  const ding = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/ding.wav";
  const ugh = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/ugh.wav";

  // Game state
  const [isPaused, setIsPaused] = useState(true);
  const [positionY, setPositionY] = useState(40);
  const [arrowPositionX, setArrowPositionX] = useState(0);
  const [arrowPositionY, setArrowPositionY] = useState(20);
  const [axePositionX, setAxePositionX] = useState(-40);
  const [axePositionY, setAxePositionY] = useState(60);
  const [bombPositionX, setBombPositionX] = useState(-80);
  const [bombPositionY, setBombPositionY] = useState(60);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [lastHitTime, setLastHitTime] = useState(0);

  // Animation frame references
  const animationRefs = useRef({
    arrow: null,
    axe: null,
    bomb: null
  });

  // Ref for the game container to handle focus
  const gameContainerRef = useRef(null);

  // Reset game when gameStarted prop changes to true
  useEffect(() => {
    if (gameStarted) {
      // Reset all game state
      setLives(3);
      setScore(0);
      setPositionY(40);
      setArrowPositionX(0);
      setArrowPositionY(Math.random() * 90);
      setAxePositionX(-40);
      setAxePositionY(Math.random() * 90);
      setBombPositionX(-80);
      setBombPositionY(Math.random() * 90);
      setLastHitTime(0);
    }
  }, [gameStarted]);

  // Start/pause game based on gameStarted prop
  useEffect(() => {
    if (gameStarted) {
      setIsPaused(false);
    } else if (!isTimerRunning) {
      setIsPaused(true);
    }
  }, [gameStarted, isTimerRunning]);

  // Arrow animation
  useEffect(() => {
    if (!isPaused && lives > 0) {
      const animate = () => {
        setArrowPositionX(prevX => {
          if (prevX < 100) {
            return prevX + 1;
          } else {
            setArrowPositionY(Math.random() * 90);
            return -10;
          }
        });
        animationRefs.current.arrow = requestAnimationFrame(animate);
      };
      animationRefs.current.arrow = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRefs.current.arrow) {
        cancelAnimationFrame(animationRefs.current.arrow);
      }
    };
  }, [isPaused, lives]);

  // Axe animation
  useEffect(() => {
    if (!isPaused && lives > 0) {
      const animate = () => {
        setAxePositionX(prevX => {
          if (prevX < 100) {
            return prevX + 1;
          } else {
            setAxePositionY(Math.random() * 90);
            return -10;
          }
        });
        animationRefs.current.axe = requestAnimationFrame(animate);
      };
      animationRefs.current.axe = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRefs.current.axe) {
        cancelAnimationFrame(animationRefs.current.axe);
      }
    };
  }, [isPaused, lives]);

  // Bomb animation
  useEffect(() => {
    if (!isPaused && lives > 0) {
      const animate = () => {
        setBombPositionX(prevX => {
          if (prevX < 100) {
            return prevX + 1;
          } else {
            setBombPositionY(Math.random() * 90);
            return -10;
          }
        });
        animationRefs.current.bomb = requestAnimationFrame(animate);
      };
      animationRefs.current.bomb = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRefs.current.bomb) {
        cancelAnimationFrame(animationRefs.current.bomb);
      }
    };
  }, [isPaused, lives]);

  // Collision detection for arrow
  useEffect(() => {
    if (
      arrowPositionX === 90 &&
      arrowPositionY - positionY >= -10 &&
      arrowPositionY - positionY <= 10
    ) {
      // Hit detected
      const now = Date.now();
      if (now - lastHitTime > 500) { // Debounce to avoid multiple hits in quick succession
        setLastHitTime(now);
        let loseSound = new Audio(ugh);
        loseSound.loop = false;
        if (soundEnabled) loseSound.play();
        
        setLives(prevLives => {
          if (prevLives > 0) {
            const newLives = Math.max(0, prevLives - 1);
            if (newLives === 0) {
              setIsPaused(true);
              if (onGameComplete) onGameComplete(score);
            }
            return newLives;
          }
          return prevLives;
        });
      }
    } else if (arrowPositionX === 90) {
      let winSound = new Audio(ding);
      winSound.loop = false;
      if (soundEnabled) winSound.play();
      setScore(prevScore => prevScore + 10);
      if (onScoreUpdate) onScoreUpdate(score + 10);
    }
  }, [arrowPositionX, arrowPositionY, positionY, lastHitTime, soundEnabled, score, onScoreUpdate, onGameComplete]);

  // Collision detection for axe
  useEffect(() => {
    if (
      axePositionX === 90 &&
      axePositionY - positionY >= -10 &&
      axePositionY - positionY <= 10
    ) {
      // Hit detected
      const now = Date.now();
      if (now - lastHitTime > 500) {
        setLastHitTime(now);
        let loseSound = new Audio(ugh);
        loseSound.loop = false;
        if (soundEnabled) loseSound.play();
        
        setLives(prevLives => {
          if (prevLives > 0) {
            const newLives = Math.max(0, prevLives - 1);
            if (newLives === 0) {
              setIsPaused(true);
              if (onGameComplete) onGameComplete(score);
            }
            return newLives;
          }
          return prevLives;
        });
      }
    } else if (axePositionX === 90) {
      let winSound = new Audio(ding);
      winSound.loop = false;
      if (soundEnabled) winSound.play();
      setScore(prevScore => prevScore + 10);
      if (onScoreUpdate) onScoreUpdate(score + 10);
    }
  }, [axePositionX, axePositionY, positionY, lastHitTime, soundEnabled, score, onScoreUpdate, onGameComplete]);

  // Collision detection for bomb
  useEffect(() => {
    if (
      bombPositionX === 90 &&
      bombPositionY - positionY >= -10 &&
      bombPositionY - positionY <= 10
    ) {
      // Hit detected
      const now = Date.now();
      if (now - lastHitTime > 500) {
        setLastHitTime(now);
        let loseSound = new Audio(ugh);
        loseSound.loop = false;
        if (soundEnabled) loseSound.play();
        
        setLives(prevLives => {
          if (prevLives > 0) {
            const newLives = Math.max(0, prevLives - 1);
            if (newLives === 0) {
              setIsPaused(true);
              if (onGameComplete) onGameComplete(score);
            }
            return newLives;
          }
          return prevLives;
        });
      }
    } else if (bombPositionX === 90) {
      let winSound = new Audio(ding);
      winSound.loop = false;
      if (soundEnabled) winSound.play();
      setScore(prevScore => prevScore + 10);
      if (onScoreUpdate) onScoreUpdate(score + 10);
    }
  }, [bombPositionX, bombPositionY, positionY, lastHitTime, soundEnabled, score, onScoreUpdate, onGameComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isPaused || lives <= 0) return;
      
      switch (e.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          e.preventDefault();
          setPositionY(prev => Math.max(0, prev - 2));
          break;
        case 's':
        case 'arrowdown':
          e.preventDefault();
          setPositionY(prev => Math.min(83, prev + 2));
          break;
      }
    };

    // Add event listener to the document
    document.addEventListener('keydown', handleKeyDown);

    // Focus the game container when component mounts
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused, lives]);

  const handleScroll = (e) => {
    if (e.nativeEvent.wheelDelta > 0 && positionY > 0) {
      setPositionY(positionY - 1);
    } else if (e.nativeEvent.wheelDelta < 0 && positionY < 83) {
      setPositionY(positionY + 1);
    }
  };

  const handleClick = () => {
    // If game is over (lives = 0), restart the game
    if (lives === 0) {
      setLives(3);
      setScore(0);
      setPositionY(40);
      setArrowPositionX(0);
      setArrowPositionY(Math.random() * 90);
      setAxePositionX(-40);
      setAxePositionY(Math.random() * 90);
      setBombPositionX(-80);
      setBombPositionY(Math.random() * 90);
      setLastHitTime(0);
      setIsPaused(false);
      
      // Focus the game container for keyboard input
      if (gameContainerRef.current) {
        gameContainerRef.current.focus();
      }
      
      // Set game duration to 8.5 seconds
      setTimeout(() => {
        setIsPaused(true);
      }, 8500);
    } else if (isPaused && lives > 0) {
      setIsPaused(false);
      
      // Focus the game container for keyboard input
      if (gameContainerRef.current) {
        gameContainerRef.current.focus();
      }
      
      // Set game duration to 8.5 seconds
      setTimeout(() => {
        setIsPaused(true);
      }, 8500);
    }
  };

  const togglePause = (e) => {
    e.stopPropagation();
    if (lives > 0) {
      setIsPaused(!isPaused);
    }
  };

  return (
    <GameContainer
      ref={gameContainerRef}
      tabIndex={0}
      onWheel={handleScroll}
      onClick={handleClick}
    >
      <HeaderBar>
        <LivesDisplay>❤️ Lives: {lives}</LivesDisplay>
        <ScoreDisplay>Score: {score}</ScoreDisplay>
        {lives > 0 && (
          <PauseButton onClick={togglePause}>
            {isPaused ? '▶ Resume' : '⏸ Pause'}
          </PauseButton>
        )}
      </HeaderBar>

      {isPaused && (
        <InstructionText>
          {lives <= 0 
            ? "Game Over! Final Score: " + score
            : "use scroll wheel, trackpad, W/S keys, or arrow keys to move animal. avoid everything. click to start"
          }
        </InstructionText>
      )}

      <Animal
        style={{ top: `${positionY}%` }}
        src={animal}
        alt="Player character"
      />

      <Projectile
        className="arrow"
        style={{ right: `${arrowPositionX}%`, top: `${arrowPositionY}%` }}
        src={arrow}
        alt="Arrow projectile"
      />

      <Projectile
        className="axe"
        style={{ right: `${axePositionX}%`, top: `${axePositionY}%` }}
        src={axe}
        alt="Axe projectile"
      />

      <Projectile
        className="bomb"
        style={{ right: `${bombPositionX}%`, top: `${bombPositionY}%` }}
        src={bomb}
        alt="Bomb projectile"
      />

      {isPaused && lives > 0 && (
        <UIContainer>
          <ExampleContainer>
            <CrossIcon src={cross} alt="Avoid these" />
            <FoodContainer>
              <ExampleFood src={arrow} alt="Arrow" />
              <ExampleFood src={axe} alt="Axe" />
              <ExampleFood src={bomb} alt="Bomb" />
            </FoodContainer>
          </ExampleContainer>
          <MouseIcon src={mouse} alt="Use mouse wheel" />
        </UIContainer>
      )}
    </GameContainer>
  );
};

// Styled Components
const GameContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 500px;
  background: linear-gradient(135deg, #ffd966 0%, #ffed4e 100%);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 12px;
  user-select: none;
  outline: none;
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(153, 34, 255, 0.5);
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(153, 34, 255, 0.5);
  }
`;

const HeaderBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  z-index: 50;
  font-weight: bold;
  font-size: 1.1rem;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
`;

const LivesDisplay = styled.div`
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 1.3rem;
  color: #ff6b6b;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const ScoreDisplay = styled.div`
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 1.3rem;
  color: #4ecdc4;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`;

const PauseButton = styled.button`
  background: rgba(255, 100, 80, 0.9);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 80, 60, 1);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const InstructionText = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Comic Sans MS', cursive, sans-serif;
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 3px solid #e74c3c;
  z-index: 100;
  max-width: 80%;
  line-height: 1.4;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); }
    50% { transform: translate(-50%, -50%) scale(1.05); }
  }
`;

const Animal = styled.img`
  position: absolute;
  left: 10%;
  width: 60px;
  height: 60px;
  z-index: 10;
  transition: top 0.1s ease-out;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
`;

const Projectile = styled.img`
  position: absolute;
  width: 40px;
  height: 40px;
  z-index: 5;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.3));
  
  &.arrow {
    width: 45px;
    height: 20px;
  }
  
  &.axe {
    width: 35px;
    height: 35px;
  }
  
  &.bomb {
    width: 30px;
    height: 30px;
  }
`;

const UIContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 2rem;
  pointer-events: none;
`;

const ExampleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #e74c3c;
`;

const CrossIcon = styled.img`
  width: 40px;
  height: 40px;
  filter: hue-rotate(0deg) saturate(1.5);
`;

const FoodContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ExampleFood = styled.img`
  width: 30px;
  height: 30px;
  opacity: 0.8;
`;

const MouseIcon = styled.img`
  width: 50px;
  height: 50px;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid #3498db;
`;

export default ScrollGame;