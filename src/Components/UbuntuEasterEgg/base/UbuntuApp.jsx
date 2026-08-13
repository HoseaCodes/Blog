import React from 'react';
import styled from 'styled-components';
import { asset } from '../styled/tokens';

const Tile = styled.div`
  position: relative;
  width: 96px;
  height: 80px;
  padding: 4px;
  margin: 1px;
  z-index: 10;
  cursor: pointer;
  border: 1px solid transparent;
  border-radius: 4px;
  outline: none;
  user-select: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  font-size: 0.75rem;
  color: #fff;
  background: rgba(255, 255, 255, 0);
  &:hover { background: rgba(255, 255, 255, 0.2); }
  &:focus {
    background: rgba(233, 84, 32, 0.5);
    border-color: rgba(161, 98, 7, 1);
  }
  img {
    width: 40px;
    height: 40px;
    margin-bottom: 4px;
  }
`;

function UbuntuApp({ id, name, icon, openApp }) {
  return (
    <Tile
      tabIndex={0}
      id={`app-${id}`}
      onClick={() => openApp(id)}
    >
      <img src={asset(icon)} alt={`Ubuntu ${name}`} />
      {name}
    </Tile>
  );
}

export default UbuntuApp;
