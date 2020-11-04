import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp';
import DevCenter from '../../icons/DevCenter.png'
import DevCenter2 from '../../icons/DevCenter2.png'
import DevCenter3 from '../../icons/DevCenter3.png'
import DevCenter4 from '../../icons/DevCenter4.png'
import Modal3 from '../Modal/Modal3'

function CarouselDevCenter() {
    let example = [
        <ImgComp className='cover' src={DevCenter} />,
        <ImgComp className='cover' src={DevCenter2} />,
        <ImgComp className='cover' src={DevCenter3} />,
        <ImgComp className='cover' src={DevCenter4} />,

    ];
    const p5 = 'Dev Center';
    const [x, setX] = useState(0)
    const goLeft = () => {
        x === 0 ? setX(-100 * (example.length - 1)) : setX(x + 100);
    };
    const goRight = () => {
        x === -100 * (example.length - 1) ? setX(0) : setX(x - 100);

    };
    return (
        <div className='carousel-container'>
            <div className='p-details'>
                <h2 className='p-h2'>{p5}</h2>
                <div className='c-carousel'>
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

                <ul className='main-tag-container' style={{ display: 'flex', justifyContent: 'center', listStyle: 'none' }}>
                    <li><a href="#" className="main-tag">Python</a></li>
                    <li><a href="#" className="main-tag">Django</a></li>
                    <li><a href="#" className="main-tag">JWT</a></li>
                </ul>
                <Modal3 />
                <div style={{ display: 'flex', marginTop: '30px' }}>
                    <a className='link' href="https://devcenter-629.herokuapp.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link github' href="https://github.com/HoseaCodes/DevCenter" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
        </div>
    )
}


export default
    CarouselDevCenter
