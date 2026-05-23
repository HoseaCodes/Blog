import React, { createContext, useContext, useState, useEffect } from 'react';

const GameScoreContext = createContext();

export const useGameScore = () => {
  const context = useContext(GameScoreContext);
  if (!context) {
    throw new Error('useGameScore must be used within a GameScoreProvider');
  }
  return context;
};

export const GameScoreProvider = ({ children }) => {
  // Initialize state from localStorage to avoid losing data on navigation
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('gameScores');
    return saved ? JSON.parse(saved) : {};
  });

  const [totalScore, setTotalScore] = useState(() => {
    const saved = localStorage.getItem('totalScore');
    return saved ? JSON.parse(saved) : 0;
  });

  const [highScores, setHighScores] = useState(() => {
    const saved = localStorage.getItem('highScores');
    return saved ? JSON.parse(saved) : [];
  });

  // Save scores to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('gameScores', JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }, [highScores]);

  useEffect(() => {
    localStorage.setItem('totalScore', JSON.stringify(totalScore));
  }, [totalScore]);

  // Update score for a specific game
  const updateGameScore = (gameId, gameName, newScore, gameTime) => {
    setScores((prevScores) => {
      const currentGameScores = prevScores[gameId] || {
        gameName,
        highScore: 0,
        totalPlays: 0,
        averageScore: 0,
        bestTime: null,
        lastPlayed: null,
      };

      const updatedGameScores = {
        gameName,
        highScore: Math.max(currentGameScores.highScore, newScore),
        totalPlays: currentGameScores.totalPlays + 1,
        averageScore:
          (currentGameScores.averageScore * currentGameScores.totalPlays + newScore) /
          (currentGameScores.totalPlays + 1),
        bestTime:
          currentGameScores.bestTime === null
            ? gameTime
            : Math.min(currentGameScores.bestTime, gameTime),
        lastPlayed: new Date().toISOString(),
      };

      const updatedScores = {
        ...prevScores,
        [gameId]: updatedGameScores,
      };

      // Recalculate total score based on all high scores
      const newTotal = Object.values(updatedScores).reduce((sum, game) => sum + (game.highScore || 0), 0);
      setTotalScore(newTotal);

      return updatedScores;
    });

    // Update high scores leaderboard
    updateHighScores(gameId, gameName, newScore, gameTime);
  };

  // Update high scores leaderboard (top 10 across all games)
  const updateHighScores = (gameId, gameName, score, time) => {
    const newEntry = {
      gameId,
      gameName,
      score,
      time,
      date: new Date().toISOString(),
    };

    setHighScores((prevHighScores) => {
      const updatedScores = [...prevHighScores, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 20); // Keep top 20 scores
      return updatedScores;
    });
  };

  // Get specific game stats
  const getGameStats = (gameId) => {
    return scores[gameId] || null;
  };

  // Get leaderboard for a specific game
  const getGameLeaderboard = (gameId) => {
    return highScores
      .filter((entry) => entry.gameId === gameId)
      .slice(0, 10);
  };

  // Get all-time high scores across all games
  const getAllTimeHighScores = () => {
    return highScores.slice(0, 10);
  };

  // Reset all scores
  const resetAllScores = () => {
    setScores({});
    setTotalScore(0);
    setHighScores([]);
    localStorage.removeItem('gameScores');
    localStorage.removeItem('highScores');
    localStorage.removeItem('totalScore');
  };

  // Reset scores for a specific game
  const resetGameScores = (gameId) => {
    setScores((prevScores) => {
      const updatedScores = { ...prevScores };
      delete updatedScores[gameId];
      
      // Recalculate total score based on remaining games
      const newTotal = Object.values(updatedScores).reduce((sum, game) => sum + (game.highScore || 0), 0);
      setTotalScore(newTotal);
      
      return updatedScores;
    });

    setHighScores((prevHighScores) => {
      return prevHighScores.filter((entry) => entry.gameId !== gameId);
    });
  };

  const value = {
    scores,
    totalScore,
    highScores,
    updateGameScore,
    getGameStats,
    getGameLeaderboard,
    getAllTimeHighScores,
    resetAllScores,
    resetGameScores,
  };

  return (
    <GameScoreContext.Provider value={value}>
      {children}
    </GameScoreContext.Provider>
  );
};
