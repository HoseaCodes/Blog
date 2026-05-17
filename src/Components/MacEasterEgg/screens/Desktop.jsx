import React, { Component } from 'react';
import styled from 'styled-components';
import BackgroundImage from '../base/BackgroundImage';
import Dock from './Dock';
import apps from '../apps.config';
import MacWindow from '../base/MacWindow';
import { macTheme } from '../styled/tokens';

const STORAGE_FREQUENT = 'hoseacodes:mac:frequentApps';

const Stage = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: ${macTheme.menuBarHeight};
  overflow: hidden;
  background: transparent;
`;

const WindowArea = styled.div`
  position: absolute;
  inset: 0;
  background: transparent;
  pointer-events: none;
  z-index: 20;
`;

export default class Desktop extends Component {
  constructor() {
    super();
    this.app_stack = [];
    this.state = {
      focused_windows: {},
      closed_windows: {},
      minimized_windows: {},
      disabled_apps: {},
    };
  }

  componentDidMount() {
    this.fetchAppsData();
  }

  fetchAppsData = () => {
    const focused_windows = {};
    const closed_windows = {};
    const minimized_windows = {};
    const disabled_apps = {};
    apps.forEach((app) => {
      focused_windows[app.id] = false;
      closed_windows[app.id] = true;
      minimized_windows[app.id] = false;
      disabled_apps[app.id] = app.disabled;
    });
    this.setState({ focused_windows, closed_windows, minimized_windows, disabled_apps });
  };

  buildWindowProps = (appId) => {
    if (appId === 'settings') {
      return {
        changeBackgroundImage: this.props.changeBackgroundImage,
        currBgImgName: this.props.bg_image_name,
      };
    }
    if (appId === 'terminal') {
      return {
        openApp: this.openApp,
        onExit: () => this.closeApp('terminal'),
      };
    }
    return {};
  };

  renderWindows = () =>
    apps
      .filter((app) => this.state.closed_windows[app.id] === false)
      .map((app, i) => (
        <MacWindow
          key={i}
          title={app.title}
          id={app.id}
          screen={app.screen}
          windowProps={this.buildWindowProps(app.id)}
          closed={this.closeApp}
          openApp={this.openApp}
          focus={this.focus}
          isFocused={this.state.focused_windows[app.id]}
          hasMinimised={this.hasMinimised}
          minimized={this.state.minimized_windows[app.id]}
        />
      ));

  hasMinimised = (objId) => {
    const minimized_windows = { ...this.state.minimized_windows, [objId]: true };
    const focused_windows = { ...this.state.focused_windows, [objId]: false };
    this.setState({ minimized_windows, focused_windows });
    this.giveFocusToLastApp();
  };

  giveFocusToLastApp = () => {
    for (const idx in this.app_stack) {
      if (!this.state.minimized_windows[this.app_stack[idx]] && !this.state.closed_windows[this.app_stack[idx]]) {
        this.focus(this.app_stack[idx]);
        return;
      }
    }
  };

  trackFrequent = (appId) => {
    let freq = [];
    try { freq = JSON.parse(localStorage.getItem(STORAGE_FREQUENT) || '[]'); } catch (_) { /* no-op */ }
    const existing = freq.find((a) => a.id === appId);
    if (existing) existing.frequency += 1;
    else freq.push({ id: appId, frequency: 1 });
    freq.sort((a, b) => b.frequency - a.frequency);
    localStorage.setItem(STORAGE_FREQUENT, JSON.stringify(freq));
  };

  openApp = (objId) => {
    if (this.state.disabled_apps[objId]) return;
    if (this.state.minimized_windows[objId]) {
      this.focus(objId);
      const minimized_windows = { ...this.state.minimized_windows, [objId]: false };
      this.setState({ minimized_windows });
      return;
    }
    if (this.app_stack.includes(objId)) {
      this.focus(objId);
      return;
    }
    this.trackFrequent(objId);
    const closed_windows = { ...this.state.closed_windows, [objId]: false };
    this.setState({ closed_windows }, () => this.focus(objId));
    this.app_stack.push(objId);
  };

  closeApp = (objId) => {
    this.app_stack.splice(this.app_stack.indexOf(objId), 1);
    this.giveFocusToLastApp();
    const closed_windows = { ...this.state.closed_windows, [objId]: true };
    this.setState({ closed_windows });
  };

  focus = (objId) => {
    const focused_windows = { ...this.state.focused_windows };
    for (const key in focused_windows) focused_windows[key] = key === objId;
    this.setState({ focused_windows });
  };

  render() {
    return (
      <Stage>
        <BackgroundImage />
        <WindowArea>{this.renderWindows()}</WindowArea>
        <Dock apps={apps} openApp={this.openApp} closedWindows={this.state.closed_windows} />
      </Stage>
    );
  }
}
