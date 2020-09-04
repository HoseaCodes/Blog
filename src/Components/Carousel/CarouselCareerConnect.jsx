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
    let example = [
        <ImgComp src={careerconnect} />,
        <ImgComp src={careerconnect2} />,
        <ImgComp src={careerconnect3} />,
        <ImgComp src={careerconnect4} />,
        <ImgComp src={careerconnect5} />,
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

export default CarouselCareerconnect;