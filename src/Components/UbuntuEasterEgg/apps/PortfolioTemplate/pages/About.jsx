import React from 'react';
import styled from 'styled-components';
import List from '../components/List';
import { vsTokens, ptAsset } from '../styled/tokens';

const SKILLS = [
  { name: 'JavaScript (ES6+)', logo: ptAsset('logos/JsLogo.png') },
  { name: 'TypeScript', logo: ptAsset('logos/TypescriptLogo.png') },
  { name: 'React', logo: ptAsset('logos/ReactLogo.png') },
  { name: 'Next.js', logo: ptAsset('logos/NextLogo.png') },
  { name: 'Tailwind CSS', logo: ptAsset('logos/TailwindLogo.png') },
  { name: 'Redux', logo: ptAsset('logos/ReduxLogo.png') },
  { name: 'Node.js', logo: ptAsset('logos/NodeJSLogo.png') },
  { name: 'Python', logo: ptAsset('logos/PythonLogo.png') },
  { name: 'SQL', logo: ptAsset('logos/SqlLogo.png') },
  { name: 'MongoDB', logo: ptAsset('logos/MongoDBLogo.png') },
  { name: 'Firebase', logo: ptAsset('logos/FirebaseLogo.png') },
  { name: 'Docker', logo: ptAsset('logos/DockerLogo.png') },
];

const Wrap = styled.div`
  display: flex;
  margin: 0 60px;
  margin-top: 180px;
  width: 60%;
  justify-content: center;
  text-align: justify;
  @media (max-width: 1024px) {
    width: auto;
    margin: 90px 32px 0;
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
  &::before {
    content: "👤";
  }
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

export default function About() {
  return (
    <Wrap id="About">
      <div>
        <TitleRow>
          <TitleIcon />
          <TitleText>About Me</TitleText>
          <Underline />
        </TitleRow>
        <Body>
          <code>
            I'm a software engineer building full-stack web at HoseaCodes. React on the front,
            Node + Express + MongoDB on the back, AWS + Fly.io for infra. I like shipping
            fast, designing for reuse, and keeping prod boring. You found the deep cut of my
            site — welcome.
          </code>
          <br /><br />
          <code>The stack I reach for most weeks:</code>
          <List list={SKILLS} />
        </Body>
      </div>
    </Wrap>
  );
}
