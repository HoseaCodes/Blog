import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ type, exact, path, element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const isAdmin = localStorage.getItem("isAdmin");

  if (type === "login") {
    return isLoggedIn ? (
      <Route path={path} exact={exact} component={element} />
    ) : (
      <Redirect to="/login" />
    );
  }

  if (type === "admin") {
    return isAdmin ? (
      <Route path={path} exact={exact} component={element} />
    ) : (
      <Redirect to="/" />
    );
  }

  return <Redirect to="/" />;
};

export default PrivateRoute;
