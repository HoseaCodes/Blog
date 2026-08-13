import React from 'react';
import styled from 'styled-components';
import { macTheme, macAsset } from '../styled/tokens';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  background: ${macTheme.bg.windowContent};
  color: ${macTheme.text.primary};
  font-family: ${macTheme.font.base};
  text-align: center;
  padding: 32px;
`;

const Logo = styled.img`
  width: 96px;
  height: 96px;
  filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
`;

const Title = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
`;

const Body = styled.p`
  margin: 0;
  max-width: 360px;
  color: ${macTheme.text.secondary};
  line-height: 1.5;
`;

const Button = styled.a`
  display: inline-block;
  margin-top: 8px;
  padding: 8px 18px;
  border-radius: 6px;
  background: ${macTheme.bg.blue};
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  &:hover { background: ${macTheme.bg.blueHover}; }
`;

export default function Mail() {
  return (
    <Wrap>
      <Logo src={macAsset('mail-logo.png')} alt="Mail" />
      <Title>Get in touch</Title>
      <Body>
        I read every message. Drop a line through the contact form on the main site,
        or hit me on{' '}
        <a href="https://www.linkedin.com/in/dominique-hosea" target="_blank" rel="noreferrer noopener" style={{ color: macTheme.bg.blue }}>LinkedIn</a>.
      </Body>
      <Button href="/contact" onClick={(e) => { e.preventDefault(); window.location.href = '/contact'; }}>
        Open contact form
      </Button>
    </Wrap>
  );
}

export const displayMail = () => <Mail />;
