import React, { Component } from 'react';
import styled from 'styled-components';
import BackgroundImage from '../base/BackgroundImage';
import SideBar from './SideBar';
import apps from '../apps.config';
import Window from '../base/Window';
import UbuntuApp from '../base/UbuntuApp';
import AllApplications from './AllApplications';
import DesktopMenu from '../menus/DesktopMenu';
import DefaultMenu from '../menus/DefaultMenu';
import { ubuntuTheme } from '../styled/tokens';

const STORAGE_FREQUENT = 'hoseacodes:ubuntu:frequentApps';

const Stage = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: ${ubuntuTheme.navbarHeight};
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

const DesktopShortcuts = styled.div`
  position: absolute;
  top: ${ubuntuTheme.navbarHeight};
  right: 0;
  bottom: 0;
  width: 112px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  gap: 6px;
  z-index: 15;
  pointer-events: auto;
`;

export default class Desktop extends Component {
  constructor() {
    super();
    this.app_stack = [];
    this.initFavourite = {};
    this.state = {
      focused_windows: {},
      closed_windows: {},
      overlapped_windows: {},
      disabled_apps: {},
      favourite_apps: {},
      hideSideBar: false,
      minimized_windows: {},
      desktop_apps: [],
      allAppsView: false,
      context_menus: { desktop: false, default: false },
    };
  }

  componentDidMount() {
    this.fetchAppsData();
    document.addEventListener('contextmenu', this.onContextMenu);
    document.addEventListener('click', this.hideAllContextMenu);
  }

  componentWillUnmount() {
    document.removeEventListener('contextmenu', this.onContextMenu);
    document.removeEventListener('click', this.hideAllContextMenu);
  }

  fetchAppsData = () => {
    const focused_windows = {};
    const closed_windows = {};
    const disabled_apps = {};
    const favourite_apps = {};
    const overlapped_windows = {};
    const minimized_windows = {};
    const desktop_apps = [];
    apps.forEach((app) => {
      focused_windows[app.id] = false;
      closed_windows[app.id] = true;
      disabled_apps[app.id] = app.disabled;
      favourite_apps[app.id] = app.favourite;
      overlapped_windows[app.id] = false;
      minimized_windows[app.id] = false;
      if (app.desktop_shortcut) desktop_apps.push(app.id);
    });
    this.setState({
      focused_windows,
      closed_windows,
      disabled_apps,
      favourite_apps,
      overlapped_windows,
      minimized_windows,
      desktop_apps,
    });
    this.initFavourite = { ...favourite_apps };
  };

  onContextMenu = (e) => {
    // only intercept when inside our overlay
    const overlay = document.querySelector('.hoseacodes-ubuntu-root');
    if (!overlay || !overlay.contains(e.target)) return;
    e.preventDefault();
    this.hideAllContextMenu();
    const ctx = e.target.closest && e.target.closest('[data-context]');
    const name = ctx && ctx.dataset.context === 'desktop-area' ? 'desktop' : 'default';
    this.showContextMenu(e, name);
  };

  showContextMenu = (e, menuName) => {
    let posx = e.pageX || e.clientX;
    let posy = e.pageY || e.clientY;
    const menu = document.getElementById(`${menuName}-menu`);
    if (!menu) return;
    if (posx + menu.offsetWidth > window.innerWidth) posx -= menu.offsetWidth;
    if (posy + menu.offsetHeight > window.innerHeight) posy -= menu.offsetHeight;
    menu.style.left = `${posx}px`;
    menu.style.top = `${posy}px`;
    this.setState({ context_menus: { ...this.state.context_menus, [menuName]: true } });
  };

  hideAllContextMenu = () => {
    if (!this.state.context_menus.desktop && !this.state.context_menus.default) return;
    this.setState({ context_menus: { desktop: false, default: false } });
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

  renderDesktopApps = () => {
    if (Object.keys(this.state.closed_windows).length === 0) return null;
    return apps
      .filter((app) => this.state.desktop_apps.includes(app.id))
      .map((app, i) => (
        <UbuntuApp key={i} id={app.id} name={app.title} icon={app.icon} openApp={this.openApp} />
      ));
  };

  renderWindows = () =>
    apps
      .filter((app) => this.state.closed_windows[app.id] === false)
      .map((app, i) => (
        <Window
          key={i}
          title={app.title}
          id={app.id}
          screen={app.screen}
          windowProps={this.buildWindowProps(app.id)}
          closed={this.closeApp}
          openApp={this.openApp}
          focus={this.focus}
          isFocused={this.state.focused_windows[app.id]}
          hideSideBar={this.hideSideBar}
          hasMinimised={this.hasMinimised}
          minimized={this.state.minimized_windows[app.id]}
        />
      ));

  hideSideBar = (objId, hide) => {
    if (hide === this.state.hideSideBar) return;
    if (objId === null) {
      if (hide === false) {
        this.setState({ hideSideBar: false });
      } else {
        for (const key in this.state.overlapped_windows) {
          if (this.state.overlapped_windows[key]) {
            this.setState({ hideSideBar: true });
            return;
          }
        }
      }
      return;
    }
    if (hide === false) {
      for (const key in this.state.overlapped_windows) {
        if (this.state.overlapped_windows[key] && key !== objId) return;
      }
    }
    const overlapped_windows = { ...this.state.overlapped_windows, [objId]: hide };
    this.setState({ hideSideBar: hide, overlapped_windows });
  };

  hasMinimised = (objId) => {
    const minimized_windows = { ...this.state.minimized_windows, [objId]: true };
    const focused_windows = { ...this.state.focused_windows, [objId]: false };
    this.setState({ minimized_windows, focused_windows });
    this.hideSideBar(null, false);
    this.giveFocusToLastApp();
  };

  giveFocusToLastApp = () => {
    if (!this.checkAllMinimised()) {
      for (const idx in this.app_stack) {
        if (!this.state.minimized_windows[this.app_stack[idx]]) {
          this.focus(this.app_stack[idx]);
          break;
        }
      }
    }
  };

  checkAllMinimised = () => {
    let result = true;
    for (const key in this.state.minimized_windows) {
      if (!this.state.closed_windows[key]) {
        result = result & this.state.minimized_windows[key];
      }
    }
    return result;
  };

  trackFrequent = (appId) => {
    let frequent = [];
    try { frequent = JSON.parse(localStorage.getItem(STORAGE_FREQUENT) || '[]'); } catch (_) { /* no-op */ }
    const existing = frequent.find((a) => a.id === appId);
    if (existing) existing.frequency += 1;
    else frequent.push({ id: appId, frequency: 1 });
    frequent.sort((a, b) => b.frequency - a.frequency);
    localStorage.setItem(STORAGE_FREQUENT, JSON.stringify(frequent));
  };

  openApp = (objId) => {
    if (this.state.disabled_apps[objId]) return;
    if (this.state.minimized_windows[objId]) {
      this.focus(objId);
      const r = document.querySelector('#' + objId);
      if (r) {
        r.style.transform = `translate(${r.style.getPropertyValue('--window-transform-x')},${r.style.getPropertyValue('--window-transform-y')}) scale(1)`;
      }
      const minimized_windows = { ...this.state.minimized_windows, [objId]: false };
      this.setState({ minimized_windows });
      return;
    }
    if (this.app_stack.includes(objId)) {
      this.focus(objId);
      return;
    }
    this.trackFrequent(objId);
    setTimeout(() => {
      const favourite_apps = { ...this.state.favourite_apps, [objId]: true };
      const closed_windows = { ...this.state.closed_windows, [objId]: false };
      this.setState({ closed_windows, favourite_apps, allAppsView: false }, () => this.focus(objId));
      this.app_stack.push(objId);
    }, 200);
  };

  closeApp = (objId) => {
    this.app_stack.splice(this.app_stack.indexOf(objId), 1);
    this.giveFocusToLastApp();
    this.hideSideBar(null, false);
    const closed_windows = { ...this.state.closed_windows, [objId]: true };
    const favourite_apps = { ...this.state.favourite_apps };
    if (this.initFavourite[objId] === false) favourite_apps[objId] = false;
    this.setState({ closed_windows, favourite_apps });
  };

  focus = (objId) => {
    const focused_windows = { ...this.state.focused_windows };
    for (const key in focused_windows) {
      focused_windows[key] = key === objId;
    }
    this.setState({ focused_windows });
  };

  toggleAllApps = () => this.setState({ allAppsView: !this.state.allAppsView });

  render() {
    return (
      <Stage data-context="desktop-area">
        <WindowArea>{this.renderWindows()}</WindowArea>
        <BackgroundImage img={this.props.bg_image_name} />
        <SideBar
          apps={apps}
          hide={this.state.hideSideBar}
          hideSideBar={this.hideSideBar}
          favourite_apps={this.state.favourite_apps}
          showAllApps={this.toggleAllApps}
          closed_windows={this.state.closed_windows}
          focused_windows={this.state.focused_windows}
          isMinimized={this.state.minimized_windows}
          openAppByAppId={this.openApp}
        />
        <DesktopShortcuts data-context="desktop-area">
          {this.renderDesktopApps()}
        </DesktopShortcuts>
        <DesktopMenu active={this.state.context_menus.desktop} openApp={this.openApp} />
        <DefaultMenu active={this.state.context_menus.default} />
        {this.state.allAppsView && (
          <AllApplications apps={apps} openApp={this.openApp} />
        )}
      </Stage>
    );
  }
}
