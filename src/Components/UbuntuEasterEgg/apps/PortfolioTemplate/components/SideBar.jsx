import React, { useState } from 'react';
import styled from 'styled-components';
import { vsTokens, ptAsset } from '../styled/tokens';

const Wrap = styled.div`
  display: flex;
  height: 100%;
`;

const Inner = styled.div`
  color: ${vsTokens.text.secondary};
  font-size: 15px;
  padding-top: 18px;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const Tree = styled.div`
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;
  cursor: pointer;
  padding: 4px 0;
  padding-left: ${(p) => p.$indent || 0}px;
  &:hover { background: rgba(43, 42, 42, 0.8); }
  svg { width: 22px; height: 22px; margin-right: 4px; }
`;

const Leaf = styled.a`
  display: flex;
  align-items: center;
  margin-left: 48px;
  padding: 3px 0;
  color: inherit;
  text-decoration: none;
  cursor: pointer;
  &:hover { background: rgba(43, 42, 42, 0.8); }
  img { width: 22px; margin-right: 4px; margin-left: 20px; }
`;

const SocialRow = styled.div`
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  a { transition: transform 250ms ease; }
  a:hover { transform: scale(1.2); }
  img { width: 38px; height: 38px; }
`;

const Divider = styled.div`
  background: ${vsTokens.bg.sidebar};
  height: 100%;
  border-right: 1px solid rgba(107, 114, 128, 0.5);
  width: 6px;
  cursor: col-resize;
  &:hover { border-right-color: #3b82f6; }
`;

const ChevronDown = () => (
  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
);
const ChevronRight = () => (
  <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.21 5.23a.75.75 0 011.06-.02l4.39 4.25a.75.75 0 010 1.08l-4.39 4.25a.75.75 0 11-1.04-1.08L11.06 10 7.21 6.29a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
);

const PROJECTS = [
  { name: 'HoseaCodes Blog', icon: 'icons/TSIcon.png', href: '/blog' },
  { name: 'CareerConnect', icon: 'icons/JSIcon.png', href: '/project' },
  { name: 'Calorie Kitchen', icon: 'icons/JSIcon.png', href: '/project' },
  { name: 'Sneaker API', icon: 'icons/TSIcon.png', href: '/project' },
];

export default function SideBar({ onWidthChange }) {
  const [showProjects, setShowProjects] = useState(true);
  const [showWeb, setShowWeb] = useState(true);

  const startResizing = (e) => {
    if (!onWidthChange) return;
    const start = e.clientX;
    const onMove = (ev) => {
      const w = Math.max(170, start + (ev.clientX - start));
      onWidthChange(w);
    };
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <Wrap>
      <Inner>
        <Tree>
          <Row onClick={() => setShowProjects((v) => !v)}>
            {showProjects ? <ChevronDown /> : <ChevronRight />}
            <span>Projects</span>
          </Row>
          {showProjects && (
            <>
              <Row $indent={20} onClick={() => setShowWeb((v) => !v)}>
                {showWeb ? <ChevronDown /> : <ChevronRight />}
                <span>Web</span>
              </Row>
              {showWeb && (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {PROJECTS.map((p) => (
                    <Leaf key={p.name} href={p.href} onClick={(e) => { e.preventDefault(); window.location.href = p.href; }}>
                      <img src={ptAsset(p.icon)} alt="" />
                      <span>{p.name}</span>
                    </Leaf>
                  ))}
                </div>
              )}
            </>
          )}
        </Tree>
        <SocialRow>
          <a href="https://github.com/hoseacodes" target="_blank" rel="noreferrer noopener">
            <img src={ptAsset('logos/GitLogo.png')} alt="GitHub" />
          </a>
          <a href="https://www.linkedin.com/in/dominique-hosea" target="_blank" rel="noreferrer noopener">
            <img src={ptAsset('logos/LinkedinLogo.png')} alt="LinkedIn" />
          </a>
          <a href="https://twitter.com/hoseacodes" target="_blank" rel="noreferrer noopener">
            <img src={ptAsset('logos/KaggleLogo.png')} alt="Twitter" />
          </a>
          <a href="mailto:mr.dhosea@gmail.com">
            <img src={ptAsset('logos/MailLogo.png')} alt="Mail" />
          </a>
        </SocialRow>
      </Inner>
      <Divider onMouseDown={startResizing} />
    </Wrap>
  );
}
