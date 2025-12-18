import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { ReactComponent as Arrow } from "./image/arrow.svg";
import games from "../../Constants/games";
import { useGameScore } from "../../Context/GameScoreContext";

const GamePage = () => {
  const params = useParams();
  const {
    updateGameScore,
    getGameStats,
    getGameLeaderboard,
    totalScore,
  } = useGameScore();
  
  const [currentGame, setCurrentGame] = useState(null);
  const [gameType, setGameType] = useState("default");
  const [difficulty, setDifficulty] = useState("medium");
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [mistakesMode, setMistakesMode] = useState(true);
  const [fastMode, setFastMode] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameStats, setGameStats] = useState(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (params.id) {
      const game = games.find((game) => game.id == params.id);
      if (game) {
        setCurrentGame(game);
        // Determine game type based on game surname
        if (game.surname === "sudoku") {
          setGameType("sudoku");
        } else {
          setGameType("default");
        }
        
        // Load game stats
        const stats = getGameStats(game.id);
        setGameStats(stats);
      }
    }
  }, [params.id, getGameStats]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartGame = () => {
    setIsTimerRunning(true);
    setTimer(0);
    setScore(0);
    setIsGameComplete(false);
    setGameStarted(true);
  };

  const handleNewGame = () => {
    setTimer(0);
    setScore(0);
    setIsTimerRunning(true);
    setIsGameComplete(false);
    setGameStarted(true);
  };

  const handleGameComplete = (finalScore) => {
    setIsTimerRunning(false);
    setIsGameComplete(true);
    
    if (currentGame) {
      updateGameScore(currentGame.id, currentGame.name, finalScore, timer);
      // Refresh stats
      const stats = getGameStats(currentGame.id);
      setGameStats(stats);
    }
  };

  const handleScoreUpdate = (newScore) => {
    setScore(newScore);
  };

  // Wrapper function to inject props into game components
  const createGameWithProps = () => {
    if (!currentGame) return null;

    const gameProps = {
      onScoreUpdate: handleScoreUpdate,
      onGameComplete: handleGameComplete,
      onTimerUpdate: setTimer,
      gameStarted: gameStarted,
      isTimerRunning: isTimerRunning,
      soundEnabled: soundEnabled,
      musicEnabled: musicEnabled,
      mistakesMode: mistakesMode,
      fastMode: fastMode,
      difficulty: gameType === "sudoku" ? difficulty : undefined,
    };

    // For Sudoku - it has a provider wrapper
    if (gameType === "sudoku") {
      return React.cloneElement(currentGame.link, gameProps);
    }

    // For other games - pass props directly
    return React.cloneElement(currentGame.link, gameProps);
  };

  const handleNumberInput = (num) => {
    // Logic for number input in Sudoku
    console.log(`Number ${num} clicked`);
  };

  const handleUndo = () => {
    console.log("Undo clicked");
  };

  const handleErase = () => {
    console.log("Erase clicked");
  };

  const handleHint = () => {
    console.log("Hint clicked");
  };

  // Render game-specific controls
  const renderControls = () => {
    if (gameType === "sudoku") {
      return (
        <ControlsPanel>
          {gameStats && (
            <StatsSection>
              <StatRow>
                <StatLabel>High Score:</StatLabel>
                <StatValue>{gameStats.highScore}</StatValue>
              </StatRow>
              <StatRow>
                <StatLabel>Games Played:</StatLabel>
                <StatValue>{gameStats.totalPlays}</StatValue>
              </StatRow>
              <StatRow>
                <StatLabel>Best Time:</StatLabel>
                <StatValue>{formatTime(gameStats.bestTime || 0)}</StatValue>
              </StatRow>
            </StatsSection>
          )}
          
          <TopRow>
            <NewGameButton onClick={handleNewGame}>New Game</NewGameButton>
            <DifficultySelect 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </DifficultySelect>
          </TopRow>

          <TimerDisplay>{formatTime(timer)}</TimerDisplay>
          <ScoreDisplay>Score: {score}</ScoreDisplay>

          <NumberPad>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <NumberButton key={num} onClick={() => handleNumberInput(num)}>
                {num}
              </NumberButton>
            ))}
          </NumberPad>

          <ActionButtonsRow>
            <ActionButton onClick={handleUndo}>Undo</ActionButton>
            <ActionButton onClick={handleErase}>Erase</ActionButton>
            <ActionButton onClick={handleHint}>Hint</ActionButton>
          </ActionButtonsRow>

          <TogglesContainer>
            <ToggleRow>
              <ToggleLabel>Mistakes Mode</ToggleLabel>
              <ToggleSwitch
                active={mistakesMode}
                onClick={() => setMistakesMode(!mistakesMode)}
              >
                <ToggleSlider active={mistakesMode} />
              </ToggleSwitch>
            </ToggleRow>
            <ToggleRow>
              <ToggleLabel>Fast Mode</ToggleLabel>
              <ToggleSwitch
                active={fastMode}
                onClick={() => setFastMode(!fastMode)}
              >
                <ToggleSlider active={fastMode} />
              </ToggleSwitch>
            </ToggleRow>
          </TogglesContainer>
        </ControlsPanel>
      );
    }

    // Default controls for all other games
    return (
      <ControlsPanel>
        {gameStats && (
          <StatsSection>
            <StatRow>
              <StatLabel>High Score:</StatLabel>
              <StatValue>{gameStats.highScore}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Games Played:</StatLabel>
              <StatValue>{gameStats.totalPlays}</StatValue>
            </StatRow>
            <StatRow>
              <StatLabel>Avg Score:</StatLabel>
              <StatValue>{Math.round(gameStats.averageScore)}</StatValue>
            </StatRow>
          </StatsSection>
        )}
        
        <StartGameButton onClick={handleStartGame}>Start Game</StartGameButton>

        <StatsRow>
          <StatItem>
            <StatLabel>Score</StatLabel>
            <StatValue>{score}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>Time</StatLabel>
            <StatValue>{formatTime(timer)}</StatValue>
          </StatItem>
        </StatsRow>
        
        {isGameComplete && (
          <GameCompleteMessage>
            Game Complete! Final Score: {score}
          </GameCompleteMessage>
        )}

        <SettingsContainer>
          <ToggleRow>
            <ToggleLabel>Sound FX</ToggleLabel>
            <ToggleSwitch
              active={soundEnabled}
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              <ToggleSlider active={soundEnabled} />
            </ToggleSwitch>
          </ToggleRow>
          <ToggleRow>
            <ToggleLabel>Music</ToggleLabel>
            <ToggleSwitch
              active={musicEnabled}
              onClick={() => setMusicEnabled(!musicEnabled)}
            >
              <ToggleSlider active={musicEnabled} />
            </ToggleSwitch>
          </ToggleRow>
        </SettingsContainer>
      </ControlsPanel>
    );
  };

  return (
    <PageContainer>
      <Header>
        <HeaderTop>
          <BackLink to="/gamecorner/browser">
            <BackArrow />
            Store
          </BackLink>
          <TotalScoreDisplay>
            Overall Score: <TotalScoreValue>{totalScore.toLocaleString()}</TotalScoreValue>
          </TotalScoreDisplay>
        </HeaderTop>
        <GameTitle>{currentGame ? currentGame.name : "Game"}</GameTitle>
      </Header>

      <MainContent>
        <GameArea>
          <GameContainer>
            {createGameWithProps()}
          </GameContainer>
        </GameArea>

        {renderControls()}
      </MainContent>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: #1a1a1a;
  color: #ffffff;
  padding: 2rem;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TotalScoreDisplay = styled.div`
  font-size: 1.1rem;
  color: #cccccc;
  font-weight: 500;
`;

const TotalScoreValue = styled.span`
  color: #9922ff;
  font-weight: 700;
  font-size: 1.3rem;
  margin-left: 0.5rem;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #cccccc;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: color 0.3s ease;

  &:hover {
    color: #9922ff;
  }
`;

const BackArrow = styled(Arrow)`
  width: 20px;
  height: 20px;
  fill: currentColor;
`;

const GameTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
`;

const MainContent = styled.section`
  display: flex;
  gap: 2rem;
  align-items: flex-start;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const GameArea = styled.div`
  flex: 0 0 60%;
  background: #2a2a2a;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);

  @media (max-width: 1024px) {
    flex: 1;
    width: 100%;
  }
`;

const GameContainer = styled.div`
  width: 100%;
  min-height: 500px;
  background: #1f1f1f;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const ControlsPanel = styled.div`
  flex: 0 0 38%;
  background: #2a2a2a;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    flex: 1;
    width: 100%;
  }
`;

const TopRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const NewGameButton = styled.button`
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: #9922ff;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #7711dd;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(153, 34, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DifficultySelect = styled.select`
  flex: 1;
  padding: 0.875rem 1rem;
  background: #3a3a3a;
  color: #ffffff;
  border: 2px solid #4a4a4a;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #9922ff;
  }

  &:focus {
    outline: none;
    border-color: #9922ff;
    box-shadow: 0 0 0 3px rgba(153, 34, 255, 0.2);
  }

  option {
    background: #2a2a2a;
  }
`;

const TimerDisplay = styled.div`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  color: #9922ff;
  padding: 1.5rem;
  background: #1f1f1f;
  border-radius: 12px;
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
`;

const NumberPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`;

const NumberButton = styled.button`
  aspect-ratio: 1;
  padding: 1.5rem;
  background: #3a3a3a;
  color: #ffffff;
  border: 2px solid #4a4a4a;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #4a4a4a;
    border-color: #9922ff;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const ActionButtonsRow = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.875rem;
  background: #3a3a3a;
  color: #ffffff;
  border: 2px solid #4a4a4a;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #4a4a4a;
    border-color: #9922ff;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TogglesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.5rem;
`;

const ToggleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ToggleLabel = styled.span`
  font-size: 1rem;
  font-weight: 500;
  color: #cccccc;
`;

const ToggleSwitch = styled.button`
  width: 56px;
  height: 28px;
  background: ${(props) => (props.active ? "#9922ff" : "#4a4a4a")};
  border: none;
  border-radius: 14px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
  padding: 0;

  &:hover {
    background: ${(props) => (props.active ? "#7711dd" : "#5a5a5a")};
  }
`;

const ToggleSlider = styled.div`
  width: 22px;
  height: 22px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: ${(props) => (props.active ? "31px" : "3px")};
  transition: left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const StartGameButton = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: #9922ff;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  &:hover {
    background: #7711dd;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(153, 34, 255, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatItem = styled.div`
  flex: 1;
  background: #1f1f1f;
  border-radius: 12px;
  padding: 1.25rem;
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #888888;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #9922ff;
  font-variant-numeric: tabular-nums;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #3a3a3a;
`;

const StatsSection = styled.div`
  background: #1f1f1f;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid #3a3a3a;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScoreDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: #ffffff;
  padding: 1rem;
  background: #1f1f1f;
  border-radius: 8px;
`;

const GameCompleteMessage = styled.div`
  background: linear-gradient(135deg, #9922ff 0%, #7711dd 100%);
  color: #ffffff;
  padding: 1.25rem;
  border-radius: 12px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  animation: slideIn 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(153, 34, 255, 0.4);

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export default GamePage;
