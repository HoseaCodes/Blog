import React from 'react';
import styled from 'styled-components';
import { vsTokens } from '../styled/tokens';

const Wrap = styled.div`
  padding-bottom: 200px;
  margin-top: 140px;
`;

const TitleRow = styled.div`
  display: table;
  margin: 0 60px;
  @media (max-width: 1024px) {
    margin: 0 32px;
  }
`;

const TitleIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 16px;
  color: ${vsTokens.yellow};
  &::before { content: "✉️"; }
`;

const TitleText = styled.code`
  display: table-cell;
  color: ${vsTokens.text.primary};
  font-size: 28px;
  white-space: nowrap;
  font-family: ${vsTokens.font.mono};
  padding-right: 20px;
`;

const Underline = styled.div`
  display: table-cell;
  border-bottom: 1px solid rgba(230, 241, 255, 0.25);
  width: 100%;
`;

const Body = styled.div`
  color: ${vsTokens.text.secondary};
  font-size: 16px;
  margin: 20px 60px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: ${vsTokens.font.mono};
  @media (max-width: 1024px) { margin: 20px 32px 0; }
`;

const CTAButton = styled.a`
  border: 1px solid ${vsTokens.lightblue};
  color: ${vsTokens.lightblue};
  margin-top: 40px;
  padding: 12px 0;
  border-radius: 4px;
  width: 240px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  &:hover { background: rgba(133, 216, 251, 0.1); }
  code { font-family: ${vsTokens.font.mono}; }
`;

export default function Contact() {
  return (
    <Wrap id="Contact">
      <TitleRow>
        <TitleIcon />
        <TitleText>Get In Touch</TitleText>
        <Underline />
      </TitleRow>
      <Body>
        <code>
          Always open to interesting work, fair pay, and good problems. <br />
          Whether you have a question or just want to say hi, drop a line —
          I read every message.
        </code>
        <CTAButton href="mailto:mr.dhosea@gmail.com">
          <code>Contact</code>
        </CTAButton>
      </Body>
    </Wrap>
  );
}
