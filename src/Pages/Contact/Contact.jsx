import React from 'react';
import ContactForm from '../../Components/Form/ContactForm'
import { StyledHr } from '../../Layout/Hr/styledHr';
import { HeroContainer, HeroPositioning} from '../../Layout/Hero/styledHero';
import { StyledH2 } from '../../Layout/Headers/styledH2';
import { StyledContainer } from '../../Layout/Container/styledContainer';

const Contact = () => {
    return (
      <>
        <HeroContainer Contact>
          <HeroPositioning/>
        </HeroContainer>
        <StyledHr Primary/>
        <StyledContainer >
          <StyledH2>Contact Me</StyledH2>
          <ContactForm />
        </StyledContainer >
        <StyledHr Primary/>
        </>
    )

}

export default Contact;
