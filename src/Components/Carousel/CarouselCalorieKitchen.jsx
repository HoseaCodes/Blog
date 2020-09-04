import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp'
import CalorieKitchen from '../../icons/CalorieKitchen.png'
import CaloriesKitchen2 from '../../icons/CaloriesKitchen2.png'
import caloriekitchen2 from '../../icons/caloriekitchen2.png'
import caloriekitchen3 from '../../icons/caloriekitchen3.png'
import caloriekitchen4 from '../../icons/caloriekitchen4.png'


function Carousel() {
    let example = [
        <ImgComp src={CalorieKitchen} />,
        <ImgComp src={CaloriesKitchen2} />,
        <ImgComp src={caloriekitchen2} />,
        <ImgComp src={caloriekitchen3} />,
        <ImgComp src={caloriekitchen4} />,

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

export default Carousel;