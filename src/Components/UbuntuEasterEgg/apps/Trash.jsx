import React, { Component } from 'react';
import styled from 'styled-components';
import { ubuntuTheme, asset } from '../styled/tokens';

const STORAGE_KEY = 'hoseacodes:ubuntu:trash-empty';

const Wrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: ${ubuntuTheme.bg.coolGrey};
  color: #fff;
  user-select: none;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: rgba(174, 167, 159, 0.4);
  font-size: 0.875rem;
`;

const Title = styled.span`
  font-weight: 700;
  margin-left: 8px;
`;

const Actions = styled.div`
  display: flex;
`;

const Pill = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid #000;
  color: ${(p) => (p.$muted ? '#d1d5db' : '#fff')};
  padding: 4px 12px;
  margin: 4px;
  border-radius: 4px;
  cursor: ${(p) => (p.$muted ? 'default' : 'pointer')};
  &:hover {
    background: ${(p) => (p.$muted ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.8)')};
  }
`;

const Items = styled.div`
  flex-grow: 1;
  margin-left: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
  justify-content: flex-start;
  overflow-y: auto;
`;

const Item = styled.div`
  outline: none;
  width: 64px;
  margin: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.875rem;
  &:focus img { opacity: 0.6; }
  &:focus span { background: ${ubuntuTheme.bg.orange}; }
`;

const IconBox = styled.div`
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  img { max-width: 100%; max-height: 100%; }
`;

const ItemName = styled.span`
  text-align: center;
  border-radius: 4px;
  padding: 0 2px;
`;

const EmptyState = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img { width: 96px; }
  span {
    font-weight: 700;
    margin-top: 16px;
    font-size: 1.25rem;
    color: #9ca3af;
  }
`;

const TRASH_ITEMS = [
  { name: 'legacy-css-grid', icon: 'themes/Yaru/system/folder.png' },
  { name: 'node_modules', icon: 'themes/Yaru/system/folder.png' },
  { name: 'package-lock.json', icon: 'themes/Yaru/system/folder.png' },
  { name: 'abandoned-side-project', icon: 'themes/Yaru/system/folder.png' },
  { name: 'jquery-spaghetti.zip', icon: 'themes/Yaru/system/folder.png' },
  { name: 'final-final-v2', icon: 'themes/Yaru/system/folder.png' },
];

export class Trash extends Component {
  constructor() {
    super();
    this.state = { empty: false };
  }

  componentDidMount() {
    const wasEmpty = localStorage.getItem(STORAGE_KEY);
    if (wasEmpty === 'true') this.setState({ empty: true });
  }

  emptyTrash = () => {
    this.setState({ empty: true });
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  render() {
    return (
      <Wrap>
        <Header>
          <Title>Trash</Title>
          <Actions>
            <Pill $muted>Restore</Pill>
            <Pill onClick={this.emptyTrash}>Empty</Pill>
          </Actions>
        </Header>
        {this.state.empty ? (
          <EmptyState>
            <img src={asset('themes/Yaru/status/user-trash-symbolic.svg')} alt="Ubuntu Trash" />
            <span>Trash is Empty</span>
          </EmptyState>
        ) : (
          <Items>
            {TRASH_ITEMS.map((item, i) => (
              <Item key={i} tabIndex={1}>
                <IconBox>
                  <img src={asset(item.icon)} alt="file" />
                </IconBox>
                <ItemName>{item.name}</ItemName>
              </Item>
            ))}
          </Items>
        )}
      </Wrap>
    );
  }
}

export default Trash;

export const displayTrash = () => <Trash />;
