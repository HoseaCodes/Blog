import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useGameScore } from '../../Context/GameScoreContext';

const pulse = keyframes`
  0%   { transform: scale(1); }
  35%  { transform: scale(1.18); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0%   { opacity: 0; transform: translateY(4px); }
  20%  { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-14px); }
`;

const Wrap = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px 6px 14px;
  border-radius: 9999px;
  background: linear-gradient(180deg, rgba(91, 179, 158, 0.18), rgba(32, 106, 93, 0.18));
  border: 1px solid rgba(91, 179, 158, 0.35);
  color: #f4f6f8;
  font-family: "Lato", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  user-select: none;
  box-shadow: 0 4px 14px rgba(32, 106, 93, 0.25);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.1s;
  &:hover {
    border-color: rgba(91, 179, 158, 0.6);
    box-shadow: 0 6px 18px rgba(32, 106, 93, 0.4);
  }
  &:active {
    transform: scale(0.97);
  }
  ${(p) =>
    p.$bump &&
    css`
      animation: ${pulse} 0.55s ease;
    `}
`;

const Plus = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(91, 179, 158, 0.25);
  color: #f4f6f8;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  margin-left: 4px;
`;

const Coin = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffe9a3, #d9a52f 60%, #8b6716 100%);
  color: #5a3e08;
  font-size: 10px;
  font-weight: 900;
  box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.2);
`;

const Delta = styled.span`
  position: absolute;
  right: 0;
  top: -18px;
  color: #5bb39e;
  font-size: 12px;
  font-weight: 700;
  pointer-events: none;
  animation: ${float} 1.2s ease forwards;
`;

const Anchor = styled.div`
  position: relative;
  display: inline-block;
`;

const PointsHUD = () => {
  const { pointsBalance, openBuyPoints } = useGameScore();
  const previousRef = useRef(pointsBalance);
  const [bump, setBump] = useState(false);
  const [delta, setDelta] = useState(null);

  useEffect(() => {
    const prev = previousRef.current;
    if (pointsBalance !== prev) {
      const diff = pointsBalance - prev;
      if (diff > 0) {
        setBump(true);
        setDelta(diff);
        const bumpT = setTimeout(() => setBump(false), 600);
        const deltaT = setTimeout(() => setDelta(null), 1300);
        previousRef.current = pointsBalance;
        return () => {
          clearTimeout(bumpT);
          clearTimeout(deltaT);
        };
      }
      previousRef.current = pointsBalance;
    }
  }, [pointsBalance]);

  return (
    <Anchor>
      <Wrap
        type="button"
        $bump={bump}
        onClick={openBuyPoints}
        title="Buy more points"
        aria-label={`${pointsBalance.toLocaleString()} points — click to buy more`}
      >
        <Coin>$</Coin>
        {pointsBalance.toLocaleString()} pts
        <Plus aria-hidden="true">+</Plus>
      </Wrap>
      {delta !== null && <Delta>+{delta.toLocaleString()}</Delta>}
    </Anchor>
  );
};

export default PointsHUD;
