import React from 'react';
import "./Footer.css";



const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <div className="footer">
            <footer className="footer-item">All Rights Reserved, &copy; {year} Hosea Codes</footer>
        </div >


    )
};

export default Footer;
