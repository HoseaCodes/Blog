import React from 'react'
import './Projects.css';
import { Link } from "react-router-dom";
import NavBar2 from '../../NavBar/NavBar2'
import Node from '../../icons/Node.png'

const CareerConnect = () => {
    return (
        <>
            <NavBar2 />
            <img src={Node} width='300' height='250' alt="" />
            <ul className="tags">
                <li className="tag">JavaScript</li>
                <li className="tag">AJAX</li>
                <li className="tag">Node.JS</li>
                <li className="tag">MongoDB</li>
                <li className="tag">MVC</li>
            </ul>
            <Link to="/projects" className="item" style={{ color: "red" }}>Back</Link>

        </>

    )
}

export default CareerConnect;