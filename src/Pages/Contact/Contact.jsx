import React from 'react';
import Footer from '../../Components/Footer/Footer';
import ContactForm from '../../Components/Form/ContactForm';
import NavBar from '../../Components/NavBar/NavBar';
import { StyledHr } from '../../Layout/Hr/styledHr';
import './Contact.css'

const Contact = () => {
    return (
        <>
            <NavBar />
            <div className="contact-wrapper">
                <div className="contact-container">
                    <h2 className="contact-descp">Contact</h2>
                    <h3 className="contact-title">Let's Work</h3>
                    <h3 className="contact-subtitle">Together</h3>
                    <h3 className="contact-style">Connect</h3>
                    <div className="contact-items">
                        <ContactForm/>
                        <div className="contact-item">
                            <h4>
                                Address
                            </h4>
                            <p>
                                Workplace
                                <p>
                                    Houston, TX
                                </p>
                            </p>
                        </div>
                        <div className="contact-item">
                            <h4>
                                Phone
                            </h4>
                            <p>
                                +1 832-377-6772
                            </p>
                        </div>
                        <div className="contact-item">
                            <h4>
                                Email
                            </h4>
                            <p className="contact-email">
                                <a href="mailto:mr.dhosea@gmail.com">mr.dhosea@gmail.com</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <StyledHr Primary/>
            <Footer/>
        </>
    )
}

export default Contact;
