import React from 'react';
import styled from 'styled-components';
import { ubuntuTheme, asset } from '../styled/tokens';

const WALLPAPERS = [
  'wall-1', 'wall-2', 'wall-3', 'wall-4',
  'wall-5', 'wall-6', 'wall-7', 'wall-8',
];

const Wrap = styled.div`
  width: 100%;
  flex-grow: 1;
  max-height: 100%;
  overflow-y: auto;
  background: ${ubuntuTheme.bg.coolGrey};
  user-select: none;
  display: flex;
  flex-direction: column;
`;

const Preview = styled.div`
  width: 66%;
  height: 33%;
  margin: 16px auto;
  background-image: url(${(p) => asset(`wallpapers/${p.$bg}.webp`)});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 4px;
  @media (min-width: 768px) { width: 40%; }
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-top: 1px solid rgba(17, 24, 39, 0.6);
  padding-bottom: 16px;
`;

const Swatch = styled.div`
  outline: none;
  margin: 8px;
  width: 96px;
  height: 64px;
  border: 4px solid ${(p) => (p.$selected ? 'rgba(161, 98, 7, 0.8)' : 'transparent')};
  border-radius: 6px;
  cursor: pointer;
  background-image: url(${(p) => asset(`wallpapers/${p.$name}.webp`)});
  background-size: cover;
  background-position: center;
  @media (min-width: 768px) {
    width: 200px;
    height: 130px;
    margin: 16px;
  }
`;

export function Settings({ changeBackgroundImage, currBgImgName }) {
  const onPick = (name) => {
    if (changeBackgroundImage) changeBackgroundImage(name);
  };
  return (
    <Wrap>
      <Preview $bg={currBgImgName || 'wall-2'} />
      <Grid>
        {WALLPAPERS.map((name) => (
          <Swatch
            key={name}
            tabIndex={0}
            $selected={name === currBgImgName}
            $name={name}
            onClick={() => onPick(name)}
            onFocus={() => onPick(name)}
            aria-label={`Set wallpaper ${name}`}
          />
        ))}
      </Grid>
    </Wrap>
  );
}

export default Settings;

export const displaySettings = (changeBackgroundImage, currBgImgName) => (
  <Settings changeBackgroundImage={changeBackgroundImage} currBgImgName={currBgImgName} />
);
