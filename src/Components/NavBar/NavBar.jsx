import React, {useReducer, useContext, useEffect } from "react";
import axios from "axios";
import "./NavBar.css";
import { Link } from "react-router-dom";
import { GlobalState } from '../../GlobalState';
import { StyledHeaderNav } from '../../Layout/Container/styledContainer'
import {StyledHr} from '../../Layout/Hr/styledHr';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { useCookies } from "react-cookie";
import { useLocation } from "react-router-dom";

const NavBar = () => {
  const Logo =
    "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/logo-min.png";
  const burger =
    '  const logo = "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/burger-min.png';
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const location = useLocation();
  const currentPath = location.pathname;
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn
  const [isAdmin] = state.userAPI.isAdmin
  const [user] = state.userAPI.user
  const [cart] = state.userAPI.cart;
  if (currentPath.includes("/blog/") || currentPath.includes("gamecorner")) {
    return null;
  }

  useEffect(() => {
    
      console.log(currentPath);
    
  }, []);

  const [isActive, toggle] = useReducer(
      (isActive) => !isActive,
      true
      );

  const logoutUser = async () => {
    await axios.post("/api/user/logout");
    localStorage.removeItem("firstLogin");
    localStorage.removeItem("isLoggedIn");
    removeCookie("accesstoken");
    window.location.href = "/";
  };

  const adminRouter = () => {
		return (
			<>
      	{/* <Link className="nav-link" to="/create_product">Create Product</Link>
        <Link to="/products" className="nav-link">Products</Link> */}
        <Link to="/users" className="nav-link">Users</Link>
        <Link to="/uploads" className="nav-link">Uploads</Link>
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
            <a href="http://www.dominiquehosea.com" target="_blank" rel="noopener noreferrer"
            className="dropdown-item nav-link">Backend Portfolio</a>
            <Link to="/project" rel="noopener noreferrer"
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
              <Link to={"/admin/blog/new"} className="dropdown-item nav-link">Create Post</Link>
              <Link to={"/blog"} rel="noopener noreferrer"
                className="dropdown-item nav-link">View Blogs</Link>
          </div>
        </li>
        {/* <li className="dropdown">
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
                  <img src={""} alt="Shoppingcart" width="30" />
                </Link>
              </div>
          </div>
        </li> */}
        {/* <li className="dropdown">
          <a className="nav-link dropdown-toggle" href="/"
              id="navdrop" role="button" data-toggle="dropdown"
              data-hover="dropdown">Settings</a>
          <div className="dropdown-menu" aria-labelledby="navdrop">
              <Link to="/profile" className="nav-link">View Profile</Link>
              <Link to="/settings" className="nav-link">View Settings</Link>
          </div>
        </li> */}
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
                  <h1 className='nav-title' style={{color: 'white'}}>Welcome, {user.name.split(' ')[0]}</h1>
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
            {/* <StyledHr Primary/> */}
        </header>

    )
}


export default NavBar;
