import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function AdminRouter() {
  return (
    <>
      <Link className="nav-link" to="/create_product">
        Create Product
      </Link>
      <Link to="/products" className="nav-link">
        Products
      </Link>
      <Link to="/users" className="nav-link">
        Users
      </Link>
      <Link to="/uploads" className="nav-link">
        Uploads
      </Link>
      <li className="dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="/"
          id="navdrop"
          role="button"
          data-toggle="dropdown"
          data-hover="dropdown"
        >
          Products
        </a>
        <div className="dropdown-menu" aria-labelledby="navdrop">
          <Link to={"/create_product"} className="dropdown-item nav-link">
            Create Product
          </Link>
          <Link
            to={"/products"}
            rel="noopener noreferrer"
            className="dropdown-item nav-link"
          >
            View Products
          </Link>
        </div>
      </li>
    </>
  );
}
