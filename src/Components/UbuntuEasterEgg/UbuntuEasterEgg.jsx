import React, { Component } from 'react';
import styled from 'styled-components';
import BootingScreen from './screens/BootingScreen';
import LockScreen from './screens/LockScreen';
import Desktop from './screens/Desktop';
import Navbar from './screens/Navbar';
import { UbuntuGlobalStyle } from './styled/animations';

const STORAGE = {
  bg: 'hoseacodes:ubuntu:bg',
  visited: 'hoseacodes:ubuntu:visited',
  locked: 'hoseacodes:ubuntu:locked',
};

const Overlay = styled.div.attrs({ className: 'hoseacodes-ubuntu-root' })`
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
  font-size: 16px;
  line-height: 1.4;
  text-align: left;
  pointer-events: auto;
`;

export default class UbuntuEasterEgg extends Component {
  constructor(props) {
    super(props);
    const visited = localStorage.getItem(STORAGE.visited) === 'true';
    const savedBg = localStorage.getItem(STORAGE.bg);
    this.state = {
      bg_image_name: savedBg || 'wall-2',
      booting_screen: !visited,
      shutDownScreen: false,
      screen_locked: false,
    };
  }

  componentDidMount() {
    this.prevTitle = document.title;
    document.title = 'Ubuntu';
    if (this.state.booting_screen) {
      this.bootTimeout = setTimeout(() => {
        this.setState({ booting_screen: false });
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
    if (e.key === 'Escape' && !this.state.screen_locked) {
      this.props.onShutDown();
    }
  };

  changeBackgroundImage = (img_name) => {
    this.setState({ bg_image_name: img_name });
    localStorage.setItem(STORAGE.bg, img_name);
  };

  shutDown = () => {
    this.setState({ shutDownScreen: true });
    setTimeout(() => this.props.onShutDown(), 200);
  };

  turnOn = () => {
    this.setState({ shutDownScreen: false, booting_screen: true });
    this.bootTimeout = setTimeout(() => {
      this.setState({ booting_screen: false });
    }, 2000);
  };

  lockScreen = () => {
    setTimeout(() => this.setState({ screen_locked: true }), 100);
    localStorage.setItem(STORAGE.locked, 'true');
  };

  unLockScreen = () => {
    this.setState({ screen_locked: false });
    localStorage.setItem(STORAGE.locked, 'false');
  };

  render() {
    const desktopActive = !this.state.booting_screen && !this.state.shutDownScreen;
    return (
      <Overlay role="dialog" aria-label="Ubuntu easter egg">
        <UbuntuGlobalStyle />
        <BootingScreen
          visible={this.state.booting_screen}
          isShutDown={this.state.shutDownScreen}
          turnOn={this.turnOn}
        />
        {desktopActive && (
          <>
            <LockScreen
              isLocked={this.state.screen_locked}
              bgImgName={this.state.bg_image_name}
              unLockScreen={this.unLockScreen}
            />
            <Navbar shutDown={this.shutDown} lockScreen={this.lockScreen} />
            <Desktop
              bg_image_name={this.state.bg_image_name}
              changeBackgroundImage={this.changeBackgroundImage}
            />
          </>
        )}
      </Overlay>
    );
  }
}
