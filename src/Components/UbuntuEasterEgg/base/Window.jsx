import React, { Component } from 'react';
import Draggable from 'react-draggable';
import styled, { css } from 'styled-components';
import { ubuntuTheme, asset } from '../styled/tokens';
import { closeWindow } from '../styled/animations';

const TRANSPARENT_DRAG_IMG =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

const Frame = styled.div`
  position: absolute;
  pointer-events: auto;
  min-width: 25%;
  min-height: 25%;
  width: ${(p) => p.$width}%;
  height: ${(p) => p.$height}%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${ubuntuTheme.bg.coolGrey};
  border: 1px solid rgba(0, 0, 0, 0.4);
  border-top: 0;
  box-shadow: ${ubuntuTheme.shadow.window};
  border-radius: ${(p) => (p.$maximized ? '0' : '8px 8px 0 0')};
  filter: ${(p) => (p.$focused ? 'none' : 'brightness(90%)')};
  z-index: ${(p) => (p.$focused ? 30 : 20)};
  cursor: ${(p) => p.$cursor};
  transition: ${(p) => (p.$maximized ? 'all 300ms ease' : 'none')};
  ${(p) =>
    p.$minimized &&
    css`
      opacity: 0;
      visibility: hidden;
      transition: opacity 200ms ease, visibility 200ms ease;
    `}
  ${(p) =>
    p.$closed &&
    css`
      animation: ${closeWindow} 200ms 1 forwards;
    `}
`;

const TitleBar = styled.div`
  position: relative;
  background: ${ubuntuTheme.bg.windowTitle};
  border-top: 2px solid rgba(255, 255, 255, 0.05);
  padding: 6px 12px;
  color: #fff;
  width: 100%;
  user-select: none;
`;

const TitleText = styled.div`
  display: flex;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 700;
`;

const EditButtons = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin-top: 4px;
  margin-right: 4px;
  display: flex;
  align-items: center;
`;

const ButtonBubble = styled.span`
  margin: 4px 6px 0;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: rgba(255, 255, 255, 0);
  &:hover { background: rgba(255, 255, 255, 0.1); }
  img { width: 20px; height: 20px; }
`;

const CloseButton = styled.button`
  margin: 4px 6px 0;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  outline: none;
  cursor: pointer;
  background: ${ubuntuTheme.bg.orange};
  opacity: 0.9;
  &:hover { opacity: 1; }
  img { width: 20px; height: 20px; }
`;

const ResizeBorderY = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: calc(100% - 10px);
  width: calc(100% + 10px);
  cursor: e-resize;
  pointer-events: none;
`;

const ResizeBorderX = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: calc(100% + 10px);
  width: calc(100% - 10px);
  cursor: n-resize;
  pointer-events: none;
`;

const MainScreen = styled.div`
  width: 100%;
  flex-grow: 1;
  position: relative;
  z-index: 20;
  max-height: 100%;
  overflow-y: auto;
  background: ${ubuntuTheme.bg.geditDarker};
  ::-webkit-scrollbar { width: 6px; background: transparent; }
  ::-webkit-scrollbar-track { box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); background: transparent; }
  ::-webkit-scrollbar-thumb { background: #D3D7CF; border-radius: 5px; }
`;

class TransparentDragger extends Component {
  componentDidMount() {
    this.img = new Image(0, 0);
    this.img.src = TRANSPARENT_DRAG_IMG;
    this.img.style.opacity = 0;
  }
  onDragStart = (e) => {
    if (this.img) e.dataTransfer.setDragImage(this.img, 0, 0);
  };
  render() {
    return this.props.children(this.onDragStart);
  }
}

export class Window extends Component {
  constructor() {
    super();
    this.startX = 60;
    this.startY = 10;
    this.state = {
      cursorType: 'default',
      width: 60,
      height: 85,
      closed: false,
      maximized: false,
      parentSize: { height: 100, width: 100 },
    };
  }

  componentDidMount() {
    this.id = this.props.id;
    this.setDefaultWindowDimension();
    window.addEventListener('resize', this.resizeBoundaries);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeBoundaries);
  }

  setDefaultWindowDimension = () => {
    if (window.innerWidth < 640) {
      this.setState({ height: 60, width: 85 }, this.resizeBoundaries);
    } else {
      this.setState({ height: 85, width: 60 }, this.resizeBoundaries);
    }
  };

  resizeBoundaries = () => {
    this.setState({
      parentSize: {
        height: window.innerHeight - window.innerHeight * (this.state.height / 100.0) - 28,
        width: window.innerWidth - window.innerWidth * (this.state.width / 100.0),
      },
    });
  };

  changeCursorToMove = () => {
    this.focusWindow();
    if (this.state.maximized) this.restoreWindow();
    this.setState({ cursorType: 'move' });
  };

  changeCursorToDefault = () => this.setState({ cursorType: 'default' });

  handleVerticalResize = () => {
    this.setState({ height: this.state.height + 0.1 }, this.resizeBoundaries);
  };

  handleHorizontalResize = () => {
    this.setState({ width: this.state.width + 0.1 }, this.resizeBoundaries);
  };

  setWindowsPosition = () => {
    const r = document.querySelector('#' + this.id);
    if (!r) return;
    const rect = r.getBoundingClientRect();
    r.style.setProperty('--window-transform-x', rect.x.toFixed(1).toString() + 'px');
    r.style.setProperty('--window-transform-y', (rect.y.toFixed(1) - 32).toString() + 'px');
  };

  checkOverlap = () => {
    const r = document.querySelector('#' + this.id);
    if (!r) return;
    const rect = r.getBoundingClientRect();
    if (rect.x.toFixed(1) < 50) {
      this.props.hideSideBar(this.id, true);
    } else {
      this.props.hideSideBar(this.id, false);
    }
  };

  focusWindow = () => this.props.focus(this.id);

  minimizeWindow = () => {
    let posx = -310;
    if (this.state.maximized) posx = -510;
    this.setWindowsPosition();
    const sidebarEl = document.querySelector('#sidebar-' + this.id);
    const r = document.querySelector('#' + this.id);
    if (!r) return;
    if (sidebarEl) {
      const sidebarRect = sidebarEl.getBoundingClientRect();
      r.style.transform = `translate(${posx}px,${sidebarRect.y.toFixed(1) - 240}px) scale(0.2)`;
    }
    this.props.hasMinimised(this.id);
  };

  restoreWindow = () => {
    const r = document.querySelector('#' + this.id);
    if (!r) return;
    this.setDefaultWindowDimension();
    const posx = r.style.getPropertyValue('--window-transform-x');
    const posy = r.style.getPropertyValue('--window-transform-y');
    r.style.transform = `translate(${posx},${posy})`;
    setTimeout(() => {
      this.setState({ maximized: false });
      this.checkOverlap();
    }, 300);
  };

  maximizeWindow = () => {
    if (this.state.maximized) {
      this.restoreWindow();
      return;
    }
    this.focusWindow();
    const r = document.querySelector('#' + this.id);
    if (!r) return;
    this.setWindowsPosition();
    r.style.transform = 'translate(-1pt,-2pt)';
    this.setState({ maximized: true, height: 96.3, width: 100.2 });
    this.props.hideSideBar(this.id, true);
  };

  closeWindow = () => {
    this.setWindowsPosition();
    this.setState({ closed: true }, () => {
      this.props.hideSideBar(this.id, false);
      setTimeout(() => this.props.closed(this.id), 300);
    });
  };

  render() {
    const { title, isFocused, minimized, screen, windowProps } = this.props;
    return (
      <Draggable
        axis="both"
        handle=".ubuntu-window-title-handle"
        grid={[1, 1]}
        scale={1}
        onStart={this.changeCursorToMove}
        onStop={this.changeCursorToDefault}
        onDrag={this.checkOverlap}
        allowAnyClick={false}
        defaultPosition={{ x: this.startX, y: this.startY }}
        bounds={{ left: 0, top: 0, right: this.state.parentSize.width, bottom: this.state.parentSize.height }}
      >
        <Frame
          id={this.id}
          $width={this.state.width}
          $height={this.state.height}
          $maximized={this.state.maximized}
          $focused={isFocused}
          $minimized={minimized}
          $closed={this.state.closed}
          $cursor={this.state.cursorType}
        >
          <TransparentDragger>
            {(onDragStart) => (
              <ResizeBorderY $disabled={this.state.maximized} onDragStart={onDragStart} onDrag={this.handleHorizontalResize} />
            )}
          </TransparentDragger>
          <TransparentDragger>
            {(onDragStart) => (
              <ResizeBorderX $disabled={this.state.maximized} onDragStart={onDragStart} onDrag={this.handleVerticalResize} />
            )}
          </TransparentDragger>
          <TitleBar className="ubuntu-window-title-handle">
            <TitleText>{title}</TitleText>
            <EditButtons>
              <ButtonBubble onClick={this.minimizeWindow}>
                <img src={asset('themes/Yaru/window/window-minimize-symbolic.svg')} alt="minimize" />
              </ButtonBubble>
              <ButtonBubble onClick={this.maximizeWindow}>
                <img
                  src={asset(
                    this.state.maximized
                      ? 'themes/Yaru/window/window-restore-symbolic.svg'
                      : 'themes/Yaru/window/window-maximize-symbolic.svg'
                  )}
                  alt={this.state.maximized ? 'restore' : 'maximize'}
                />
              </ButtonBubble>
              <CloseButton tabIndex={-1} id={`close-${this.id}`} onClick={this.closeWindow}>
                <img src={asset('themes/Yaru/window/window-close-symbolic.svg')} alt="close" />
              </CloseButton>
            </EditButtons>
          </TitleBar>
          <MainScreen>{screen ? screen(windowProps || {}) : null}</MainScreen>
        </Frame>
      </Draggable>
    );
  }
}

export default Window;
