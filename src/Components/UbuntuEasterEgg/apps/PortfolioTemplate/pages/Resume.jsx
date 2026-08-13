import React from 'react';
import styled from 'styled-components';
import { vsTokens } from '../styled/tokens';

const Wrap = styled.div`
  width: 60%;
  margin-top: 200px;
  margin-bottom: 16px;
  margin-left: auto;
  margin-right: 60px;
  padding: 0 12px;
  @media (max-width: 1024px) {
    width: auto;
    margin: 90px 32px 16px;
  }
`;

const TitleRow = styled.div`
  display: table;
  width: 100%;
`;

const TitleIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 16px;
  color: ${vsTokens.yellow};
  &::before { content: "📄"; }
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
  margin-top: 20px;
  font-family: ${vsTokens.font.mono};
`;

const Section = styled.div`
  display: flex;
  flex-direction: row;
  padding-top: 36px;
  &:first-of-type { padding-top: 0; }
`;

const Left = styled.div`
  width: 25%;
  code { color: ${vsTokens.yellow}; }
`;

const Right = styled.div`
  width: 75%;
  code { font-family: ${vsTokens.font.mono}; }
  .role { color: ${vsTokens.blue}; }
  .place { color: ${vsTokens.lightblue}; font-style: italic; font-size: 13px; }
  .date { color: ${vsTokens.brown}; font-size: 12px; }
  .bullet { font-size: 13px; }
`;

export default function Resume() {
  return (
    <Wrap id="Resume">
      <TitleRow>
        <TitleIcon />
        <TitleText>Resume</TitleText>
        <Underline />
      </TitleRow>
      <Body>
        <Section>
          <Left><code>Work</code></Left>
          <Right>
            <code className="role">Software Engineer · HoseaCodes</code><br />
            <code className="place">Full-stack web · Remote</code><br />
            <code className="date">• 2020 – Present</code><br />
            <code className="bullet">
              <br />• Shipped a dual-backend MERN blog with AI assistance, media management, and SEO analytics.
              <br />• Built infra on Fly.io + AWS Lambda with shared JWT auth.
              <br />• Designed a reusable design-token system used across the marketing site and admin tools.
              <br />• Open-sourced project case studies and the Ubuntu/macOS easter egg you're reading now.
            </code>
          </Right>
        </Section>
        <Section>
          <Left><code>Skills</code></Left>
          <Right>
            <code className="bullet">
              • React, Next.js, TypeScript, Node.js, Express, MongoDB, AWS, Docker, CI/CD, design systems.
              <br />• Comfortable across the stack — UI to infra.
            </code>
          </Right>
        </Section>
        <Section>
          <Left><code>Education</code></Left>
          <Right>
            <code className="role">Computer Science</code><br />
            <code className="place">Self-directed + applied — long-form learning through projects.</code>
          </Right>
        </Section>
      </Body>
    </Wrap>
  );
}
