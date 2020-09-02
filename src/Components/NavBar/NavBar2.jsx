import React from 'react';
import "./NavBar2.css";
import { Link } from "react-router-dom";



const NavBar2 = () => {
    return (
        <div className="header-nav">
            <div className="left-nav">
                <Link to="/" className="item active">Home</Link>
                <Link to="/projects" className="item">Projects</Link>
                <Link to="/articles" className="item">Articles</Link>
                <Link to="/about" className="item">About</Link>
                <Link to="/contact" className="item">Contact</Link>
            </div>

        </div>

    )
};

export default NavBar2;
