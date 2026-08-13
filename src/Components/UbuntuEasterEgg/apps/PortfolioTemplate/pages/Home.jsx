import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';
import Header from '../components/Header';
import About from './About';
import Resume from './Resume';
import Contact from './Contact';
import { vsTokens } from '../styled/tokens';

const STORAGE_WIDTH = 'hoseacodes:pt:sidebarWidth';

const Frame = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  font-family: ${vsTokens.font.mono};
  position: relative;
`;

const SidebarColumn = styled.div`
  background: ${vsTokens.bg.sidebar};
  height: 100%;
  flex-shrink: 0;
  width: ${(p) => p.$width}px;
  display: ${(p) => (p.$hideOnNarrow ? 'none' : 'block')};
  @media (max-width: 1024px) {
    display: none;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  background: ${vsTokens.bg.main};
  height: 100%;
  overflow-y: auto;
`;

const TabStrip = styled.div`
  background: ${vsTokens.bg.tabBar};
  height: 56px;
  display: flex;
  align-items: stretch;
  @media (max-width: 1024px) {
    display: none;
  }
`;

const Scroll = styled.div`
  padding-bottom: 60px;
`;

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [width, setWidth] = useState(270);
  const scrollRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_WIDTH);
    if (saved) setWidth(parseInt(saved, 10) || 270);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_WIDTH, String(width));
  }, [width]);

  const scrollToProjects = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setActiveTab('home');
  };

  return (
    <Frame id="home">
      <SidebarColumn $width={width}>
        <SideBar onWidthChange={setWidth} />
      </SidebarColumn>
      <RightColumn ref={scrollRef}>
        <TabStrip>
          <NavBar activeTab={activeTab} setActiveTab={setActiveTab} />
        </TabStrip>
        <Scroll>
          {activeTab === 'home' && (
            <>
              <Header onCTA={scrollToProjects} />
              <About />
              <Resume />
              <Contact />
            </>
          )}
          {activeTab === 'about' && <About />}
          {activeTab === 'resume' && <Resume />}
          {activeTab === 'contact' && <Contact />}
        </Scroll>
      </RightColumn>
    </Frame>
  );
}
