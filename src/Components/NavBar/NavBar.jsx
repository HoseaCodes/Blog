import React, {useReducer, useContext } from "react";
import axios from "axios";
import "./NavBar.css";
import burger from '../../Assets/Images/burger-min.png';
import Logo from '../../Assets/Images/logo-min.png';
import { Link } from "react-router-dom";
import { GlobalState } from '../../GlobalState';
import {StyledHr} from '../../Layout/Hr/styledHr';
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
      	{/* <Link className="nav-link" to="/create_product">Create Product</Link>
        <Link to="/products" className="nav-link">Products</Link> */}
        <Link to="/users" className="nav-link">Users</Link>
        <li className="dropdown">
          <a className="nav-link dropdown-toggle" href="/"
              id="navdrop" role="button" data-toggle="dropdown"
              data-hover="dropdown">Products</a>
          <div className="dropdown-menu" aria-labelledby="navdrop">
              <Link to={"/create_product"} className="dropdown-item nav-link">Create Product</Link>
              <Link to={"/products"} rel="noopener noreferrer"
                className="dropdown-item nav-link">View Products</Link>
          </div>
        </li>
        {/* Admin User Management */}
			</>
		)};

    const publicRouter = () => {
      return (
        <>
          <Link to="/" className="nav-link active">Home</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <li className="dropdown">
            <a className="nav-link dropdown-toggle" href="/"
                id="navdrop" role="button" data-toggle="dropdown"
                data-hover="dropdown">Portfolio</a>
            <div className="dropdown-menu" aria-labelledby="navdrop">
              <Link href="http://www.dominiquehosea.com" rel="noopener noreferrer"
                 target="_blank" className="dropdown-item nav-link">Backend Portfolio</Link>
              <Link href="/project" rel="noopener noreferrer"
                 className="dropdown-item nav-link">Project Case Studies</Link>
            </div>
          </li>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </>
      )};

    const loggedInRouter = () => {
      return (
        <>
          {/* <Link to="/blog/new" className="nav-link">Create Post</Link> */}
          {
            isAdmin  ?
            null
            :
          <Link to="/" className="nav-link active">Home</Link>
          }
          <li className="dropdown">
            <a className="nav-link dropdown-toggle" href="/"
                id="navdrop" role="button" data-toggle="dropdown"
                data-hover="dropdown">Blog</a>
            <div className="dropdown-menu" aria-labelledby="navdrop">
                <Link to={"/blog/new"} className="dropdown-item nav-link">Create Post</Link>
                <Link to={"/blog"} rel="noopener noreferrer"
                  className="dropdown-item nav-link">View Blog</Link>
            </div>
          </li>
          <li className="dropdown">
            <a className="nav-link dropdown-toggle" href="/"
                id="navdrop" role="button" data-toggle="dropdown"
                data-hover="dropdown">Shop</a>
            <div className="dropdown-menu" aria-labelledby="navdrop">
                <Link to="/shop" className="nav-link"> View Shop</Link>
                <Link className="nav-link" to="/history">View Order History</Link>
                <div className="nav-link" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <span >{cart.length}</span>
                  <Link to="/cart">
                    {" "}
                    <AiOutlineShoppingCart style={{marginLeft: '1rem',color: 'white'}}/>
                    {/* <img src={} alt="Shoppingcart" width="30" /> */}
                  </Link>
                </div>
            </div>
          </li>
          <li className="dropdown">
            <a className="nav-link dropdown-toggle" href="/"
                id="navdrop" role="button" data-toggle="dropdown"
                data-hover="dropdown">Settings</a>
            <div className="dropdown-menu" aria-labelledby="navdrop">
                <Link to="/profile" className="nav-link">View Profile</Link>
                <Link to="/settings" className="nav-link">View Settings</Link>
            </div>
          </li>
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
                  <Link to="/login" >
                    <img className='nav-logo' src={Logo} alt="HoseaCodes" />
                  </Link>
                  :
                  <h1 style={{color: 'white'}}>Welcome, {user.name.split(' ')[0]}</h1>
                }
                <ul className={`left-nav ${isActive ? "" : "left-nav open"}`}>
                    {isAdmin && adminRouter()}
                    {
                      isLoggedIn ?
                      loggedInRouter()
                      :
                      publicRouter()

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
