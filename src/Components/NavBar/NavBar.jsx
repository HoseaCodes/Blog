import React, {useReducer, useContext } from "react";
import "./NavBar.css";
import burger from '../../Assets/Images/burger-min.png';
import { Link } from "react-router-dom";
import Logo from '../../Assets/Images/logo-min.png';
import { GlobalState } from '../../GlobalState';
import {StyledHr} from '../../Layout/Hr/styledHr';
import axios from "axios";
import { AiOutlineShoppingCart } from 'react-icons/ai';


const NavBar = () => {
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn
  const [isAdmin] = state.userAPI.isAdmin
  const [user] = state.userAPI.user
  const [cart] = state.userAPI.cart;
  const [isActive, toggle] = useReducer(
      (isActive) => !isActive,
      true
      );

  const logoutUser = async () => {
    await axios.post("/api/user/logout");
    localStorage.removeItem("firstLogin");
    window.location.href = "/";
  };

  const adminRouter = () => {
		return (
			<>
      	<Link className="nav-link" to="/create_product">Create Product</Link>
        <Link to="/products" className="nav-link">Products</Link>
        {/* Admin User Management */}
        <Link to="/users" className="nav-link">Users</Link>
			</>
		)};

    const loggedInRouter = () => {
      return (
        <>
          <Link to="/profile" className="nav-link">Profile</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link className="nav-link" to="/history">History</Link>
          <div className="nav-link" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <span >{cart.length}</span>
            <Link to="/cart">
              {" "}
              <AiOutlineShoppingCart style={{marginLeft: '1rem',color: 'white'}}/>
              {/* <img src={} alt="Shoppingcart" width="30" /> */}
            </Link>
          </div>
          <Link to="/settings" className="nav-link">Settings</Link>
          <Link className="nav-link" onClick={logoutUser}>Logout</Link>
        </>
      )};

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
                  <h1 style={{color: 'white'}}>Welcome, {user.name.split(' ')[0]}</h1>
                }
                <ul className={`left-nav ${isActive ? "" : "left-nav open"}`}>
                    <Link to="/" className="nav-link active">Home</Link>
                    <Link to="/blog" className="nav-link">Blog</Link>
                    {isAdmin && adminRouter()}
                    {
                      isLoggedIn ?
                      loggedInRouter()
                      :
                      <>
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
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                      </>
                    }

                    {/* {isAdmin ?
                    ("")
                    :
                    (
                      <div className="cart-icon">
                        <span>{cart.length}</span>
                        <Link to="/cart">
                          {" "}
                          <img src={Cart} alt="Shoppingcart" width="30" />
                        </Link>
                      </div>
                    )} */}
                </ul>
            </nav>
            <StyledHr Primary/>
        </header>

    )
}


export default NavBar;
