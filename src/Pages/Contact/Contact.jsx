//Make it easy for your audience to 
//contact you. You can create a separate 
//“Contact” section, a “Contact” 
//call-to-action button, or both. One 
//best practice is to include multiple, 
//easily accessible ways for your audience 
//to contact you, as they navigate their 
//way through your website. Include a 
//contact form, your email address, or 
//both in this section. It’s not necessary 
//to include your phone number or address 
//in your website’s contact information.

import React from 'react';
import './Contact.css'
import NavBar from '../../Components/NavBar/NavBar';
import ContactForm from '../../Components/Form/ContactForm'

const Contact = () => {
    return (
        <div >
            <NavBar />
            <div className='cHeader'>
                <div className='header-logo'>
                    <h1 className='heading-primary'>
                        <span className="header-username"></span>
                    </h1>
                </div>
            </div>
            <hr className="header-hr "/>
            <h2 className='contacth2'>Contact Me</h2>
            <ContactForm />
        </div >
    )

}

export default Contact;
