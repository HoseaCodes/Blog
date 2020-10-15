import React, { useState } from "react";
import "./NavBar2.css";
import burger from '../../icons/burger.jpg'
import { Link } from "react-router-dom";



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
            <div className={`left-nav ${isActive ? "" : "left-nav open"}`}>
                <Link to="/" className="item active">Home</Link>
                <Link to="/projects" className="item">Projects</Link>
                <Link to="/articles" className="item">Articles</Link>
                <Link to="/about" className="item">About</Link>
                <a href="https://teespring.com/stores/hoseacodes-2" className="item">Shop</a>
                <Link to="/contact" className="item">Contact</Link>
                {/* <Toggle theme={theme} toggleTheme={themeToggler} /> */}

            </div>

        </div>

    )
}


export default NavBar2;
