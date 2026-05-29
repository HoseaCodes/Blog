import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { GlobalState } from "./GlobalState";

const hasAccessTokenCookie = () => {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split("; ")
    .some(
      (row) =>
        row.startsWith("accesstoken=") && row.length > "accesstoken=".length
    );
};

const Spinner = () => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#a3acb2",
      fontFamily: "Lato, sans-serif",
      fontSize: 14,
    }}
  >
    Loading…
  </div>
);

const PrivateRoute = ({ type, exact, path, element: Element, isGame, Game, children }) => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [authLoading] = state.userAPI.loading;
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [isAdmin] = state.userAPI.isAdmin;

  const tokenPresent = hasAccessTokenCookie();

  const renderProtected = () => {
    // No cookie at all — never logged in; bounce to login.
    if (!tokenPresent) return <Redirect to="/login" />;

    // We have a cookie but the initial getMe() hasn't resolved yet.
    // Don't make a routing decision on stale localStorage flags.
    if (authLoading) return <Spinner />;

    // Defense in depth: even with a valid session cookie, getMe may have
    // returned a user whose status is not APPROVED (e.g. admin denied them
    // after they signed in). Route them to the appropriate gate.
    const status = user?.status;
    if (status === "PENDING") {
      const qs = user?.email
        ? `?email=${encodeURIComponent(user.email)}`
        : "";
      return <Redirect to={`/pending${qs}`} />;
    }
    if (status === "DENIED") return <Redirect to="/denied" />;

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
