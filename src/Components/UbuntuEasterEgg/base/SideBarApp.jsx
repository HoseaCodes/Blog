import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { ubuntuTheme, asset } from '../styled/tokens';
import { scaleAppImage } from '../styled/animations';

const Wrap = styled.div`
  position: relative;
  width: auto;
  padding: 8px;
  margin: 4px;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  background: ${(p) => (p.$active ? 'rgba(255,255,255,0.1)' : 'transparent')};
  transition: background 150ms ease;
  &:hover { background: rgba(255, 255, 255, 0.1); }
`;

const Icon = styled.img`
  width: 28px;
  height: 28px;
  display: block;
`;

const PulseIcon = styled.img`
  position: absolute;
  width: 28px;
  height: 28px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  visibility: hidden;
  ${(p) =>
    p.$scale &&
    css`
      animation: ${scaleAppImage} 400ms 1 forwards;
    `}
`;

const OpenDot = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  left: 0;
  top: 50%;
  background: ${ubuntuTheme.bg.orange};
  border-radius: 2px;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 6px;
  left: 100%;
  margin-left: 12px;
  padding: 2px 6px;
  font-size: 0.875rem;
  color: ${ubuntuTheme.text.grey};
  background: rgba(17, 17, 17, 0.7);
  border: 1px solid rgba(156, 163, 175, 0.4);
  border-radius: 6px;
  white-space: nowrap;
  visibility: ${(p) => (p.$show ? 'visible' : 'hidden')};
`;

export default class SideBarApp extends Component {
  constructor() {
    super();
    this.state = { showTitle: false, scaleImage: false };
  }

  scaleImage = () => {
    this.setState({ scaleImage: true });
    setTimeout(() => this.setState({ scaleImage: false }), 1000);
  };

  openApp = () => {
    const { id, isMinimized, isClose, openApp } = this.props;
    if (!isMinimized[id] && isClose[id]) this.scaleImage();
    openApp(id);
    this.setState({ showTitle: false });
  };

  render() {
    const { id, icon, title, isClose, isFocus } = this.props;
    const active = isClose[id] === false && isFocus[id];
    const isOpen = isClose[id] === false;
    return (
      <Wrap
        tabIndex={0}
        $active={active}
        id={`sidebar-${id}`}
        onClick={this.openApp}
        onMouseEnter={() => this.setState({ showTitle: true })}
        onMouseLeave={() => this.setState({ showTitle: false })}
      >
        <Icon src={asset(icon)} alt="App Icon" />
        <PulseIcon $scale={this.state.scaleImage} src={asset(icon)} alt="" />
        {isOpen && <OpenDot />}
        <Tooltip $show={this.state.showTitle}>{title}</Tooltip>
      </Wrap>
    );
  }
}
