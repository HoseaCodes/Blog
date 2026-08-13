import React, { useState } from 'react';
import styled from 'styled-components';
import PortfolioTemplate from './PortfolioTemplate';

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  color: #d4d4d4;
`;

const TabBar = styled.div`
  display: flex;
  background: #2d2d30;
  border-bottom: 1px solid #181818;
  height: 36px;
  flex-shrink: 0;
`;

const Tab = styled.button`
  background: ${(p) => (p.$active ? '#1e1e1e' : 'transparent')};
  color: ${(p) => (p.$active ? '#fff' : '#9ca3af')};
  border: 0;
  outline: 0;
  padding: 0 18px;
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-right: 1px solid #181818;
  border-top: 2px solid ${(p) => (p.$active ? '#519aba' : 'transparent')};
  &:hover {
    background: ${(p) => (p.$active ? '#1e1e1e' : 'rgba(255,255,255,0.05)')};
    color: #fff;
  }
`;

const FileGlyph = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  background: #519aba;
  color: #1e1e1e;
  font-size: 9px;
  font-weight: 700;
  border-radius: 2px;
  text-align: center;
  line-height: 14px;
`;

const Body = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  & > iframe {
    width: 100%;
    height: 100%;
    border: 0;
    background: #1e1e1e;
  }
`;

const PROJECTS = [
  { id: 'blog', label: 'hoseacodes-blog', kind: 'iframe', src: 'https://github1s.com/HoseaCodes/Blog/blob/HEAD/README.md' },
  { id: 'portfolio', label: 'portfolio-template', kind: 'react' },
];

export default function VSCode() {
  const [active, setActive] = useState(PROJECTS[0].id);
  const activeProject = PROJECTS.find((p) => p.id === active);

  return (
    <Wrap>
      <TabBar>
        {PROJECTS.map((p) => (
          <Tab key={p.id} $active={active === p.id} onClick={() => setActive(p.id)}>
            <FileGlyph>TS</FileGlyph>
            {p.label}
          </Tab>
        ))}
      </TabBar>
      <Body>
        {activeProject && activeProject.kind === 'iframe' && (
          <iframe src={activeProject.src} title={activeProject.label} />
        )}
        {activeProject && activeProject.kind === 'react' && <PortfolioTemplate />}
      </Body>
    </Wrap>
  );
}

export const displayVSCode = () => <VSCode />;
