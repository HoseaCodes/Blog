import React from "react";
import { Route } from "react-router-dom";
import Login from "./Pages/Auth/login";
import Home from "./Pages/Home/Home";

const PrivateRoute = ({ type, exact, path, element, isGame, Game }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const isAdmin = localStorage.getItem("isAdmin");
  if (type === "login") {
    if (isGame && isLoggedIn) {
      return <Route path={path} exact={exact} render={() => Game} />;
    }
    return isLoggedIn ? (
      <Route path={path} exact={exact} component={element} />
    ) : (
      <Route path={path} exact={exact} component={Login} />
    );
  }

  if (type === "admin") {
    return !isAdmin ? (
      <Route path={path} exact={exact} component={element} />
    ) : (
      <Route path={path} exact={exact} component={Home} />
    );
  }

  return <Route path={path} exact={exact} component={Home} />;
};

export default PrivateRoute;
