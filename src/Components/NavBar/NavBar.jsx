import React, {useReducer, useContext } from "react";
import "./NavBar.css";
import burger from '../../Assets/Images/burger-min.png';
import { Link } from "react-router-dom";
import Logo from '../../Assets/Images/logo-min.png';
import { GlobalState } from '../../GlobalState';
import {StyledHr} from '../../Layout/Hr/styledHr';


const NavBar = () => {
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn
  const [isAdmin] = state.userAPI.isAdmin
  const [user] = state.userAPI.user
  const [isActive, toggle] = useReducer(
      (isActive) => !isActive,
      true
      );

    return (
        <header className="header-nav conatiner">
            <div className='burger-nav'>
                <img className='nav-img' src={burger} alt="menu"
                width='50px' height='50px'
                onClick={toggle}
                />
            </div>
            <nav className='nav-combo'>
                {
                  !isLoggedIn ?
                  <img className='nav-logo' src={Logo} alt="HoseaCodes" />
                  :
                  <h1>Welcome, {user.name.split(' ')[0]}</h1>
                }
                <ul className={`left-nav ${isActive ? "" : "left-nav open"}`}>
                    <Link to="/" className="nav-link active">Home</Link>
                    <li className="dropdown">
                        <a className="nav-link dropdown-toggle" href="/"
                        id="navdrop" role="button" data-toggle="dropdown"
                        data-hover="dropdown">Portfolio</a>
                        <div className="dropdown-menu" aria-labelledby="navdrop">
                            <a href="http://www.dominiquehosea.com" rel="noopener noreferrer"
                            target="_blank" className="dropdown-item nav-link">Backend Portfolio</a>
                            <a href="/project" rel="noopener noreferrer"
                            className="dropdown-item nav-link">Project Case Studies</a>
                        </div>
                    </li>
                    <Link to="/blog" className="nav-link">Blog</Link>
                    <Link to="/about" className="nav-link">About</Link>
                    <Link to="/contact" className="nav-link">Contact</Link>
                    {
                      isLoggedIn ?
                      <>
                      <Link to="/profile" className="nav-link">Profile</Link>
                      </>
                      :
                      null
                    }
                    {
                      isAdmin ?
                      <>
                      <Link to="/settings" className="nav-link">Settings</Link>
                      </>
                      :
                      null
                    }
                </ul>
            </nav>
            <StyledHr Primary/>
        </header>

    )
}


export default NavBar;
