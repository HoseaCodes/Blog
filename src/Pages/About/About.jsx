import React from 'react';
import HeroImage from '../../Components/Hero/heroImage';
import { StyledHr } from '../../Layout/Hr/styledHr';
import { StyledQuoteContainer, StyledQuote, StyledQuoteAuthor } from '../../Layout/Quote/styledQuote';
import Timeline from '../../Components/Timeline/timeline';
import quotes from '../../Constants/quotes';

const About = () => {
    return (
        <>
          <HeroImage About/>
          <StyledHr Primary/>
            <StyledQuote>
              {quotes['about']['quote']}
            </StyledQuote>
            <StyledQuoteAuthor>
                {quotes['about']['author']}
            </StyledQuoteAuthor>
          <StyledHr Primary/>
          <Timeline/>
          <StyledHr Primary/>
        </>
    )
}

export default About;
