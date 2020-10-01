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
import Scramble from '../../Components/Scramble/Scramble';
import Project1 from '../../Components/Project/Project1';
import CaseStudy from '../../Components/Project/Case-Study';
import WebFiver from '../../Components/Project/WebFiver';
import Articles from '../../Pages/Articles/Articles';
import SocialMedia from '../../Pages/SocialMedia/SocialMedia';
import Carousel from '../../Components/Carousel/Carousel';
import Blog from '../../Components/Blog/Blog';
import PopUp from '../../Components/Modal/Modal';
import hosea2 from '../../icons/hosea2.jpeg';
import PersonalBrand from '../../Components/PersonalBrand/PersonalBrand';
import SocialMediaTags from '../../Components/SocialMediaTags/SocialMediaTags';
import Footer from '../../Components/Footer/Footer'
import ContactForm from '../../Components/Contact/ContactForm';


class Home extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <>
                <div className='home-page'>
                    <NavBar2 />
                    <div className='header'>
                        <div className='header-logo' id='header-logo'>
                            <h1 className='heading-primary'>
                                <span className="header-username">Hosea </span>
                                <span className="header-username2">Codes </span>
                                {/* <span className="header-career">Software Engineer</span> */}
                                <a href='#domImg' className='header-button'>Find Out More</a>
                                <div>
                                    <Scramble />
                                </div>
                            </h1>
                            {/* <p className="header-scroll"> Scoll Down for more</p> */}
                        </div>
                    </div>
                    <div className='color-first'>
                        {/* <h1>ABout Me</h1> */}

                        <img className='domImg' id='domImg' src={hosea2} alt="Dominique" width="300" height="300" />
                    </div>
                    <div className='color'></div>
                    <div className='open-section-first'>
                        <h1>About Me</h1>
                    </div>
                    <PersonalBrand />
                    <div className='color'></div>
                    <div className='open-section'>
                        <h1>Projects</h1>
                    </div>
                    <div className='color'></div>
                    <div className='projects'>
                        <Carousel />
                    </div>
                    <div className='color'></div>
                    <div className='open-section'>
                        <h1> technologies</h1>
                    </div>
                    <div className='technologies'>
                        <CaseStudy />
                    </div>
                    {/* <div className='open-section'>
                    <h1> articles</h1>
                </div>
                <div className='color'></div>
                <div className='articles'>
                    <Blog />
                </div>
                */}
                    {/* <div className='color'></div>
                <div className='open-section'>
                    <h1> social media</h1>
                </div>
                <div className='color'></div>
                <div className='socialmedia'>
                    <SocialMedia />
                </div> */}
                    <div className='color'></div>
                    <div className='open-section'>
                        <h1> Contact</h1>
                    </div>
                    <div className='contact'>
                        <SocialMediaTags />
                        <ContactForm />
                        <a href='#header-logo' className='footer-button'>Back to Top</a>

                    </div>
                    <Footer />
                </div>
            </>
        )
    }
}


export default Home;