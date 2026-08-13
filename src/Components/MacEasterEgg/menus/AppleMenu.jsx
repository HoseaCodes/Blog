import React from 'react';
import styled from 'styled-components';
import { macTheme } from '../styled/tokens';
import { fadeUp } from '../styled/animations';

const Card = styled.div`
  position: absolute;
  top: calc(100% + 2px);
  left: 0;
  min-width: 240px;
  background: ${macTheme.bg.contextMenu};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 4px 0;
  box-shadow: ${macTheme.shadow.menu};
  color: #fff;
  font-size: 13px;
  z-index: 60;
  animation: ${fadeUp} 120ms ease forwards;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 14px;
  cursor: pointer;
  &:hover {
    background: ${macTheme.bg.selectionBlue};
  }
`;

const Right = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin-left: 32px;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 4px 8px;
`;

export default function AppleMenu({ items, onItemClick }) {
  return (
    <Card onClick={(e) => e.stopPropagation()}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <Item onClick={() => onItemClick && onItemClick(it)}>
            <span>{it.title}</span>
            {it.rightLabel ? <Right>{it.rightLabel}</Right> : null}
          </Item>
          {it.separator && <Divider />}
        </React.Fragment>
      ))}
    </Card>
  );
}
