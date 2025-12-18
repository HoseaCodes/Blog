import React, { useState } from "react";
import styled from "styled-components";
import { useGameScore } from "../../Context/GameScoreContext";

const HighScores = () => {
  const { highScores, getAllTimeHighScores, totalScore, scores, resetAllScores } = useGameScore();
  const [view, setView] = useState("all"); // 'all' or 'personal'

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const allTimeHighScores = getAllTimeHighScores();

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all scores? This cannot be undone.")) {
      resetAllScores();
    }
  };

  return (
    <Container>
      <Header>
        <Title>High Scores</Title>
        <TotalScore>
          Total Score: <Highlight>{totalScore.toLocaleString()}</Highlight>
        </TotalScore>
      </Header>

      <ViewTabs>
        <Tab active={view === "all"} onClick={() => setView("all")}>
          All-Time Best
        </Tab>
        <Tab active={view === "personal"} onClick={() => setView("personal")}>
          Your Stats
        </Tab>
      </ViewTabs>

      {view === "all" ? (
        <ScoresList>
          {allTimeHighScores.length === 0 ? (
            <EmptyState>No scores yet. Start playing to set records!</EmptyState>
          ) : (
            allTimeHighScores.map((entry, index) => (
              <ScoreCard key={`${entry.gameId}-${entry.date}-${index}`} rank={index + 1}>
                <Rank rank={index + 1}>#{index + 1}</Rank>
                <ScoreInfo>
                  <GameName>{entry.gameName}</GameName>
                  <ScoreDetails>
                    <Score>{entry.score.toLocaleString()} pts</Score>
                    <Time>{formatTime(entry.time)}</Time>
                    <Date>{formatDate(entry.date)}</Date>
                  </ScoreDetails>
                </ScoreInfo>
                {index < 3 && <Medal rank={index + 1}>{["🥇", "🥈", "🥉"][index]}</Medal>}
              </ScoreCard>
            ))
          )}
        </ScoresList>
      ) : (
        <PersonalStats>
          {Object.keys(scores).length === 0 ? (
            <EmptyState>No personal stats yet. Start playing!</EmptyState>
          ) : (
            Object.entries(scores).map(([gameId, stats]) => (
              <StatCard key={gameId}>
                <StatCardHeader>
                  <GameName>{stats.gameName}</GameName>
                  <Plays>{stats.totalPlays} plays</Plays>
                </StatCardHeader>
                <StatGrid>
                  <StatItem>
                    <StatLabel>High Score</StatLabel>
                    <StatValue>{stats.highScore.toLocaleString()}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Average</StatLabel>
                    <StatValue>{Math.round(stats.averageScore).toLocaleString()}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Best Time</StatLabel>
                    <StatValue>{formatTime(stats.bestTime || 0)}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Last Played</StatLabel>
                    <StatValue>{formatDate(stats.lastPlayed)}</StatValue>
                  </StatItem>
                </StatGrid>
              </StatCard>
            ))
          )}
        </PersonalStats>
      )}

      {(allTimeHighScores.length > 0 || Object.keys(scores).length > 0) && (
        <ResetButton onClick={handleReset}>Reset All Scores</ResetButton>
      )}
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  background: #2a2a2a;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const TotalScore = styled.div`
  font-size: 1.25rem;
  color: #cccccc;
  font-weight: 500;
`;

const Highlight = styled.span`
  color: #9922ff;
  font-weight: 700;
  font-size: 1.5rem;
`;

const ViewTabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #3a3a3a;
`;

const Tab = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: none;
  color: ${(props) => (props.active ? "#9922ff" : "#888888")};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;

  &:hover {
    color: ${(props) => (props.active ? "#9922ff" : "#cccccc")};
  }

  ${(props) =>
    props.active &&
    `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      right: 0;
      height: 2px;
      background: #9922ff;
    }
  `}
`;

const ScoresList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1f1f1f;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;

    &:hover {
      background: #5a5a5a;
    }
  }
`;

const ScoreCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: ${(props) => {
    if (props.rank === 1) return "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)";
    if (props.rank === 2) return "linear-gradient(135deg, #C0C0C0 0%, #999999 100%)";
    if (props.rank === 3) return "linear-gradient(135deg, #CD7F32 0%, #8B4513 100%)";
    return "#1f1f1f";
  }};
  border-radius: 12px;
  border: 2px solid ${(props) => (props.rank <= 3 ? "transparent" : "#3a3a3a")};
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    border-color: #9922ff;
  }
`;

const Rank = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${(props) => {
    if (props.rank === 1) return "#000000";
    if (props.rank === 2) return "#000000";
    if (props.rank === 3) return "#FFFFFF";
    return "#9922ff";
  }};
  min-width: 50px;
  text-align: center;
`;

const ScoreInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const GameName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${(props) => props.isDark ? "#000000" : "#ffffff"};
`;

const ScoreDetails = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const Score = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #9922ff;
`;

const Time = styled.span`
  font-size: 0.9rem;
  color: #888888;
`;

const Date = styled.span`
  font-size: 0.9rem;
  color: #888888;
`;

const Medal = styled.div`
  font-size: 2rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #888888;
  font-size: 1.1rem;
`;

const PersonalStats = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1f1f1f;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #4a4a4a;
    border-radius: 4px;

    &:hover {
      background: #5a5a5a;
    }
  }
`;

const StatCard = styled.div`
  background: #1f1f1f;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #3a3a3a;
  transition: all 0.3s ease;

  &:hover {
    border-color: #9922ff;
    transform: translateY(-2px);
  }
`;

const StatCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #3a3a3a;
`;

const Plays = styled.span`
  font-size: 0.9rem;
  color: #888888;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  color: #888888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #9922ff;
`;

const ResetButton = styled.button`
  margin-top: 2rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #ff4444;
  border: 2px solid #ff4444;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: #ff4444;
    color: #ffffff;
  }
`;

export default HighScores;
