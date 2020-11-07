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
        <div className="header-nav">
            <div className='burger-nav'>
                <img className='nav-img' src={burger} alt="menu" width='50px' height='50px'
                    onClick={handleToggle}
                />
            </div>
            <div className='nav-combo'>
                <img className='nav-logo' src={Logo} alt="HoseaCodes" />
                <div className={`left-nav ${isActive ? "" : "left-nav open"}`}>
                    <Link to="/" className="nav-link active">Home</Link>
                    <Link to="/projects" className="nav-link">Projects</Link>
                    <Link to="/articles" className="nav-link">Articles</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    {/* <a href="https://teespring.com/stores/hoseacodes-2" className="nav-link">Shop</a> */}
                    <Link to="/contact" className="nav-link">Contact</Link>
                    {/* <Toggle theme={theme} toggleTheme={themeToggler} /> */}
                </div>
            </div>
            <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
        </div>

    )
}


export default NavBar2;
