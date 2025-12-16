import React from "react";
import { Route, Redirect } from "react-router-dom";
import Login from "./Pages/Auth/login";
import Home from "./Pages/Home/Home";

const PrivateRoute = ({ type, exact, path, element, isGame, Game, children, ...rest }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  
  // Handle game routes
  if (isGame && Game) {
    if (type === "login") {
      return isLoggedIn ? (
        <Route path={path} exact={exact} render={() => Game} />
      ) : (
        <Redirect to="/login" />
      );
    }
  }
  
  if (type === "login") {
    if (isGame && isLoggedIn) {
      return <Route path={path} exact={exact} render={() => Game} />;
    }
    return isLoggedIn ? (
      <Route path={path} exact={exact} component={element}>{children}</Route>
    ) : (
      <Redirect to="/login" />
    );
  }

  if (type === "admin") {
    return isAdmin && isLoggedIn ? (
      <Route path={path} exact={exact} component={element}>{children}</Route>
    ) : (
      <Redirect to="/" />
    );
  }

  return <Redirect to="/" />;
};

export default PrivateRoute;
