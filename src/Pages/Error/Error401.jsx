import React from "react";
import { Link } from "react-router-dom";
import './Error401.css'

const Unauthorized = () => {
    return (
        <React.Fragment>
            <div id="error401">
                <div className="fof">
                        <h1>Error 404</h1>
                </div>
            </div>
            <Link to='/'>Go Back Home</Link>
        </React.Fragment>
    )
}


export default Unauthorized;
