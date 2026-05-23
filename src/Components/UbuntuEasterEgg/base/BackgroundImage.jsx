import React from 'react';
import styled from 'styled-components';
import { asset } from '../styled/tokens';

const Background = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: -10;
  overflow: hidden;
  height: 100%;
  width: 100%;
  background-image: url(${(p) => asset(`wallpapers/${p.$img}.webp`)});
  background-size: cover;
  background-repeat: no-repeat;
  background-position-x: center;
`;

const BackgroundImage = ({ img }) => <Background $img={img || 'wall-2'} />;

export default BackgroundImage;
