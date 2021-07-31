import React, { useState } from "react";
import "./NavBar2.css";
import burger from '../../icons/burger.jpg';
import { Link } from "react-router-dom";
import Logo from '../../icons/logo.png';


const NavBar2 = () => {
    const [isActive, setActive] = useState("false");

    const handleToggle = () => {
        setActive(!isActive);
    };
    return (
        <header className="header-nav">
            <div className='burger-nav'>
                <img className='nav-img' src={burger} alt="menu" width='50px' height='50px'
                    onClick={handleToggle}
                />
            </div>
            <nav className='nav-combo'>
                <img className='nav-logo' src={Logo} alt="HoseaCodes" />
                <ul className={`left-nav ${isActive ? "" : "left-nav open"}`}>
                    <Link to="/" className="nav-link active">Home</Link>
                    <li className="dropdown">
                        <a className="nav-link dropdown-toggle" href="#" id="navdrop" role="button" data-toggle="dropdown" data-hover="dropdown">Portfolio</a>
                        <div className="dropdown-menu" aria-labelledby="navdrop">
                            <a href="http://www.dominiquehosea.com" rel="noopener noreferrer" target="_blank" className="dropdown-item nav-link">Backend Portfolio</a>
                            <a href="/client" rel="noopener noreferrer" className="dropdown-item nav-link">Client Portfolio</a>
                            <a href="/project" rel="noopener noreferrer" className="dropdown-item nav-link">Project Case Studies</a>
                        </div>
                    </li>
                    <Link to="/blog" className="nav-link">Blog</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                </ul>
            </nav>
            <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
        </header>

    )
}


export default NavBar2;
