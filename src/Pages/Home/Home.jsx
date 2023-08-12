import React, { useState, useContext } from 'react';
import '../Home/Home.css';
import SocialMedia from '../../Components/SocialMedia/SocialMedia';
import PersonalBrand from '../../Components/PersonalBrand/PersonalBrandOriginal';
import Testimonial from '../../Components/Testimonials/testimonial';
import Tech from '../../Components/Technologies/Tech';
import { MdEmail } from 'react-icons/md'
import ProjectHighlight from '../../Components/Project/projectHighlight';
import Hero from '../../Components/Hero/hero';
import {StyledHr} from '../../Layout/Hr/styledHr';
import {StyledButtonATag} from '../../Layout/Button/styledButton';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';

const Home = () =>  {
    const [isHome, setIsHome] = useState(true);

    return (
        <>
            <NavBar/>
            <main className='home-page'>
                <Hero id='top' Home username={{firstName: 'Hosea', lastName: 'Codes'}}/>
                <StyledHr Primary/>
                <PersonalBrand />
                <StyledHr Primary/>
                <Tech />
                <StyledHr Primary/>
                <div className='projects'>
                    <ProjectHighlight />
                </div>
                <div className='testimonies-group'>
                    <StyledHr Primary/>
                    <h2
                    data-aos="fade-down"
                    data-aos-offset="500"
                    data-aos-duration="3000"
                    data-aos-easing="ease-in"
                    className="subTitle" >
                        Testimonies
                    </h2>
                </div>
                <StyledHr Primary/>
                <br />
                <br />
                <div className='homepage-combo'>
                    <div className='socialmedia d-none d-md-block'>
                        <SocialMedia />
                    </div>
                    <div className='testomonies mobile'>
                        <Testimonial/>
                    </div>
                </div>
                <div className='contact'>
                    <StyledHr Primary/>
                    <div className='contact-group'>
                        <h2 style={{
                            fontSize: '5rem', textAlign: 'center',
                            color: 'white', opacity: '.8', textTransform: 'uppercase',
                            textShadow: '2px 2px 2px #206a5d', letterSpacing: '1rem'
                        }}
                        >
                            Send Me A Message
                        </h2>
                        <a className='social' href="https://mail.google.com/mail/u/0/#inbox?compose=new" target="_blank" rel="noopener noreferrer">
                            <MdEmail className='email' fontSize='large' style={{ color: '#206a5d', width: '15rem !important' }} />
                        </a>

                    </div>
                    <StyledHr Primary/>
                    <br />
                    <div>
                        <StyledButtonATag Primary href='#top'
                        data-aos="fade-right"
                        data-aos-offset="200"
                        data-aos-duration="3000"
                        data-aos-easing="ease-in"
                        >
                        Back to the top
                        </StyledButtonATag>
                    </div>
                </div>
            </main>
            <Footer isHome={isHome} setIsHome={setIsHome}/>
        </>
    )
}


export default Home;
