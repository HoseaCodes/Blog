import React from 'react'
import './Projects.css';
import { Link } from "react-router-dom";
import NavBar2 from '../../NavBar/NavBar2'
import Reactt from '../../icons/Reactt.png'

const MergeImmersive = () => {
    return (
        <>
            <NavBar2 />
            <img src={Reactt} width='300' height='300' alt="" />
            <ul className="tags">
                <li className="tag">React</li>
                <li className="tag">JSX</li>
                <li className="tag">MongoDB</li>
                <li className="tag">AJAX</li>
            </ul>
            <Link to="/projects" className="item" style={{ color: "red" }}>Back</Link>

        </>

    )
}

export default MergeImmersive;