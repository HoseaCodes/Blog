import React, { Component } from 'react';
import styled from 'styled-components';
import BootScreen from './screens/BootScreen';
import Desktop from './screens/Desktop';
import MenuBar from './screens/MenuBar';
import { MacGlobalStyle } from './styled/animations';

const STORAGE = {
  visited: 'hoseacodes:mac:visited',
  bg: 'hoseacodes:mac:bg',
};

const Overlay = styled.div.attrs({ className: 'hoseacodes-mac-root' })`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  isolation: isolate;
  z-index: 99;
  background: #000;
  color: #fff;
  font-size: 14px;
  line-height: 1.4;
  text-align: left;
  pointer-events: auto;
`;

export default class MacEasterEgg extends Component {
  constructor(props) {
    super(props);
    const visited = localStorage.getItem(STORAGE.visited) === 'true';
    this.state = {
      booting: !visited,
      shutDownScreen: false,
    };
  }

  componentDidMount() {
    this.prevTitle = document.title;
    document.title = 'macOS';
    if (this.state.booting) {
      this.bootTimeout = setTimeout(() => {
        this.setState({ booting: false });
        localStorage.setItem(STORAGE.visited, 'true');
      }, 2000);
    }
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.title = this.prevTitle;
    if (this.bootTimeout) clearTimeout(this.bootTimeout);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.key === 'Escape') this.props.onShutDown();
  };

  shutDown = () => {
    this.setState({ shutDownScreen: true });
    setTimeout(() => this.props.onShutDown(), 200);
  };

  turnOn = () => {
    this.setState({ shutDownScreen: false, booting: true });
    this.bootTimeout = setTimeout(() => this.setState({ booting: false }), 2000);
  };

  render() {
    const desktopActive = !this.state.booting && !this.state.shutDownScreen;
    return (
      <Overlay role="dialog" aria-label="macOS easter egg">
        <MacGlobalStyle />
        <BootScreen visible={this.state.booting} isShutDown={this.state.shutDownScreen} onTurnOn={this.turnOn} />
        {desktopActive && (
          <>
            <MenuBar onPower={this.shutDown} onLock={this.shutDown} />
            <Desktop />
          </>
        )}
      </Overlay>
    );
  }
}
