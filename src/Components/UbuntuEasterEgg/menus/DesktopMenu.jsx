import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ubuntuTheme } from '../styled/tokens';

const Menu = styled.div`
  position: absolute;
  width: 208px;
  background: ${ubuntuTheme.bg.contextMenu};
  border: 1px solid rgba(17, 24, 39, 0.6);
  border-radius: 4px;
  color: #fff;
  padding: 16px 0;
  z-index: 50;
  font-size: 0.875rem;
  display: ${(p) => (p.$active ? 'block' : 'none')};
  cursor: default;
  user-select: none;
`;

const Row = styled.div`
  width: 100%;
  padding: 2px 0;
  margin-bottom: 6px;
  color: ${(p) => (p.$muted ? '#9ca3af' : '#fff')};
  cursor: ${(p) => (p.$muted ? 'default' : 'pointer')};
  &:hover {
    background: ${(p) => (p.$muted ? 'transparent' : 'rgba(174, 167, 159, 0.2)')};
  }
  span { margin-left: 20px; }
`;

const Divider = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 4px 0;
  > div {
    width: 40%;
    border-top: 1px solid rgba(17, 24, 39, 0.8);
  }
`;

function DesktopMenu({ active, openApp }) {
  const [isFull, setIsFull] = useState(false);

  useEffect(() => {
    const check = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', check);
    return () => document.removeEventListener('fullscreenchange', check);
  }, []);

  const toggleFull = () => {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen();
    } catch (_) { /* no-op */ }
  };

  return (
    <Menu id="desktop-menu" $active={active}>
      <Row $muted><span>New Folder</span></Row>
      <Divider><div /></Divider>
      <Row $muted><span>Paste</span></Row>
      <Divider><div /></Divider>
      <Row onClick={() => openApp('terminal')}><span>Open in Terminal</span></Row>
      <Divider><div /></Divider>
      <Row onClick={() => openApp('settings')}><span>Change Background…</span></Row>
      <Divider><div /></Divider>
      <Row onClick={() => openApp('settings')}><span>Settings</span></Row>
      <Divider><div /></Divider>
      <Row onClick={toggleFull}><span>{isFull ? 'Exit' : 'Enter'} Full Screen</span></Row>
    </Menu>
  );
}

export default DesktopMenu;
