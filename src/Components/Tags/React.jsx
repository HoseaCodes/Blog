import React from 'react';
import { Link } from "react-router-dom";
import Reactt from '../../icons/Reactt.png'


const Reactjs = () => {
    return (
        <>
            <Link to="/mergeimmersive" className="item active">
                <div className='tag-group'>
                    <div className="tag-logo">
                        <img src={Reactt} width='200' height='200' alt="" />
                    </div>
                    <div className="tag-info">
                        <h2 className='tag-header'>React</h2>
                        <p>React is an open source web application plateform</p>
                        <label>1 Project</label>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default Reactjs;