import React from "react";
import axios from "axios";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function LoggedInRouter({ isAdmin, cart }) {
  const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
  const logoutUser = async () => {
    await axios.post("/api/user/logout");
    localStorage.removeItem("firstLogin");
    localStorage.removeItem("isLoggedIn");
    removeCookie("accesstoken");
    window.location.href = "/";
  };
  return (
    <>
      {isAdmin ? null : (
        <Link to="/" className="nav-link active">
          Home
        </Link>
      )}
      <li className="dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="/"
          id="navdrop"
          role="button"
          data-toggle="dropdown"
          data-hover="dropdown"
        >
          Blog
        </a>
        <div className="dropdown-menu" aria-labelledby="navdrop">
          <Link to={"/admin/blog/new"} className="dropdown-item nav-link">
            Create Post
          </Link>
          <Link
            to={"/blog"}
            rel="noopener noreferrer"
            className="dropdown-item nav-link"
          >
            View Blogs
          </Link>
        </div>
      </li>
      <li className="dropdown">
          <a className="nav-link dropdown-toggle" href="/"
              id="navdrop" role="button" data-toggle="dropdown"
              data-hover="dropdown">Shop</a>
          <div className="dropdown-menu" aria-labelledby="navdrop">
              <Link to="/shop" className="nav-link"> View Shop</Link>
              <Link className="nav-link" to="/history">Order History</Link>
              <div className="nav-link" style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <span >{cart.length}</span>
                <Link to="/cart">
                  {" "}
                  <AiOutlineShoppingCart style={{marginLeft: '1rem',color: 'white'}}/>
                  <img src={""} alt="Shoppingcart" width="30" />
                </Link>
              </div>
          </div>
        </li>
      <li className="dropdown">
          <a className="nav-link dropdown-toggle" href="/"
              id="navdrop" role="button" data-toggle="dropdown"
              data-hover="dropdown">Settings</a>
          <div className="dropdown-menu" aria-labelledby="navdrop">
              <Link to="/profile" className="nav-link">Profile</Link>
              <Link to="/settings" className="nav-link">Update Settings</Link>
          </div>
        </li>
      <Link className="nav-link" onClick={logoutUser}>
        Logout
      </Link>
    </>
  );
}
