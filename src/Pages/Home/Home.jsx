import React from 'react';
import '../Home/Home.css';
import NavBar from '../../Components/NavBar/NavBar';
import SocialMedia from '../../Components/SocialMedia/SocialMedia';
import PersonalBrand from '../../Components/PersonalBrand/PersonalBrandOriginal';
import Footer from '../../Components/Footer/Footer';
import Testimonial from '../../Components/Testimonials/testimonial';
import Tech from '../../Components/Technologies/Tech';
import EmailIcon from '@material-ui/icons/Email';
import ProjectHighlight from '../../Components/Project/projectHighlight';
import Hero from '../../Components/Hero/hero';
import {StyledHr} from '../../Layout/Hr/styledHr';

class Home extends React.Component {
    render() {
        return (
            <>
                <main className='home-page'>
                    <NavBar id='top' />
                    <Hero username={{firstName: 'Hosea', lastName: 'Codes'}}/>
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
                        <div className='socialmedia'>
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
                                <EmailIcon className='email' fontSize='large' style={{ color: '#206a5d', width: '15rem !important' }} />
                            </a>

                        </div>
                        <StyledHr Primary/>
                        <br />
                        <div style={{ width: '10%', margin: '0 auto' }}>
                            <a href='#top' className='footer-button'
                                data-aos="fade-right"
                                data-aos-offset="200"
                                data-aos-duration="3000"
                                data-aos-easing="ease-in"
                            >Back to Top</a>
                        </div>
                    </div>
                    <Footer />
                </main>
            </>
        )
    }
}


export default Home;
