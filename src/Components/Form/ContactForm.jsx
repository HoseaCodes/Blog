import React from 'react'
import { StyledFormSubmit } from '../../Layout/Form/styledInput';
import './Contact.css'

const ContactForm = () => {
    return (<>
        <div className='contact-container'>
            <p>Have a question? I am available for hire and open to any ideas of cooperation.</p>
            <form action="https://getform.io/f/7efda21f-ca67-48f6-8a1e-723776d4ae3b" method='POST'>
                <input className='contact-input' type="text" name="name" placeholder="Name" />
                <input className='contact-input' type="email" name="email" placeholder="Enter Email" />
                <textarea className='area' name="message" placeholder='Your Message' />
                <StyledFormSubmit type="submit" value="Submit"/>
            </form>
        </div>
    </>
    )
}
export default ContactForm;
