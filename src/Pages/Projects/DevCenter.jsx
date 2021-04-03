import React from 'react'
import './Projects.css';
import { Link } from "react-router-dom";
import NavBar2 from '../../Components/NavBar/NavBar2'
import django from '../../icons/django.png'

const DevCenter = () => {
    return (
        <>
            <NavBar2 />
            <img src={django} width='400' height='350' alt="JavaScript" />
            <ul class="tags">
                <li class="tag">Python</li>
                <li class="tag">Django</li>
                <li class="tag">PostgreSQL</li>
                <li class="tag">AJAX</li>
            </ul>
            <Link to="/projects" className="item" style={{ color: "red" }}>Back</Link>


        </>

    )
}

export default DevCenter;