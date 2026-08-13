import React, { useState } from 'react';
import styled from 'styled-components';
import { vsTokens, ptAsset } from '../styled/tokens';

const Row = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const Tab = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  background: ${(p) => (p.$active ? vsTokens.bg.main : 'transparent')};
  color: ${(p) => (p.$active ? vsTokens.yellow : '#d1d5db')};
  &:hover {
    background: ${vsTokens.bg.main};
    color: ${vsTokens.yellow};
  }
  img { width: 24px; margin-right: 6px; }
`;

const CloseX = styled.span`
  width: 20px;
  height: 20px;
  margin-left: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 16px;
  &:hover { background: #4b5563; }
`;

const HOME_TAB = { id: 'home', label: 'Home.ts', closable: false };
const OTHER_TABS = [
  { id: 'about', label: 'About.ts' },
  { id: 'resume', label: 'Resume.ts' },
  { id: 'contact', label: 'Contact.ts' },
];

export default function NavBar({ activeTab, setActiveTab }) {
  const [closed, setClosed] = useState([]);
  const isClosed = (id) => closed.includes(id);
  const closeTab = (id, e) => {
    e.stopPropagation();
    setActiveTab('home');
    setClosed((s) => [...s, id]);
  };
  return (
    <Row>
      <Tab $active={activeTab === HOME_TAB.id} onClick={() => setActiveTab(HOME_TAB.id)}>
        <img src={ptAsset('icons/TSIcon.png')} alt="TS" />
        {HOME_TAB.label}
      </Tab>
      {OTHER_TABS.filter((t) => !isClosed(t.id)).map((t) => (
        <Tab key={t.id} $active={activeTab === t.id} onClick={() => setActiveTab(t.id)}>
          <img src={ptAsset('icons/TSIcon.png')} alt="TS" />
          {t.label}
          <CloseX onClick={(e) => closeTab(t.id, e)}>×</CloseX>
        </Tab>
      ))}
    </Row>
  );
}
