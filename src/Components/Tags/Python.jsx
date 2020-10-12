import React from 'react';
import { Link } from "react-router-dom";
import Py from '../../icons/Py.png'


const Python = () => {
    return (
        <>
            <Link to="/devcenter" className="tag-item active">
                <div className='tag-group'>
                    <div className="tag-logo">
                        <img src={Py} width='200' height='200' alt="" />
                    </div>
                    <div className="tag-info">
                        <h2 className='tag-header'>Python</h2>
                        <p>Python Info</p>
                        <label>1 Project</label>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default Python;