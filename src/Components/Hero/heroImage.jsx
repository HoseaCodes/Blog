import React from 'react';
import {HeroCircleImage, HeroContainer, HeroPositioning} from '../../Layout/Hero/styledHero';

const HeroImage = () => {
  return (
    <>
      <HeroContainer About>
        <HeroPositioning >
          <HeroCircleImage />
        </HeroPositioning>
        </HeroContainer>
    </>
  )
}

export default HeroImage;
