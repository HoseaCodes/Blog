import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp'
import MergeImmersive from '../../icons/MergeImmersive.png'
import MergeImmersive2 from '../../icons/MergeImmersive2.png'


function CarouselMergeImmersive() {
    let example = [
        <ImgComp src={MergeImmersive} />,
        <ImgComp src={MergeImmersive2} />,

    ];
    const [x, setX] = useState(0)
    const goLeft = () => {
        x === 0 ? setX(-100 * (example.length - 1)) : setX(x + 100);
    };
    const goRight = () => {
        x === -100 * (example.length - 1) ? setX(0) : setX(x - 100);

    };
    return (
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
    )
}

export default CarouselMergeImmersive;