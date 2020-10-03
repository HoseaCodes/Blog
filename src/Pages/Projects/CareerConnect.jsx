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
                <li><a href="#" class="tag">JavaScript</a></li>
                <li><a href="#" class="tag">AJAX</a></li>
                <li><a href="#" class="tag">Node.JS</a></li>
                <li><a href="#" class="tag">MongoDB</a></li>
                <li><a href="#" class="tag">MVC</a></li>
            </ul>
            <Link to="/projects" className="item" style={{ color: "red" }}>Back</Link>

        </>

    )
}

export default CareerConnect;