import React from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import LoggedInRouter from "./LoggedInRouter";
import AdminRouter from "./AdminRouter";
import PublicRouter from "./PublicRouter";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function Navigation({
  isLoggedIn,
  isActive,
  isAdmin,
  Logo,
  user,
  cart,
}) {
  return (
    <nav className="nav-combo">
      {!isLoggedIn ? (
        <Link to="/login">
          <img className="nav-logo" src={Logo} alt="HoseaCodes" />
        </Link>
      ) : (
        <h1 className="nav-title" style={{ color: "white" }}>
          Welcome, {user.name.split(" ")[0]}
        </h1>
      )}
      <ul className={`left-nav ${isActive ? "" : "left-nav open"}`}>
        {isAdmin && <AdminRouter />}
        {isLoggedIn ? <LoggedInRouter cart={cart} isAdmin={isAdmin} /> : <PublicRouter />}

        {isAdmin ? (
          ""
        ) : (
          <li className="nav-link cart-icon d-flex flex-row align-items-center">
            <span>{cart.length}</span>
            <Link to="/cart">
              {" "}
              <AiOutlineShoppingCart
                style={{
                  fontSize: "80px",
                  marginLeft: "1rem",
                  color: "rgb(250, 200, 107)",
                  width: "30px",
                }}
              />
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
