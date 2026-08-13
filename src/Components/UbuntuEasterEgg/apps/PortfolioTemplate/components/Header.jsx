import React from 'react';
import styled from 'styled-components';
import { vsTokens } from '../styled/tokens';

const Wrap = styled.div`
  margin: 0 60px;
  padding-top: 180px;
  width: 60%;
  @media (max-width: 1024px) {
    margin: 0 32px;
    padding-top: 90px;
    width: auto;
  }
`;

const Lead = styled.code`
  display: block;
  color: ${vsTokens.lightblue};
  font-size: 14px;
  font-family: ${vsTokens.font.mono};
`;

const Name = styled.code`
  display: block;
  color: ${vsTokens.text.primary};
  font-size: 56px;
  font-family: ${vsTokens.font.mono};
  margin-top: 20px;
  font-weight: 700;
  @media (max-width: 1024px) {
    font-size: 36px;
  }
`;

const CTAButton = styled.button`
  border: 1px solid ${vsTokens.lightblue};
  color: ${vsTokens.lightblue};
  margin-top: 36px;
  padding: 12px 24px;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  font: inherit;
  &:hover {
    background: rgba(133, 216, 251, 0.1);
  }
  code { font-family: ${vsTokens.font.mono}; }
`;

export default function Header({ onCTA }) {
  return (
    <Wrap id="Header">
      <Lead>Hi, my name is</Lead>
      <Name>Dominique Hosea</Name>
      <CTAButton onClick={onCTA}>
        <code>Check out my Projects !</code>
      </CTAButton>
    </Wrap>
  );
}
