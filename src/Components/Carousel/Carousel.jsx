import React from 'react';
import CarouselCalorieKitchen from '../Carousel/CarouselCalorieKitchen';
import CarouselCareerconnect from '../Carousel/CarouselCareerConnect';
import CarouselMergeImmersive from '../Carousel/CarouselMergeImmersive';
import CarouselWebfiver from '../Carousel/CarouselWebfiver';
import CarouselDevCenter from './CarouselDevCenter';
import CarouselSneakerAPI from './CarouselSneakerAPI';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';


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
            <div className='p-container'>
                <div className='p-content' data-aos="fade-right" data-aos-duration="3000" data-aos-offset="500"
                >
                    <CarouselCalorieKitchen />
                </div>
                <div className='p-content' data-aos="fade-down" data-aos-duration="3000" data-aos-offset="500"
                    data-aos-delay="300">
                    <CarouselWebfiver />
                </div>

                <div className='p-content' data-aos="fade-left" data-aos-duration="3000" data-aos-offset="500">
                    <CarouselCareerconnect />

                </div>
                <div className='p-content' data-aos="fade-up-right" data-aos-duration="3000" data-aos-offset="500">
                    <CarouselMergeImmersive />
                </div>
                <div className='p-content' data-aos="zoom-in-up" data-aos-duration="3000" data-aos-offset="500">
                    <CarouselDevCenter />
                </div>
                <div className='p-content' data-aos="fade-up-left" data-aos-duration="3000" data-aos-offset="500">
                    <CarouselSneakerAPI />
                </div>
            </div>
        </div>
    )
}

export default Projects;