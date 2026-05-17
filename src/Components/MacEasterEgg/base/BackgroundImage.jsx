import React from 'react';
import styled from 'styled-components';
import { macAsset } from '../styled/tokens';

const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: -10;
  background-image: url(${macAsset('surtur-wallpaper.jpg')});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

export default function BackgroundImage() {
  return <Background />;
}
