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
                    <a href="http://www.dominiquehosea.com" target="_blank" className="nav-link">Portfolio</a>
                    {/* <Link to="/projects" id='project-link' className="nav-link">Projects</Link> */}
                    <Link to="/articles" id='article-link' className="nav-link">Articles</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    {/* <a href="https://teespring.com/stores/hoseacodes-2" className="nav-link">Shop</a> */}
                    <Link to="/contact" className="nav-link">Contact</Link>
                    {/* <Toggle theme={theme} toggleTheme={themeToggler} /> */}
                </ul>
            </nav>
            <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
        </header>

    )
}


export default NavBar2;
