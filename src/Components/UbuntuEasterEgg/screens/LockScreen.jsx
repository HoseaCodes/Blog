import React, { useEffect } from 'react';
import styled from 'styled-components';
import Clock from '../base/Clock';
import { asset } from '../styled/tokens';

const Overlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  margin: 0;
  padding: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.9);
  transition: transform 500ms ease, visibility 500ms ease;
  transform: ${(p) => (p.$locked ? 'translateY(0)' : 'translateY(-100%)')};
  visibility: ${(p) => (p.$locked ? 'visible' : 'hidden')};
  user-select: none;
`;

const Wallpaper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${(p) => asset(`wallpapers/${p.$bg}.webp`)});
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;
  filter: blur(12px);
  z-index: 20;
`;

const Inner = styled.div`
  width: 100%;
  height: 100%;
  z-index: 50;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

const Time = styled.div`
  font-size: 4.5rem;
`;

const Day = styled.div`
  margin-top: 1rem;
  font-size: 1.25rem;
  font-weight: 500;
`;

const Hint = styled.div`
  margin-top: 4rem;
  font-size: 1rem;
`;

export default function LockScreen({ isLocked, bgImgName, unLockScreen }) {
  useEffect(() => {
    if (!isLocked) return undefined;
    const handler = () => unLockScreen();
    window.addEventListener('click', handler);
    window.addEventListener('keypress', handler);
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keypress', handler);
    };
  }, [isLocked, unLockScreen]);

  return (
    <Overlay $locked={isLocked}>
      <Wallpaper $bg={bgImgName || 'wall-2'} />
      <Inner>
        <Time><Clock onlyTime /></Time>
        <Day><Clock onlyDay /></Day>
        <Hint>Click or press a key to unlock</Hint>
      </Inner>
    </Overlay>
  );
}
