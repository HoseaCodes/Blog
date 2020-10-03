import React from 'react'
import './Projects.css';
import { Link } from "react-router-dom";
import NavBar2 from '../../Components/NavBar/NavBar2'
import Reactt from '../../icons/Reactt.png'

const MergeImmersive = () => {
    return (
        <>
            <NavBar2 />
            <img src={Reactt} width='300' height='300' alt="" />
            <ul class="tags">
                <li><a href="#" class="tag">React</a></li>
                <li><a href="#" class="tag">JSX</a></li>
                <li><a href="#" class="tag">MongoDB</a></li>
                <li><a href="#" class="tag">AJAX</a></li>
            </ul>
            <Link to="/projects" className="item" style={{ color: "red" }}>Back</Link>

        </>

    )
}

export default MergeImmersive;