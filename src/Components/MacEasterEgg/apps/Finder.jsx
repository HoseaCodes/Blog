import React from 'react';
import styled from 'styled-components';
import { macTheme, macAsset } from '../styled/tokens';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  background: ${macTheme.bg.windowContent};
  color: ${macTheme.text.primary};
  font-family: ${macTheme.font.base};
`;

const Sidebar = styled.aside`
  width: 200px;
  background: rgba(255, 255, 255, 0.04);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 0;
  font-size: 13px;
`;

const Section = styled.div`
  padding: 6px 14px 2px;
  color: ${macTheme.text.muted};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 14px;
  cursor: pointer;
  border-radius: 4px;
  margin: 0 6px;
  &:hover { background: rgba(255, 255, 255, 0.06); }
  &.active { background: ${macTheme.bg.selectionBlue}; color: #fff; }
  img { width: 16px; height: 16px; }
`;

const Content = styled.section`
  flex: 1;
  padding: 16px 20px;
  overflow: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
  gap: 16px;
  margin-top: 12px;
`;

const Tile = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: inherit;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  img { width: 48px; height: 48px; }
  &:hover img { transform: scale(1.05); }
`;

const PROJECT_ITEMS = [
  { label: 'HoseaCodes Blog', href: '/blog' },
  { label: 'Projects', href: '/project' },
  { label: 'About Me', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Finder() {
  return (
    <Wrap>
      <Sidebar>
        <Section>Favorites</Section>
        <Item className="active">
          <img src={macAsset('folder-icon.png')} alt="" />
          HoseaCodes
        </Item>
        <Item>
          <img src={macAsset('folder-icon.png')} alt="" />
          Documents
        </Item>
        <Item>
          <img src={macAsset('folder-icon.png')} alt="" />
          Downloads
        </Item>
        <Section style={{ marginTop: 14 }}>Locations</Section>
        <Item>
          <img src={macAsset('disk-icon.png')} alt="" />
          Macintosh HD
        </Item>
      </Sidebar>
      <Content>
        <div style={{ fontSize: 13, color: macTheme.text.secondary, marginBottom: 4 }}>HoseaCodes</div>
        <Grid>
          {PROJECT_ITEMS.map((item) => (
            <Tile
              key={item.label}
              href={item.href}
              onClick={(e) => { e.preventDefault(); window.location.href = item.href; }}
            >
              <img src={macAsset('folder-icon.png')} alt="" />
              <span>{item.label}</span>
            </Tile>
          ))}
        </Grid>
      </Content>
    </Wrap>
  );
}

export const displayFinder = () => <Finder />;
