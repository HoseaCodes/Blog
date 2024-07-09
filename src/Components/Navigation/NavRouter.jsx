import React from "react";
import { useLocation } from "react-router-dom";
import Navigation from "./Navigation";
import "./NavBar.css";

export default function NavRouter({
  isLoggedIn,
  isActive,
  isAdmin,
  Logo,
  user,
  cart,
}) {
  const location = useLocation();
  const currentPath = location.pathname;

  switch (currentPath) {
    case currentPath.includes("admin/blog/new"):
      return (
        <Navigation
          isLoggedIn={isLoggedIn}
          isActive={isActive}
          isAdmin={isAdmin}
          Logo={Logo}
          user={user}
          cart={cart}
        />
      );
    case currentPath.includes("/blog/") || currentPath.includes("gamecorner"):
      return null;
    default:
      return (
        <Navigation
          isLoggedIn={isLoggedIn}
          isActive={isActive}
          isAdmin={isAdmin}
          Logo={Logo}
          user={user}
          cart={cart}
        />
      );
  }
}
