import React from 'react';
import { Link } from "react-router-dom";
import JS from '../../icons/JS.png'



const JavaScript = () => {
    return (
        <>
            <Link to="/caloriekitchen" className="tag-item active" style={{ textDecoration: 'none' }}>
                <div className='tag-group'>
                    <div className="tag-logo">
                        <img src={JS} width='200' height='150' alt="JavaScript" />
                    </div>
                    <div className="tag-info">
                        <h2 className='tag-header'>JavaScript</h2>
                        <p>JavaScript is an object-oriented programming language used alongside HTML and CSS to give functionality to web pages.</p>
                        <label>1 Project</label>
                    </div>
                </div>
            </Link>
        </>

    )
}

export default JavaScript;