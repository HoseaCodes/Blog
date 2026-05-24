import React, { Component } from 'react';
import Draggable from 'react-draggable';
import styled from 'styled-components';
import { macTheme } from '../styled/tokens';

const Frame = styled.div`
  position: absolute;
  pointer-events: auto;
  min-width: 360px;
  min-height: 240px;
  width: ${(p) => p.$width}%;
  height: ${(p) => p.$height}%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${macTheme.bg.windowBg};
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: ${macTheme.shadow.window};
  filter: ${(p) => (p.$focused ? 'none' : 'brightness(95%)')};
  z-index: ${(p) => (p.$focused ? 30 : 20)};
  cursor: ${(p) => p.$cursor};
  ${(p) =>
    p.$minimized &&
    `
      opacity: 0;
      visibility: hidden;
      transition: opacity 200ms ease, visibility 200ms ease;
    `}
  ${(p) =>
    p.$maximized &&
    `
      border-radius: 0;
      transition: all 250ms ease;
    `}
`;

const TitleBar = styled.div`
  position: relative;
  height: 28px;
  background: ${macTheme.bg.windowChrome};
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  padding: 0 12px;
  user-select: none;
  flex-shrink: 0;
`;

const TitleText = styled.div`
  flex: 1;
  text-align: center;
  color: ${macTheme.text.primary};
  font-size: 13px;
  font-weight: 600;
  pointer-events: none;
`;

const TrafficLights = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  left: 12px;
  &:hover .traffic-glyph { opacity: 1; }
`;

const TrafficDot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: ${(p) => p.$color};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: rgba(0, 0, 0, 0.5);
  outline: none;
  .traffic-glyph {
    opacity: 0;
    transition: opacity 100ms ease;
  }
  &:hover .traffic-glyph { opacity: 1; }
`;

const MainScreen = styled.div`
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 20;
  overflow: auto;
  background: ${macTheme.bg.windowContent};
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 4px; }
`;

const ResizeHandleRight = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: 100%;
  cursor: ew-resize;
  z-index: 25;
  user-select: none;
`;

const ResizeHandleBottom = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 6px;
  cursor: ns-resize;
  z-index: 25;
  user-select: none;
`;

const ResizeHandleCorner = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 14px;
  height: 14px;
  cursor: nwse-resize;
  z-index: 26;
  user-select: none;
`;

const ResizeOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  cursor: ${(p) => p.$cursor};
  background: transparent;
`;

export default class MacWindow extends Component {
  constructor() {
    super();
    this.startX = 80;
    this.startY = 40;
    this.state = {
      cursorType: 'default',
      width: 55,
      height: 70,
      maximized: false,
      resizing: false,
      parentSize: { width: 100, height: 100 },
    };
  }

  componentDidMount() {
    this.id = this.props.id;
    this.setDefaultDimensions();
    window.addEventListener('resize', this.resizeBoundaries);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeBoundaries);
  }

  setDefaultDimensions = () => {
    if (window.innerWidth < 640) {
      this.setState({ height: 60, width: 90 }, this.resizeBoundaries);
    } else {
      this.setState({ height: 70, width: 55 }, this.resizeBoundaries);
    }
  };

  resizeBoundaries = () => {
    this.setState({
      parentSize: {
        height: window.innerHeight - window.innerHeight * (this.state.height / 100) - 30,
        width: window.innerWidth - window.innerWidth * (this.state.width / 100),
      },
    });
  };

  focusWindow = () => this.props.focus(this.id);
  cursorMove = () => {
    this.focusWindow();
    if (this.state.maximized) this.restore();
    this.setState({ cursorType: 'grabbing' });
  };
  cursorDefault = () => this.setState({ cursorType: 'default' });

  setPosition = () => {
    const r = document.querySelector('#mac-' + this.id);
    if (!r) return;
    const rect = r.getBoundingClientRect();
    r.style.setProperty('--mac-x', rect.x.toFixed(1) + 'px');
    r.style.setProperty('--mac-y', rect.y.toFixed(1) + 'px');
  };

  minimize = () => {
    this.setPosition();
    this.props.hasMinimised(this.id);
  };

  restore = () => {
    this.setDefaultDimensions();
    this.setState({ maximized: false });
  };

  maximize = () => {
    if (this.state.maximized) {
      this.restore();
      return;
    }
    this.focusWindow();
    this.setState({ maximized: true, height: 92, width: 100 });
  };

  close = () => {
    this.setPosition();
    this.props.closed(this.id);
  };

  startResize = (axis) => (e) => {
    if (this.state.maximized) return;
    e.preventDefault();
    e.stopPropagation();
    this.focusWindow();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = this.state.width;
    const startH = this.state.height;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const MIN_W = 25;
    const MIN_H = 25;
    const MAX_W = 99;
    const MAX_H = 92;

    const onMove = (ev) => {
      let nextW = startW;
      let nextH = startH;
      if (axis === 'x' || axis === 'xy') {
        const dw = ((ev.clientX - startX) / vw) * 100;
        nextW = Math.max(MIN_W, Math.min(MAX_W, startW + dw));
      }
      if (axis === 'y' || axis === 'xy') {
        const dh = ((ev.clientY - startY) / vh) * 100;
        nextH = Math.max(MIN_H, Math.min(MAX_H, startH + dh));
      }
      this.setState({ width: nextW, height: nextH }, this.resizeBoundaries);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      this.setState({ resizing: false });
    };

    this.setState({ resizing: true });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  render() {
    const { title, isFocused, minimized, screen, windowProps } = this.props;
    return (
      <Draggable
        axis="both"
        handle=".mac-window-title-handle"
        grid={[1, 1]}
        scale={1}
        onStart={this.cursorMove}
        onStop={this.cursorDefault}
        allowAnyClick={false}
        defaultPosition={{ x: this.startX, y: this.startY }}
        bounds={{ left: 0, top: 0, right: this.state.parentSize.width, bottom: this.state.parentSize.height }}
      >
        <Frame
          id={'mac-' + this.id}
          $width={this.state.width}
          $height={this.state.height}
          $focused={isFocused}
          $minimized={minimized}
          $maximized={this.state.maximized}
          $cursor={this.state.cursorType}
          onMouseDown={this.focusWindow}
        >
          <TitleBar className="mac-window-title-handle">
            <TrafficLights>
              <TrafficDot $color={macTheme.bg.trafficClose} onClick={this.close} aria-label="close">
                <span className="traffic-glyph">×</span>
              </TrafficDot>
              <TrafficDot $color={macTheme.bg.trafficMin} onClick={this.minimize} aria-label="minimize">
                <span className="traffic-glyph">−</span>
              </TrafficDot>
              <TrafficDot $color={macTheme.bg.trafficMax} onClick={this.maximize} aria-label="maximize">
                <span className="traffic-glyph">+</span>
              </TrafficDot>
            </TrafficLights>
            <TitleText>{title}</TitleText>
          </TitleBar>
          <MainScreen>{screen ? screen(windowProps || {}) : null}</MainScreen>
          {!this.state.maximized && (
            <>
              <ResizeHandleRight onMouseDown={this.startResize('x')} />
              <ResizeHandleBottom onMouseDown={this.startResize('y')} />
              <ResizeHandleCorner onMouseDown={this.startResize('xy')} />
            </>
          )}
          {this.state.resizing && <ResizeOverlay $cursor="nwse-resize" />}
        </Frame>
      </Draggable>
    );
  }
}
