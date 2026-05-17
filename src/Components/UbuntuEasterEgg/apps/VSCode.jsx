import React from 'react';
import styled from 'styled-components';
import { ubuntuTheme } from '../styled/tokens';

const Frame = styled.iframe`
  height: 100%;
  width: 100%;
  border: 0;
  background: ${ubuntuTheme.bg.coolGrey};
`;

export default function VSCode() {
  return (
    <Frame
      src="https://github1s.com/HoseaCodes/Blog/blob/HEAD/README.md"
      title="VSCode"
    />
  );
}

export const displayVSCode = () => <VSCode />;
