import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useGameScore } from '../../Context/GameScoreContext';

const slideIn = keyframes`
  from { transform: translate(-50%, 24px); opacity: 0; }
  to   { transform: translate(-50%, 0);    opacity: 1; }
`;

const Wrap = styled.div`
  position: fixed;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  z-index: 5000;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 18px;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(91, 179, 158, 0.18), rgba(32, 106, 93, 0.18));
  border: 1px solid rgba(91, 179, 158, 0.4);
  color: #f4f6f8;
  font-family: "Lato", system-ui, sans-serif;
  font-size: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: ${slideIn} 0.35s ease forwards;
  max-width: calc(100vw - 32px);
`;

const Coin = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ffe9a3, #d9a52f 60%, #8b6716 100%);
  color: #5a3e08;
  font-size: 12px;
  font-weight: 900;
  flex-shrink: 0;
`;

const Message = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.3;
`;

const Strong = styled.span`
  font-weight: 700;
`;

const Sub = styled.span`
  color: rgba(255, 255, 255, 0.65);
  font-size: 12px;
`;

const ClaimBtn = styled.button`
  background: #206a5d;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 8px 14px;
  font: inherit;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, transform 0.1s;
  &:hover:not(:disabled) {
    background: #267a6b;
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Dismiss = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  border: 0;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  padding: 4px;
  &:hover { color: #fff; }
`;

const ClaimOfflinePointsBanner = () => {
  const { showClaimCTA, offlineClaimableAmount, claimOfflinePoints } = useGameScore();
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  if (!showClaimCTA || dismissed) return null;

  const handleClaim = async () => {
    setBusy(true);
    setError(null);
    const result = await claimOfflinePoints();
    setBusy(false);
    if (!result.ok) {
      setError(result.msg || 'Claim failed');
      return;
    }
    setDismissed(true);
  };

  return (
    <Wrap role="status" aria-live="polite">
      <Coin>$</Coin>
      <Message>
        <Strong>
          You have {offlineClaimableAmount.toLocaleString()} unclaimed points from offline play.
        </Strong>
        <Sub>
          {error
            ? error
            : 'Move them to your account so they persist across devices.'}
        </Sub>
      </Message>
      <ClaimBtn type="button" onClick={handleClaim} disabled={busy}>
        {busy ? 'Claiming…' : 'Claim'}
      </ClaimBtn>
      <Dismiss type="button" onClick={() => setDismissed(true)} aria-label="Dismiss">
        ×
      </Dismiss>
    </Wrap>
  );
};

export default ClaimOfflinePointsBanner;
