import React from "react";
import { Route, Redirect } from "react-router-dom";

const hasAccessTokenCookie = () => {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some(
      (row) =>
        row.startsWith("accesstoken=") && row.length > "accesstoken=".length
    );
};

const PrivateRoute = ({ type, exact, path, element: Element, isGame, Game, children }) => {
  // localStorage flags persist past cookie expiry, so they aren't a security
  // gate on their own — pair them with an accesstoken cookie check.
  const tokenPresent = hasAccessTokenCookie();
  const isLoggedIn =
    localStorage.getItem("isLoggedIn") === "true" && tokenPresent;
  const isAdmin =
    localStorage.getItem("isAdmin") === "true" && tokenPresent;

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
