import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Clock from '../base/Clock';
import { ubuntuTheme, asset } from '../styled/tokens';
import { transformDownShow } from '../styled/animations';

const Bar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: ${ubuntuTheme.navbarHeight};
  background: ${ubuntuTheme.bg.grey};
  color: ${ubuntuTheme.text.grey};
  font-size: 0.875rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  z-index: 50;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
`;

const NavItem = styled.div`
  padding: 4px 12px;
  outline: none;
  border-bottom: 2px solid transparent;
  transition: border-color 100ms ease-in-out;
  cursor: pointer;
  &:focus, &:hover {
    border-bottom-color: ${ubuntuTheme.bg.orange};
  }
`;

const StatusWrap = styled.div`
  position: relative;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  img { width: 14px; height: 14px; }
`;

const StatusCard = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  right: 6px;
  width: 220px;
  background: ${ubuntuTheme.bg.contextMenu};
  color: ${ubuntuTheme.text.grey};
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  padding: 8px;
  animation: ${transformDownShow} 200ms ease forwards;
  z-index: 60;
`;

const StatusBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  background: transparent;
  border: none;
  color: inherit;
  font: inherit;
  text-align: left;
  border-radius: 4px;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.08); }
  img { width: 16px; height: 16px; }
`;

function Navbar({ lockScreen, shutDown }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <Bar>
      <NavItem tabIndex={0}>Activities</NavItem>
      <NavItem tabIndex={0}>
        <Clock />
      </NavItem>
      <StatusWrap ref={wrapRef} onClick={() => setOpen((v) => !v)} id="status-bar">
        <img src={asset('themes/Yaru/status/audio-volume-medium-symbolic.svg')} alt="volume" />
        <img src={asset('themes/Yaru/status/network-wireless-signal-good-symbolic.svg')} alt="wifi" />
        <img src={asset('themes/Yaru/status/battery-good-symbolic.svg')} alt="battery" />
        {open && (
          <StatusCard onClick={(e) => e.stopPropagation()}>
            <StatusBtn onClick={() => { setOpen(false); lockScreen && lockScreen(); }}>
              <img src={asset('themes/Yaru/status/changes-prevent-symbolic.svg')} alt="" />
              Lock
            </StatusBtn>
            <StatusBtn onClick={() => { setOpen(false); shutDown(); }}>
              <img src={asset('themes/Yaru/status/system-shutdown-symbolic.svg')} alt="" />
              Power Off / Exit
            </StatusBtn>
          </StatusCard>
        )}
      </StatusWrap>
    </Bar>
  );
}

export default Navbar;
