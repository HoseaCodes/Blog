import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp'
import Modal5 from '../Modal/Modal5'

function CarouselWebfiver() {
    const Webfiver = 'https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/Webfiver.png'
    const Webfiver2 = 'https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/Webfiver2.png'
    const Webfiver3 = 'https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/Webfiver3.png'
    const Webfiver4 = 'https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/Webfiver4.png'
    let Web = [
        <ImgComp src={Webfiver} />,
        <ImgComp src={Webfiver2} />,
        <ImgComp src={Webfiver3} />,
        <ImgComp src={Webfiver4} />,

    ];
    const p2 = 'Web Fiver'

    const [x, setX] = useState(0)
    const goLeft = () => {
        x === 0 ? setX(-100 * (Web.length - 1)) : setX(x + 100);
    };
    const goRight = () => {
        x === -100 * (Web.length - 1) ? setX(0) : setX(x - 100);

    };
    return (
        <div className='carousel-container'>
            <div className='p-details'>
                <h2 className='p-h2'>{p2}</h2>
                <div className='c-carousel'>
                    {Web.map((item, index) => {
                        return (
                            <div key={index} className='slide' style={{ transform: `translateX(${x}%)` }}>
                                {item}
                            </div>
                        )
                    })}
                    <button className='btn-left' onClick={goLeft}> ‹ </button>
                    <button className='btn-right' onClick={goRight}> › </button>
                </div>

                <ul className='main-tag-container' style={{ display: 'flex', justifyContent: 'center', listStyle: 'none' }}>
                    <li><a href="#" className="main-tag">CMS</a></li>
                    <li><a href="#" className="main-tag">WordPress</a></li>
                </ul>
                <Modal5 />
                <div style={{ display: 'flex', marginTop: '30px' }}>
                    <a className='link' href="http://webfiver.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                </div>
            </div>
        </div>
    )
}

export default CarouselWebfiver;