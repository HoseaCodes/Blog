import React from 'react';
import NavBar from '../../Components/NavBar/NavBar';
import HeroImage from '../../Components/Hero/heroImage';
import Footer from '../../Components/Footer/Footer';
import { StyledHr } from '../../Layout/Hr/styledHr';
import { StyledQuoteContainer, StyledQuote, StyledQuoteAuthor } from '../../Layout/Quote/styledQuote';
import Timeline from '../../Components/Timeline/timeline';

const About = () => {
    return (
        <div>
            <NavBar />
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
            {/* <!-- Quote/Highlight End  --> */}

            {/* <!-- Timeline  -->  */}
            <StyledHr Primary/>
            <Timeline/>
            {/* <!-- Timeline End  --> */}
            <StyledHr Primary/>
            <Footer/>
        </div>
    )
}

export default About;
