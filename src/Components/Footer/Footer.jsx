import React from 'react';
import "./Footer.css";
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <div className="footer">
            <footer className="footer-item">
                <section className='footer-info'>
                    <div>
                        <h2>Hosea Codes</h2>
                        <p> <PhoneIphoneIcon /> +1 (281)-780-8424</p>
                        <p><AlternateEmailIcon /> <a href="mailto:mr.dhosea@gmail.com">mr.dhosea@gmail.com</a> </p>
                    </div>
                    <div className='footer-built'>
                        <h2>Built With</h2>
                        <a href="https://reactjs.org/docs/getting-started.html">React</a>
                        <a href="https://material-ui.com/">Material UI</a>
                        <a href="https://react-bootstrap.github.io/">Bootstrap</a>
                        <a href="https://sass-lang.com/">SCSS</a>
                    </div>
                </section>
                All Rights Reserved, &copy; {year} Hosea Codes
            </footer>
        </div >


    )
};

export default Footer;
