import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp'
import Webfiver from '../../icons/Webfiver.png'
import Webfiver2 from '../../icons/Webfiver2.png'
import Webfiver3 from '../../icons/Webfiver3.png'
import Webfiver4 from '../../icons/Webfiver4.png'
import ZoomInIcon from '@material-ui/icons/ZoomIn';

function CarouselWebfiver() {
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
                <ZoomInIcon fontSize='large' style={{ color: '#206a5d' }} />
                <p>Solo Project: WebFiver - JavaScript, CSS, HTML - </p>
                <a className='link' href="http://webfiver.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
            </div>
        </div>
    )
}

export default CarouselWebfiver;