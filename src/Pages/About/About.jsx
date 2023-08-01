import React from 'react';
import HeroImage from '../../Components/Hero/heroImage';
import { StyledHr } from '../../Layout/Hr/styledHr';
import { StyledQuoteContainer, StyledQuote, StyledQuoteAuthor } from '../../Layout/Quote/styledQuote';
import Timeline from '../../Components/Timeline/timeline';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';

const About = () => {
    return (
        <>
          <NavBar/>
            <HeroImage About/>
            <StyledHr Primary/>
            <StyledQuoteContainer>
              <StyledQuote>
                What you think, you become. What you feel, you attract. What you imagine, you create.
              </StyledQuote>
              <StyledQuoteAuthor>
                -Buddha
              </StyledQuoteAuthor>
            </StyledQuoteContainer>
            <StyledHr Primary/>
            <Timeline/>
            <StyledHr Primary/>
          <Footer/>
        </>
    )
}

export default About;
