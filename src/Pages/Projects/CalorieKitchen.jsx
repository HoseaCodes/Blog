import React from 'react'
import './Projects.css';
import { Link } from "react-router-dom";
import NavBar2 from '../../Components/NavBar/NavBar2';
import Snippet from '../../Components/Tags/Snippet';
import Footer from '../../Components/Footer/Footer';
import SocialMediaTags from '../../Components/SocialMediaTags/SocialMediaTags';
import JS from '../../icons/JS.png'

const CalorieKitchen = () => {
    return (
        <div className='project-container'>
            <NavBar2 />
            <img src={JS} width='500' height='450' alt="JavaScript" />
            <h1 style={{ color: 'green' }}>CalorieKitchen</h1>
            <ul class="tags">
                <li class="tag">JavaScript</li>
                <li class="tag">AJAX</li>
            </ul>
            <div className='project-box'>
                <div className='project-description'>
                    <p style={{ color: 'black' }}><strong>Date:</strong> 25 June 2020</p>
                    <p style={{ color: 'black' }}><strong>Time to read:</strong> 1m</p>
                </div>
                <div className='code-snippet'>
                    <img src={JS} alt="" height='500px' width='500px' />
                </div>
                <div className='code-breakdown'>
                    <p style={{ color: 'black' }}>That’s it, you’re good to go with SCSS! No any other config needed because CLI team just got it covered so you don’t have to tell the config which CSS-preprocessor is gonna be used anymore. By dig deeper in their build script (node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/styles.js), I’m pretty sure that you can include any type of .css, .sass, .scss, .less or .styl (stylus) and start your CSS coding right away. I’ve tried it, very easy!</p>
                    <p style={{ color: 'black' }}>That’s it, you’re good to go with SCSS! No any other config needed because CLI team just got it covered so you don’t have to tell the config which CSS-preprocessor is gonna be used anymore. By dig deeper in their build script (node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/styles.js), I’m pretty sure that you can include any type of .css, .sass, .scss, .less or .styl (stylus) and start your CSS coding right away. I’ve tried it, very easy!</p>
                </div>
                <SocialMediaTags />
            </div>
            <p>Want to see more?</p>
            <Snippet />
            <Link to="/projects" className="item" style={{ color: "red" }}>Back</Link>
            <Footer />
        </div>

    )
}

export default CalorieKitchen;