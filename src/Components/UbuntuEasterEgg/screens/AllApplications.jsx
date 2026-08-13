import React, { Component } from 'react';
import styled from 'styled-components';
import UbuntuApp from '../base/UbuntuApp';
import { ubuntuTheme } from '../styled/tokens';

const STORAGE_FREQUENT = 'hoseacodes:ubuntu:frequentApps';

const Wrap = styled.div`
  position: absolute;
  top: ${ubuntuTheme.navbarHeight};
  width: 100%;
  height: calc(100% - ${ubuntuTheme.navbarHeight});
  z-index: 35;
  padding-left: 48px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SearchRow = styled.div`
  padding-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 10px;
  background: #fff;
  border-radius: 12px;
  width: 66%;
  @media (min-width: 768px) { width: 33%; }
`;

const SearchInput = styled.input`
  background: transparent;
  border: 0;
  outline: none;
  padding: 4px;
  width: 100%;
  font: inherit;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  padding: 40px 20px;
  justify-content: center;
  @media (min-width: 768px) {
    grid-template-columns: repeat(6, 1fr);
    gap: 16px;
    padding-left: 80px;
    padding-right: 80px;
  }
`;

const Tabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: auto;
  padding-bottom: 16px;
`;

const Tab = styled.div`
  width: 25%;
  text-align: center;
  color: #fff;
  cursor: pointer;
  h4 { margin: 0; font-size: 1rem; }
  div {
    height: 4px;
    margin-top: 4px;
    background: ${(p) => (p.$active ? ubuntuTheme.bg.orange : 'transparent')};
  }
  &:hover div {
    background: ${(p) => (p.$active ? ubuntuTheme.bg.orange : '#fff')};
  }
`;

export default class AllApplications extends Component {
  constructor(props) {
    super(props);
    this.state = { query: '', category: 0 };
  }

  onChange = (e) => this.setState({ query: e.target.value });

  getApps = () => {
    const { apps } = this.props;
    if (this.state.category === 1) {
      const info = JSON.parse(localStorage.getItem(STORAGE_FREQUENT) || '[]');
      return info
        .map((entry) => apps.find((a) => a.id === entry.id))
        .filter(Boolean);
    }
    if (!this.state.query) return apps;
    const q = this.state.query.toLowerCase();
    return apps.filter((app) => app.title.toLowerCase().includes(q));
  };

  render() {
    return (
      <Wrap onContextMenu={(e) => e.stopPropagation()}>
        <SearchRow>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="Type to Search"
              value={this.state.query}
              onChange={this.onChange}
              autoFocus
            />
          </SearchBox>
        </SearchRow>
        <Grid>
          {this.getApps().map((app, i) => (
            <UbuntuApp key={i} id={app.id} name={app.title} icon={app.icon} openApp={this.props.openApp} />
          ))}
        </Grid>
        <Tabs>
          <Tab $active={this.state.category === 1} onClick={() => this.setState({ category: 1 })}>
            <h4>Frequent</h4>
            <div />
          </Tab>
          <Tab $active={this.state.category === 0} onClick={() => this.setState({ category: 0 })}>
            <h4>All</h4>
            <div />
          </Tab>
        </Tabs>
      </Wrap>
    );
  }
}
