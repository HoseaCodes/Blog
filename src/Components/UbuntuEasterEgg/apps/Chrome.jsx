import React, { Component } from 'react';
import styled from 'styled-components';
import { ubuntuTheme, asset } from '../styled/tokens';

const STORAGE = {
  url: 'hoseacodes:ubuntu:chrome-url',
  display: 'hoseacodes:ubuntu:chrome-display-url',
};

const HOME_URL = '/blog';

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${ubuntuTheme.bg.coolGrey};
`;

const UrlBar = styled.div`
  width: 100%;
  padding: 2px 0 4px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #fff;
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(17, 24, 39, 0.6);
`;

const IconBtn = styled.div`
  margin: 0 4px;
  width: 28px;
  height: 28px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.1); }
  img { width: 20px; height: 20px; }
`;

const UrlInput = styled.input`
  outline: none;
  background: ${ubuntuTheme.bg.grey};
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
  padding: 4px 12px;
  margin-right: 12px;
  width: 80%;
  color: #d1d5db;
  font: inherit;
  &:focus { color: #fff; }
`;

const Screen = styled.iframe`
  flex-grow: 1;
  border: 0;
`;

export class Chrome extends Component {
  constructor() {
    super();
    this.state = { url: HOME_URL, display_url: HOME_URL };
    this.iframeRef = React.createRef();
  }

  componentDidMount() {
    const lastUrl = localStorage.getItem(STORAGE.url);
    const lastDisplay = localStorage.getItem(STORAGE.display);
    if (lastUrl) {
      this.setState({ url: lastUrl, display_url: lastDisplay || lastUrl });
    }
  }

  store = (url, display_url) => {
    localStorage.setItem(STORAGE.url, url);
    localStorage.setItem(STORAGE.display, display_url);
  };

  refresh = () => {
    if (this.iframeRef.current) {
      this.iframeRef.current.src = this.iframeRef.current.src;
    }
  };

  goHome = () => {
    this.setState({ url: HOME_URL, display_url: HOME_URL }, this.refresh);
    this.store(HOME_URL, HOME_URL);
  };

  onKeyDown = (e) => {
    if (e.key !== 'Enter') return;
    let url = e.target.value.trim();
    if (url.length === 0) return;
    const isInternal = url.startsWith('/');
    if (!isInternal && url.indexOf('http://') !== 0 && url.indexOf('https://') !== 0) {
      url = 'https://' + url;
    }
    if (!isInternal) url = encodeURI(url);
    const display_url = url;
    this.setState({ url, display_url });
    this.store(url, display_url);
    e.target.blur();
  };

  onChangeInput = (e) => this.setState({ display_url: e.target.value });

  render() {
    return (
      <Wrap>
        <UrlBar>
          <IconBtn onClick={this.refresh} title="Refresh">
            <img src={asset('themes/Yaru/status/chrome_refresh.svg')} alt="refresh" />
          </IconBtn>
          <IconBtn onClick={this.goHome} title="Home">
            <img src={asset('themes/Yaru/status/chrome_home.svg')} alt="home" />
          </IconBtn>
          <UrlInput
            type="url"
            spellCheck={false}
            autoComplete="off"
            value={this.state.display_url}
            onChange={this.onChangeInput}
            onKeyDown={this.onKeyDown}
          />
        </UrlBar>
        <Screen ref={this.iframeRef} src={this.state.url} title="Chrome" />
      </Wrap>
    );
  }
}

export default Chrome;

export const displayChrome = () => <Chrome />;
