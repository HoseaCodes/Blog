import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Clock from '../base/Clock';
import AppleMenu from '../menus/AppleMenu';
import { macTheme, macAsset } from '../styled/tokens';

const APPLE_ITEMS = [
  { title: 'About This Mac', separator: true, rightLabel: '' },
  { title: 'System Preferences…', separator: true, rightLabel: '' },
  { title: 'Sleep', separator: false, rightLabel: '' },
  { title: 'Restart…', separator: false, rightLabel: '' },
  { title: 'Shut Down…', separator: true, rightLabel: '' },
  { title: 'Lock Screen', separator: false, rightLabel: '⌃⌘Q' },
];

const FINDER_ITEMS = [
  { title: 'About Finder', separator: true, rightLabel: '' },
  { title: 'Preferences…', separator: true, rightLabel: '⌘ ,' },
  { title: 'Empty Trash…', separator: true, rightLabel: '⇧⌘⌫' },
  { title: 'Hide Finder', separator: false, rightLabel: '⌘H' },
];

const GENERIC_ITEMS = (label) => [
  { title: `About ${label}`, separator: true, rightLabel: '' },
  { title: 'Preferences…', separator: false, rightLabel: '⌘ ,' },
];

const SECONDARY_MENUS = ['File', 'Edit', 'View', 'Go', 'Window', 'Help'];

const Bar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${macTheme.menuBarHeight};
  background: ${macTheme.bg.menuBar};
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 1px solid ${macTheme.bg.menuBorder};
  color: ${macTheme.text.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  font-size: 13px;
  user-select: none;
  z-index: 50;
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 100%;
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  height: 100%;
  font-size: 12px;
`;

const AppleButton = styled.button`
  background: ${(p) => (p.$active ? 'rgba(255,255,255,0.2)' : 'transparent')};
  border: 0;
  padding: 0 10px;
  height: 100%;
  color: #fff;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  img { width: 14px; height: auto; }
`;

const MenuButton = styled.button`
  background: ${(p) => (p.$active ? 'rgba(255,255,255,0.2)' : 'transparent')};
  border: 0;
  padding: 0 10px;
  height: 100%;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-weight: ${(p) => (p.$bold ? 700 : 400)};
  position: relative;
`;

const IconBtn = styled.button`
  background: transparent;
  border: 0;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  img { width: 14px; height: 14px; }
`;

export default function MenuBar({ onPower, onLock }) {
  const [active, setActive] = useState(null);
  const barRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const handler = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setActive(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [active]);

  const toggle = (name) => setActive((p) => (p === name ? null : name));
  const hoverSwap = (name) => active && active !== name && setActive(name);

  const handleAppleClick = (item) => {
    setActive(null);
    if (item.title.startsWith('Shut Down')) onPower && onPower();
    else if (item.title.startsWith('Lock')) onLock && onLock();
  };

  return (
    <Bar ref={barRef}>
      <LeftGroup>
        <AppleButton
          $active={active === 'Apple'}
          onClick={() => toggle('Apple')}
          onMouseEnter={() => hoverSwap('Apple')}
        >
          <img src={macAsset('apple-logo.png')} alt="Apple" />
          {active === 'Apple' && <AppleMenu items={APPLE_ITEMS} onItemClick={handleAppleClick} />}
        </AppleButton>
        <MenuButton
          $bold
          $active={active === 'Finder'}
          onClick={() => toggle('Finder')}
          onMouseEnter={() => hoverSwap('Finder')}
        >
          Finder
          {active === 'Finder' && <AppleMenu items={FINDER_ITEMS} onItemClick={() => setActive(null)} />}
        </MenuButton>
        {SECONDARY_MENUS.map((label) => (
          <MenuButton
            key={label}
            $active={active === label}
            onClick={() => toggle(label)}
            onMouseEnter={() => hoverSwap(label)}
          >
            {label}
            {active === label && <AppleMenu items={GENERIC_ITEMS(label)} onItemClick={() => setActive(null)} />}
          </MenuButton>
        ))}
      </LeftGroup>
      <RightGroup>
        <IconBtn><img src={macAsset('battery-icon.png')} alt="battery" /></IconBtn>
        <IconBtn><img src={macAsset('wifi-icon.png')} alt="wifi" /></IconBtn>
        <IconBtn><img src={macAsset('magnifier-icon.png')} alt="search" /></IconBtn>
        <IconBtn><img src={macAsset('control-center-icon.png')} alt="control center" /></IconBtn>
        <span><Clock /></span>
      </RightGroup>
    </Bar>
  );
}
