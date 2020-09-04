import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp'
import Webfiver from '../../icons/Webfiver.png'
import Webfiver2 from '../../icons/Webfiver2.png'
import Webfiver3 from '../../icons/Webfiver3.png'
import Webfiver4 from '../../icons/Webfiver4.png'


function CarouselWebfiver() {
    let example = [
        <ImgComp src={Webfiver} />,
        <ImgComp src={Webfiver2} />,
        <ImgComp src={Webfiver3} />,
        <ImgComp src={Webfiver4} />,

    ];
    const [x, setX] = useState(0)
    const goLeft = () => {
        x === 0 ? setX(-100 * (example.length - 1)) : setX(x + 100);
    };
    const goRight = () => {
        x === -100 * (example.length - 1) ? setX(0) : setX(x - 100);

    };
    return (
        <div className='c-container'>
            <div className='carousel-container'>
                <div className='carousel'>
                    {example.map((item, index) => {
                        return (
                            <div key={index} className='slide' style={{ transform: `translateX(${x}%)` }}>
                                {item}
                            </div>
                        )
                    })}
                    <button className='btn-left' onClick={goLeft}> ‹ </button>
                    <button className='btn-right' onClick={goRight}> › </button>
                </div>
            </div>
        </div>
    )
}

export default CarouselWebfiver;