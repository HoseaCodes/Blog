import React, { useState } from 'react';
import styled from 'styled-components';
import { ubuntuTheme } from '../styled/tokens';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: ${ubuntuTheme.bg.geditDarker};
  color: #fff;
  font-family: ${ubuntuTheme.font.base};
`;

const Sidebar = styled.aside`
  width: 35%;
  max-width: 220px;
  background: ${ubuntuTheme.bg.windowTitle};
  display: flex;
  flex-direction: column;
  padding: 16px 0;
`;

const TabButton = styled.button`
  background: ${(p) => (p.$active ? 'rgba(255,255,255,0.08)' : 'transparent')};
  border: 0;
  outline: 0;
  color: #fff;
  font: inherit;
  text-align: left;
  padding: 10px 18px;
  cursor: pointer;
  border-left: 3px solid ${(p) => (p.$active ? ubuntuTheme.bg.orange : 'transparent')};
  &:hover { background: rgba(255, 255, 255, 0.08); }
`;

const Content = styled.section`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
`;

const H = styled.h2`
  margin: 0 0 12px;
  font-size: 1.5rem;
  color: ${ubuntuTheme.text.geditOrange};
`;

const P = styled.p`
  line-height: 1.55;
  margin: 0 0 12px;
  color: #e5e7eb;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 8px 0 16px;
`;

const Chip = styled.span`
  padding: 4px 10px;
  border-radius: 9999px;
  background: rgba(80, 182, 198, 0.15);
  color: ${ubuntuTheme.text.geditBlue};
  border: 1px solid rgba(80, 182, 198, 0.4);
  font-size: 0.85rem;
`;

const Card = styled.div`
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.02);
  h3 { margin: 0 0 6px; font-size: 1rem; color: ${ubuntuTheme.text.geditBlue}; }
  p { margin: 0; font-size: 0.9rem; color: #cbd5e1; }
`;

const CTA = styled.a`
  display: inline-block;
  margin-top: 8px;
  padding: 6px 12px;
  border-radius: 4px;
  background: ${ubuntuTheme.bg.orange};
  color: #fff;
  text-decoration: none;
  font-size: 0.875rem;
  &:hover { opacity: 0.9; }
`;

const SKILLS = [
  'React', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Docker',
  'styled-components', 'JavaScript', 'Python', 'Cloudinary', 'OpenAI', 'CI/CD',
];

const PROJECTS = [
  { title: 'HoseaCodes Blog', desc: 'Full-stack MERN blog with AI assistance, dual backends (Fly.io + AWS Lambda), media + SEO + analytics APIs.' },
  { title: 'CareerConnect', desc: 'Career discovery platform helping users explore and match with technical roles.' },
  { title: 'Calorie Kitchen', desc: 'Recipe + nutrition app pairing meal planning with calorie tracking.' },
  { title: 'Sneaker API', desc: 'REST API surfacing sneaker catalog data with image processing.' },
  { title: 'Writemind', desc: 'AI-assisted writing tool for content generation and refinement.' },
];

const TABS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

function Profile() {
  const [tab, setTab] = useState('about');

  const exitToRoute = (path) => () => {
    window.location.href = path;
  };

  return (
    <Wrap>
      <Sidebar>
        {TABS.map((t) => (
          <TabButton
            key={t.id}
            $active={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </TabButton>
        ))}
      </Sidebar>
      <Content>
        {tab === 'about' && (
          <>
            <H>Dominique Hosea</H>
            <P>
              Software engineer working across full-stack web — React on the front, Node/Express + MongoDB
              on the back, AWS + Fly.io for infra. I like shipping fast, designing for reuse, and keeping
              prod boring.
            </P>
            <P>
              You found the easter egg. Welcome to my Ubuntu desktop in a browser. Real portfolio lives
              just outside this overlay.
            </P>
            <CTA href="/about" onClick={exitToRoute('/about')}>Read the full About</CTA>
          </>
        )}
        {tab === 'skills' && (
          <>
            <H>Skills</H>
            <P>Stack I reach for most weeks:</P>
            <ChipRow>
              {SKILLS.map((s) => <Chip key={s}>{s}</Chip>)}
            </ChipRow>
            <CTA href="/about" onClick={exitToRoute('/about')}>Background &amp; experience</CTA>
          </>
        )}
        {tab === 'projects' && (
          <>
            <H>Selected Projects</H>
            {PROJECTS.map((p) => (
              <Card key={p.title}>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </Card>
            ))}
            <CTA href="/project" onClick={exitToRoute('/project')}>See all projects</CTA>
          </>
        )}
        {tab === 'contact' && (
          <>
            <H>Get in touch</H>
            <P>Best way to reach me:</P>
            <Card>
              <h3>Email</h3>
              <p><a href="mailto:mr.dhosea@gmail.com" style={{ color: ubuntuTheme.text.geditBlue }}>mr.dhosea@gmail.com</a></p>
            </Card>
            <Card>
              <h3>LinkedIn</h3>
              <p><a href="https://www.linkedin.com/in/dominique-hosea" target="_blank" rel="noreferrer noopener" style={{ color: ubuntuTheme.text.geditBlue }}>/in/dominique-hosea</a></p>
            </Card>
            <Card>
              <h3>GitHub</h3>
              <p><a href="https://github.com/hoseacodes" target="_blank" rel="noreferrer noopener" style={{ color: ubuntuTheme.text.geditBlue }}>@hoseacodes</a></p>
            </Card>
            <CTA href="/contact" onClick={exitToRoute('/contact')}>Open contact form</CTA>
          </>
        )}
      </Content>
    </Wrap>
  );
}

export default Profile;

export const displayProfile = () => <Profile />;
