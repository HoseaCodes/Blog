import React from 'react';
import CarouselCalorieKitchen from '../Carousel/CarouselCalorieKitchen';
import CarouselCareerconnect from '../Carousel/CarouselCareerConnect';
import CarouselMergeImmersive from '../Carousel/CarouselMergeImmersive';
import CarouselWebfiver from '../Carousel/CarouselWebfiver';
import CarouselDevCenter from './CarouselDevCenter';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import JS from '../../icons/jsicon.png';


function Projects() {

    window.addEventListener(
        "scroll",
        () => {
            document.body.style.setProperty(
                "--scroll",
                window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
            );
        },
        false
    );
    AOS.init();
    return (
        <div style={{ background: '#1A1E23' }}>
            <h2 style={{ fontSize: '2rem', margin: 'auto', textAlign: 'center', background: '#1A1E23', color: 'white', opacity: '.8', textShadow: '2px 2px 2px #206a5d' }}>
                Scroll down to read more about my projects. </h2>
            <Carousel>
                <Carousel.Item>
                    <CarouselCalorieKitchen />
                </Carousel.Item>
                <Carousel.Item>
                    <CarouselCareerconnect />
                </Carousel.Item>
                <Carousel.Item>
                    <CarouselWebfiver />
                </Carousel.Item>
                <Carousel.Item>
                    <CarouselDevCenter />
                </Carousel.Item>
                <Carousel.Item>
                    <CarouselMergeImmersive />
                </Carousel.Item>
            </Carousel>
            <div className='p-container'>
                <div className='p-content' data-aos="fade-right" data-aos-duration="3000">
                    <CarouselCalorieKitchen />
                </div>
                <div className='p-content' data-aos="fade-down" data-aos-duration="4000"
                    data-aos-delay="300">
                    <CarouselWebfiver />
                </div>

                <div className='p-content' data-aos="fade-left" data-aos-duration="3000">
                    <CarouselCareerconnect />

                </div>
                <div className='p-content' data-aos="fade-up-right" data-aos-duration="3000">
                    <CarouselMergeImmersive />
                </div>
                <div className='p-content' data-aos="zoom-in-up" data-aos-duration="3000">
                    <CarouselDevCenter />
                </div>
                <div className='p-content' data-aos="fade-up-left" data-aos-duration="3000">
                    <CarouselDevCenter />
                </div>
            </div>
        </div>
    )
}

export default Projects;