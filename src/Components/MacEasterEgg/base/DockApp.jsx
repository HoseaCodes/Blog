import React, { useState } from 'react';
import styled from 'styled-components';
import { macAsset, macTheme } from '../styled/tokens';

const Wrap = styled.button`
  position: relative;
  background: transparent;
  border: 0;
  padding: 4px 6px;
  width: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 180ms ease;
  &:hover { transform: scale(1.5) translateY(-12px); }
  &:hover + button { transform: scale(1.25) translateY(-6px); }
  &:hover ~ button:nth-of-type(2) { transform: scale(1.1) translateY(-3px); }
`;

const Icon = styled.img`
  width: 100%;
  height: auto;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
`;

const Dot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${(p) => (p.$open ? macTheme.text.white : 'transparent')};
  margin-top: 2px;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  margin-bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(40, 40, 40, 0.95);
  color: #fff;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 5px;
  white-space: nowrap;
  visibility: ${(p) => (p.$show ? 'visible' : 'hidden')};
  pointer-events: none;
`;

export default function DockApp({ id, title, icon, isOpen, onOpen }) {
  const [hover, setHover] = useState(false);
  return (
    <Wrap
      onClick={() => onOpen(id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={title}
    >
      <Tooltip $show={hover}>{title}</Tooltip>
      <Icon src={macAsset(icon)} alt={title} />
      <Dot $open={isOpen} />
    </Wrap>
  );
}
