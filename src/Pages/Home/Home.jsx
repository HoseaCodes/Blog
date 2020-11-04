
import React from 'react';
import '../Home/Home.css';
import NavBar2 from '../../Components/NavBar/NavBar2';
import Scramble from '../../Components/Scramble/Scramble';
import SocialMedia from '../../Pages/SocialMedia/SocialMedia';
import Projects from '../../Components/Carousel/Carousel';
import hosea2 from '../../icons/hosea2.jpeg';
import PersonalBrand from '../../Components/PersonalBrand/PersonalBrand';
import SocialMediaTags from '../../Components/SocialMediaTags/SocialMediaTags';
import Footer from '../../Components/Footer/Footer'
import ContactForm from '../../Components/Contact/ContactForm';
import Testomonials from '../Testimonials/Testimonials';
import Tech from '../../Components/Technologies/Tech';


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
                                <a href='#aboutme' className='header-button'
                                    data-aos="fade-right"
                                    data-aos-offset="200"
                                    data-aos-duration="3000"
                                    data-aos-easing="ease-in"
                                >Find Out More</a>
                                <div>
                                    <Scramble />
                                </div>
                            </h1>
                        </div>
                    </div>
                    {/* <img className='domImg' id='domImg' src={hosea2} alt="Dominique"
                        data-aos="fade-down"
                        data-aos-easing="linear"
                        data-aos-duration="1500" /> */}
                    {/* <div className='color mobile'></div>
                    <div className='open-section-first mobile'>
                        <h1 id='aboutme'> About Me</h1>
                    </div> */}
                    <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />

                    <PersonalBrand />
                    <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />

                    <Tech />
                    <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />

                    <div className='projects'>
                        <Projects />
                    </div>
                    <div className='color'></div>
                    <div className='testimonies-group'>
                        <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />

                        <h2 style={{
                            fontSize: '5rem', margin: '100px', textAlign: 'center',
                            color: 'white', opacity: '.8', textTransform: 'uppercase',
                            textShadow: '2px 2px 2px #206a5d', letterSpacing: '1rem'
                        }}
                            data-aos="zoom-out-up"
                            data-aos-offset="600"
                            data-aos-easing="ease-in"
                        >
                            Testimonies
                        </h2>
                    </div>

                    <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />

                    <br />
                    <br />
                    <div className='homepage-combo'>
                        <div className='socialmedia'>
                            <SocialMedia />
                        </div>
                        <div className='testomonies mobile'>
                            <Testomonials />
                        </div>
                    </div>
                    <div className='contact'>
                        <a href='#header-logo' className='footer-button'
                            data-aos="fade-right"
                            data-aos-offset="200"
                            data-aos-duration="3000"
                            data-aos-easing="ease-in"
                        >Back to Top</a>
                        <SocialMediaTags />
                    </div>
                    <Footer />
                </div>
            </>
        )
    }
}


export default Home;