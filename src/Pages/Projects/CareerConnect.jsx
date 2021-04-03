import React from 'react'
import './Projects.css';
import { Link } from "react-router-dom";
import NavBar2 from '../../Components/NavBar/NavBar2'
import Node from '../../icons/Node.png'

const CareerConnect = () => {
    return (
        <>
            <NavBar2 />
            <img src={Node} width='300' height='250' alt="" />
            <ul class="tags">
                <li class="tag">JavaScript</li>
                <li class="tag">AJAX</li>
                <li class="tag">Node.JS</li>
                <li class="tag">MongoDB</li>
                <li class="tag">MVC</li>
            </ul>
            <Link to="/projects" className="item" style={{ color: "red" }}>Back</Link>

        </>

    )
}

export default CareerConnect;