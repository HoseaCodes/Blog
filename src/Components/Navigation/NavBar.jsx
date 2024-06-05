import React, { useReducer, useContext } from "react";
import "./NavBar.css";
import { GlobalState } from "../../GlobalState";
import { StyledHr } from "../../Layout/Hr/styledHr";
import NavRouter from "./NavRouter";

const NavBar = () => {
  const Logo =
    "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/logo-min.png";
  const burger =
    '  const logo = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/burger-min.png';
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [isAdmin] = state.userAPI.isAdmin;
  const [user] = state.userAPI.user;
  const [cart] = state.userAPI.cart;
  const [isActive, toggle] = useReducer((isActive) => !isActive, true);

  return (
    <header className="header-nav conatiner">
      <div className="burger-nav">
        <img
          className="nav-img"
          src={burger}
          alt="menu"
          width="50px"
          height="50px"
          onClick={toggle}
        />
      </div>
      <NavRouter
        isLoggedIn={isLoggedIn}
        isActive={isActive}
        isAdmin={isAdmin}
        Logo={Logo}
        user={user}
        cart={cart}
      />
      <StyledHr Primary/>
    </header>
  );
};

export default NavBar;
