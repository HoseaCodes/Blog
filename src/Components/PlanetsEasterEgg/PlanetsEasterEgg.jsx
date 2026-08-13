import React, { Component } from 'react';
import styled from 'styled-components';
import App from './App';
import { PlanetsGlobalStyle } from './styled/globals';

const Overlay = styled.div.attrs({ className: 'hoseacodes-planets-root' })`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  overflow: auto;
  isolation: isolate;
  z-index: 99;
  background: #070724;
  color: #fff;
  pointer-events: auto;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 18px;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Antonio', sans-serif;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(255, 68, 68, 0.6);
  }
`;

export default class PlanetsEasterEgg extends Component {
  componentDidMount() {
    this.prevTitle = document.title;
    document.title = 'The Planets';
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    document.title = this.prevTitle;
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.props.onShutDown?.();
    }
  };

  render() {
    return (
      <Overlay>
        <PlanetsGlobalStyle />
        <CloseButton
          type="button"
          aria-label="Close The Planets"
          onClick={() => this.props.onShutDown?.()}
        >
          ×
        </CloseButton>
        <App />
      </Overlay>
    );
  }
}
