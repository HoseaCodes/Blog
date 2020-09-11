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
import NavBar2 from '../../Components/NavBar/NavBar2';


const Contact = () => {
    return (
        <div >
            <NavBar2 />
            <div className='cHeader'>
                <div className='header-logo'>
                    <h1 className='heading-primary'>
                        <span className="header-username"></span>
                    </h1>
                </div>
            </div>
            <div className='contact-container'>
                <h2 className='contact-header'>Contact Me</h2>
                <p>Have a question? I am available for hire and open to any ideas of cooperation.</p>
                <form>

                    <input className='input' type="text" name="name" placeholder="Name" />
                    <input className='input' type="email" name="email" placeholder="Enter Email" />
                    <textarea className='area' placeholder='Your Message' />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        </div >
    )

}

export default Contact;
