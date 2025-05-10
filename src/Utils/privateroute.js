import React from 'react';
import { Redirect, Route } from 'react-router-dom';

function PrivateRoute({ children, ...rest }) {
    const firstLogin = localStorage.getItem("firstLogin");

    return (
      <Route
        {...rest}
        render={({ location }) =>
        firstLogin ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

export default PrivateRoute;