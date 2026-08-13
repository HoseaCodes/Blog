import React, { Component } from 'react';
import styled from 'styled-components';
import { ubuntuTheme } from '../styled/tokens';

const HOME_URL = '/gamecorner';

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${ubuntuTheme.bg.coolGrey};
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: ${ubuntuTheme.bg.windowTitle};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  color: #fff;
  font-family: ${ubuntuTheme.font.base};
  font-size: 0.78rem;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #5bb39e;
  box-shadow: 0 0 6px rgba(91, 179, 158, 0.7);
`;

const Label = styled.span`
  font-weight: 600;
  letter-spacing: 0.04em;
`;

const Url = styled.span`
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
  margin-left: 4px;
`;

const Spacer = styled.div`
  flex: 1;
`;

const Action = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 3px 10px;
  font: inherit;
  font-size: 0.72rem;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;

  &:hover {
    color: #fff;
    border-color: rgba(91, 179, 158, 0.45);
    background: rgba(91, 179, 158, 0.08);
  }
`;

const Frame = styled.iframe`
  flex-grow: 1;
  border: 0;
  width: 100%;
  background: #000;
`;

export class GameCorner extends Component {
  constructor() {
    super();
    this.iframeRef = React.createRef();
  }

  reload = () => {
    if (this.iframeRef.current) {
      this.iframeRef.current.src = HOME_URL;
    }
  };

  popOut = () => {
    window.location.href = HOME_URL;
  };

  render() {
    return (
      <Wrap>
        <TopBar>
          <Dot />
          <Label>Game Corner</Label>
          <Url>{HOME_URL}</Url>
          <Spacer />
          <Action type="button" onClick={this.reload} title="Reload">
            Reload
          </Action>
          <Action type="button" onClick={this.popOut} title="Open in full page">
            Pop out ↗
          </Action>
        </TopBar>
        <Frame
          ref={this.iframeRef}
          src={HOME_URL}
          title="Game Corner"
          allow="autoplay; fullscreen"
        />
      </Wrap>
    );
  }
}

export default GameCorner;

export const displayGameCorner = () => <GameCorner />;
