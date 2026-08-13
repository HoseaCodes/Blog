import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { asset } from '../styled/tokens';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  background: #000;
  transition: opacity 500ms ease, visibility 500ms ease;
  z-index: ${(p) => (p.$visible ? 100 : -20)};
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  visibility: ${(p) => (p.$visible ? 'visible' : 'hidden')};
  user-select: none;
`;

const Logo = styled.img`
  width: 50%;
  height: auto;
  @media (min-width: 768px) {
    width: 25%;
  }
`;

const Wordmark = styled.img`
  width: 50%;
  height: auto;
  @media (min-width: 768px) {
    width: 20%;
  }
`;

const Spinner = styled.img`
  width: 40px;
  height: 40px;
  ${(p) =>
    p.$spinning &&
    css`
      animation: ${spin} 1s linear infinite;
    `}
`;

const PowerCircle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 9999px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover { background: #d1d5db; }
  img { width: 32px; height: 32px; }
`;

const Footer = styled.div`
  color: #fff;
  margin-bottom: 1rem;
  a { color: inherit; text-decoration: underline; }
  span { font-weight: 700; margin: 0 0.25rem; }
`;

function BootingScreen({ visible, isShutDown, turnOn }) {
  const showing = visible || isShutDown;
  return (
    <Wrapper $visible={showing}>
      <Logo src={asset('themes/Yaru/status/cof_orange_hex.svg')} alt="Ubuntu Logo" />
      <div onClick={turnOn} style={{ cursor: 'pointer' }}>
        {isShutDown ? (
          <PowerCircle>
            <img src={asset('themes/Yaru/status/power-button.svg')} alt="Power Button" />
          </PowerCircle>
        ) : (
          <Spinner
            $spinning={visible}
            src={asset('themes/Yaru/status/process-working-symbolic.svg')}
            alt="Ubuntu Process Symbol"
          />
        )}
      </div>
      <Wordmark src={asset('themes/Yaru/status/ubuntu_white_hex.svg')} alt="Ubuntu" />
      <Footer>
        <a href="https://www.linkedin.com/in/dominique-hosea" rel="noreferrer noopener" target="_blank">linkedin</a>
        <span>|</span>
        <a href="https://github.com/hoseacodes" rel="noreferrer noopener" target="_blank">github</a>
      </Footer>
    </Wrapper>
  );
}

export default BootingScreen;
