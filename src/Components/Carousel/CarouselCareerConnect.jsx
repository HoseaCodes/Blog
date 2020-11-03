import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp'
import careerconnect from '../../icons/careerconnect.png'
import careerconnect2 from '../../icons/careerconnect2.png'
import careerconnect3 from '../../icons/careerconnect3.png'
import careerconnect4 from '../../icons/careerconnect4.png'
import careerconnect5 from '../../icons/careerconnect5.png'

function CarouselCareerconnect() {
    let connect = [
        <ImgComp src={careerconnect} />,
        <ImgComp src={careerconnect2} />,
        <ImgComp src={careerconnect3} />,
        <ImgComp src={careerconnect4} />,
        <ImgComp src={careerconnect5} />,
    ];
    const p3 = 'Career Connect';
    const [x, setX] = useState(0)
    const goLeft = () => {
        x === 0 ? setX(-100 * (connect.length - 1)) : setX(x + 100);
    };
    const goRight = () => {
        x === -100 * (connect.length - 1) ? setX(0) : setX(x - 100);

    };
    return (
        <div className='carousel-container'>
            <div className='c-carousel'>
                {connect.map((item, index) => {
                    return (
                        <div key={index} className='slide' style={{ transform: `translateX(${x}%)` }}>
                            {item}
                        </div>
                    )
                })}
                <button className='btn-left' onClick={goLeft}> ‹ </button>
                <button className='btn-right' onClick={goRight}> › </button>
            </div>
            <div className='p-details'>
                <h2 className='p-h2'>{p3}</h2>
                <ul className='main-tag-container' style={{ display: 'flex', justifyContent: 'center', listStyle: 'none', flexWrap: 'wrap' }}>
                    <li><a href="#" className="main-tag">MongoDB</a></li>
                    <li><a href="#" className="main-tag">Express.js</a></li>
                    <li><a href="#" className="main-tag">Node.js</a></li>
                    <li><a href="#" className="main-tag">AJAX</a></li>
                    <li><a href="#" className="main-tag">RESTful Routing</a></li>
                </ul>
                <p>Solo Project: Career Connect - JavaScript, CSS, HTML, MongoDB, oAuth Google, Node.js, RESTful routing -  Created a web server using a templating engine and MVC model. Building all of the application from beginning to end with an ability to consume a third party API and convert its JSON components.</p>
                <div style={{ display: 'flex', marginTop: '30px' }}>
                    <a className='link' href="https://careerconnect.herokuapp.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link github' href="https://github.com/HoseaCodes/CareerConnect" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
        </div>
    )
}

export default CarouselCareerconnect;