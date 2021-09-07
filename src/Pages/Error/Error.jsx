import React from "react";
import { Link, useLocation } from "react-router-dom";


const NotFound = () => {
  const location = useLocation();
    return (
        <React.Fragment>
            <h1>404! We couldn't find that!</h1>
            <h2>Resources not found ar {location.pathname}!</h2>
            <Link to='/'>Go Back Home</Link>
        </React.Fragment>
    )
}


export default NotFound;
