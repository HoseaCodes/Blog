import React from 'react';
import styled from 'styled-components';
import DockApp from '../base/DockApp';
import { macTheme } from '../styled/tokens';

const Bar = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 8px;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  padding: 6px 10px;
  background: ${macTheme.bg.dock};
  backdrop-filter: blur(28px) saturate(180%);
  -webkit-backdrop-filter: blur(28px) saturate(180%);
  border: 1px solid ${macTheme.bg.dockBorder};
  border-radius: 18px;
  box-shadow: ${macTheme.shadow.dock};
  z-index: 45;
  max-width: 95vw;
  overflow: visible;
`;

export default function Dock({ apps, openApp, closedWindows }) {
  return (
    <Bar>
      {apps.map((app) => (
        <DockApp
          key={app.id}
          id={app.id}
          title={app.title}
          icon={app.icon}
          isOpen={closedWindows[app.id] === false}
          onOpen={openApp}
        />
      ))}
    </Bar>
  );
}
