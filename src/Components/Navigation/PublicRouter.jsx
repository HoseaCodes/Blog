import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function PublicRouter() {
  return (
    <>
      <Link to="/" className="nav-link active">
        Home
      </Link>
      <Link to="/blog" className="nav-link">
        Blog
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
          Portfolio
        </a>
        <div className="dropdown-menu" aria-labelledby="navdrop">
          <a
            href="http://www.dominiquehosea.com"
            target="_blank"
            rel="noopener noreferrer"
            className="dropdown-item nav-link"
          >
            Backend Portfolio
          </a>
          <Link
            to="/project"
            rel="noopener noreferrer"
            className="dropdown-item nav-link"
          >
            Project Case Studies
          </Link>
        </div>
      </li>
      <Link to="/about" className="nav-link">
        About
      </Link>
      <Link to="/contact" className="nav-link">
        Contact
      </Link>
    </>
  );
}
