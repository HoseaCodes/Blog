import React from 'react';
import styled from 'styled-components';
import { ubuntuTheme } from '../styled/tokens';

const Menu = styled.div`
  position: absolute;
  width: 208px;
  background: ${ubuntuTheme.bg.contextMenu};
  border: 1px solid rgba(17, 24, 39, 0.6);
  border-radius: 4px;
  color: #fff;
  padding: 16px 0;
  z-index: 50;
  font-size: 0.875rem;
  display: ${(p) => (p.$active ? 'block' : 'none')};
  cursor: default;
  user-select: none;
`;

const Item = styled.a`
  display: block;
  width: 100%;
  padding: 2px 0;
  margin-bottom: 6px;
  color: #fff;
  text-decoration: none;
  cursor: pointer;
  &:hover { background: rgba(174, 167, 159, 0.2); }
  .lead { margin-left: 20px; }
  .label { margin-left: 8px; }
`;

const Divider = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 4px 0;
  > div {
    width: 40%;
    border-top: 1px solid rgba(17, 24, 39, 0.8);
  }
`;

function DefaultMenu({ active }) {
  const resetUbuntu = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('hoseacodes:ubuntu:'))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  };
  return (
    <Menu id="default-menu" $active={active}>
      <Item href="https://github.com/hoseacodes" target="_blank" rel="noreferrer noopener">
        <span className="lead">🤝</span><span className="label">Follow on <strong>GitHub</strong></span>
      </Item>
      <Item href="https://www.linkedin.com/in/dominique-hosea" target="_blank" rel="noreferrer noopener">
        <span className="lead">🙋‍♂️</span><span className="label">Follow on <strong>LinkedIn</strong></span>
      </Item>
      <Item href="/contact">
        <span className="lead">📥</span><span className="label">Contact</span>
      </Item>
      <Divider><div /></Divider>
      <Item as="div" onClick={resetUbuntu}>
        <span className="lead">🧹</span><span className="label">Reset Ubuntu</span>
      </Item>
    </Menu>
  );
}

export default DefaultMenu;
