import React from 'react'
import './Projects.css';
import { Link } from "react-router-dom";
import NavBar2 from '../../NavBar/NavBar2'
import django from '../../icons/django.png'

const DevCenter = () => {
    return (
        <>
            <NavBar2 />
            <img src={django} width='400' height='350' alt="JavaScript" />
            <ul className="tags">
                <li className="tag">Python</li>
                <li className="tag">Django</li>
                <li className="tag">PostgreSQL</li>
                <li className="tag">AJAX</li>
            </ul>
            <Link to="/projects" className="item" style={{ color: "red" }}>Back</Link>


        </>

    )
}

export default DevCenter;