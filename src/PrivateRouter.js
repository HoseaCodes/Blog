import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ type, exact, path, element: Element, isGame, Game, children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const renderProtected = () => {
    if (type === "login") {
      if (!isLoggedIn) return <Redirect to="/login" />;
      if (isGame && Game) return Game;
      if (Element) return <Element />;
      return children || null;
    }

    if (type === "admin") {
      if (!(isAdmin && isLoggedIn)) return <Redirect to="/" />;
      if (Element) return <Element />;
      return children || null;
    }

    return <Redirect to="/" />;
  };

  return <Route path={path} exact={exact} render={renderProtected} />;
};

export default PrivateRoute;
