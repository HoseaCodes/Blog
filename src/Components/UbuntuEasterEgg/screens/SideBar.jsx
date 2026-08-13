import React, { useState } from 'react';
import styled from 'styled-components';
import SideBarApp from '../base/SideBarApp';
import { ubuntuTheme, asset } from '../styled/tokens';

const Dock = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: auto;
  padding-top: ${ubuntuTheme.navbarHeight};
  z-index: 40;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  user-select: none;
  transition: transform 300ms ease;
  transform: ${(p) => (p.$hidden ? 'translateX(-100%)' : 'translateX(0)')};
`;

const HoverStrip = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  z-index: 50;
`;

const AllAppsTile = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 4px;
  margin: 4px;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.1); }
`;

const AllAppsIcon = styled.img`
  width: 28px;
  height: 28px;
`;

const Tooltip = styled.div`
  position: absolute;
  top: 6px;
  left: 100%;
  margin-left: 20px;
  padding: 2px 6px;
  font-size: 0.875rem;
  color: ${ubuntuTheme.text.grey};
  background: rgba(17, 17, 17, 0.7);
  border: 1px solid rgba(156, 163, 175, 0.4);
  border-radius: 6px;
  white-space: nowrap;
  visibility: ${(p) => (p.$show ? 'visible' : 'hidden')};
`;

function renderApps(props) {
  const out = [];
  props.apps.forEach((app, index) => {
    if (props.favourite_apps[app.id] === false) return;
    out.push(
      <SideBarApp
        key={index}
        id={app.id}
        title={app.title}
        icon={app.icon}
        isClose={props.closed_windows}
        isFocus={props.focused_windows}
        openApp={props.openAppByAppId}
        isMinimized={props.isMinimized}
      />
    );
  });
  return out;
}

export function AllApps({ onClick }) {
  const [showTitle, setShowTitle] = useState(false);
  return (
    <AllAppsTile
      onMouseEnter={() => setShowTitle(true)}
      onMouseLeave={() => setShowTitle(false)}
      onClick={onClick}
    >
      <AllAppsIcon src={asset('themes/Yaru/system/view-app-grid-symbolic.svg')} alt="Ubuntu view app" />
      <Tooltip $show={showTitle}>Show Applications</Tooltip>
    </AllAppsTile>
  );
}

export default function SideBar(props) {
  const showSideBar = () => props.hideSideBar(null, false);
  const hideSideBar = () => {
    setTimeout(() => props.hideSideBar(null, true), 2000);
  };
  return (
    <>
      <Dock $hidden={props.hide}>
        {Object.keys(props.closed_windows).length !== 0 ? renderApps(props) : null}
        <AllApps onClick={props.showAllApps} />
      </Dock>
      <HoverStrip onMouseEnter={showSideBar} onMouseLeave={hideSideBar} />
    </>
  );
}
