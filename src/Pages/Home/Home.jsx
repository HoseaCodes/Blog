//Your website’s homepage or splash page,
//should make it clear to your audience, 
//upon arriving at your website, 
//who you are and what you do. 
//Include your name, professional title (ex: Full Stack Web Developer)
//and a clear, concise introduction. 
//Keep your homepage or splash page simple and welcoming. 
//Include an easy-to-navigate layout that makes it 
//clear to your audience where they can go for more information.

import React from 'react';
import '../Home/Home.css';
import NavBar2 from '../../Components/NavBar/NavBar2';
import Text from '../../Components/Text/Text';
import logo from '../../logo.svg';
import Project1 from '../../Components/Project/Project1';
import CaseStudy from '../../Components/Project/Case-Study';
import WebFiver from '../../Components/Project/WebFiver';
import Articles from '../../Pages/Articles/Articles';
import SocialMedia from '../../Pages/SocialMedia/SocialMedia';
import Carousel from '../../Components/Carousel/Carousel';
import ControlledCarousel from '../../Components/Bootstrap/Carousel';
import CodePen from '../../Components/CodePen/CodePen';



const Home = () => {
    return (
        <div>
            <NavBar2 />
            <div className='header'>
                <div className='header-logo'>
                    <h1 className='heading-primary'>
                        <span className="header-username">Hosea Codes</span>
                        {/* <span className="header-career">Software Engineer</span> */}
                        <Text />
                    </h1>
                </div>
            </div>
            <div className='color'>
                <h1>Projects</h1>
            </div>
            <div className='projects'>
                <Carousel />
                {/* <h1>Projects</h1> */}
                {/* <iframe className='iframe' title="p" height="600" width="800" src='https://hoseacodes.github.io/Calorie-Kitchen/' frameborder="yes" allowtransparency="true" allowfullscreen="true"></iframe>
                <iframe className='iframe' title="p" height="600" width="800" src='https://careerconnect.herokuapp.com/' frameborder="yes" allowtransparency="true" allowfullscreen="true"></iframe>
                <iframe className='iframe' title="p" height="600" width="800" src='http://webfiver.com/' frameborder="yes" allowtransparency="true" allowfullscreen="true"></iframe> */}
                {/* <Project1 /> */}
                {/* <WebFiver /> */}
                {/* <CodePen /> */}
            </div>
            {/* <img src={logo} className="logo" alt="Logo Image" /> */}
            <div className='technologies'>
                <CaseStudy />
            </div>
            <div className='articles'>
                <Articles />
            </div>
            <div className='socialmedia'>
                <SocialMedia />
            </div>
        </div>

    )
}

export default Home;