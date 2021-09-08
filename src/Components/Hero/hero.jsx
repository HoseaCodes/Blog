import React from 'react';
import Scramble from '../Scramble/Scramble';
import {HeroContainer, HeroPositioning, HeroText} from '../../Layout/Hero/styledHero';

const Hero = (props) => {
  const {firstName, lastName} = props.username
  return (
    <>
      <HeroContainer Home>
        <HeroPositioning >
            <h1>
              <HeroText Left>{firstName}</HeroText>
              <HeroText Right>{lastName}</HeroText>
              <div><Scramble /></div>
            </h1>
          </HeroPositioning>
        </HeroContainer>
    </>
  )
}

export default Hero;
