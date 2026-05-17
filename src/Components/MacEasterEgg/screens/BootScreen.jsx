import React from 'react';
import styled, { css } from 'styled-components';
import { macAsset, macTheme } from '../styled/tokens';
import { fadeIn, bootProgress } from '../styled/animations';

const Wrap = styled.div`
  position: absolute;
  inset: 0;
  background: ${macTheme.bg.boot};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
  transition: opacity 500ms ease, visibility 500ms ease;
  z-index: ${(p) => (p.$visible ? 100 : -20)};
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  visibility: ${(p) => (p.$visible ? 'visible' : 'hidden')};
  user-select: none;
  animation: ${(p) =>
    p.$visible &&
    css`
      ${fadeIn} 400ms ease forwards
    `};
`;

const Logo = styled.img`
  width: 96px;
  height: auto;
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.1));
`;

const ProgressTrack = styled.div`
  width: 240px;
  height: 5px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 4px;
  width: 0%;
  ${(p) =>
    p.$running &&
    css`
      animation: ${bootProgress} 1900ms ease-out forwards;
    `}
`;

export default function BootScreen({ visible, onTurnOn, isShutDown }) {
  const showing = visible || isShutDown;
  return (
    <Wrap $visible={showing} onClick={isShutDown ? onTurnOn : undefined}>
      <Logo src={macAsset('apple-logo.png')} alt="Apple" />
      {!isShutDown && (
        <ProgressTrack>
          <ProgressFill $running={visible} />
        </ProgressTrack>
      )}
      {isShutDown && (
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Click to turn on</div>
      )}
    </Wrap>
  );
}
