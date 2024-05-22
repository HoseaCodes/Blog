import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp'
import Modal2 from '../Modal/Modal2'

function CarouselCareerconnect() {
    const careerconnect = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/careerconnect.png'
    const careerconnect2 = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/careerconnect2.png'
    const careerconnect3 = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/careerconnect3.png'
    const careerconnect4 = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/careerconnect4.png'
    const careerconnect5 = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/careerconnect5.png'
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
            <div className='p-details'>
                <h2 className='p-h2'>{p3}</h2>
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
                <Modal2 />
                <div style={{ display: 'flex', marginTop: '30px' }}>
                    <a className='link' href="https://careerconnect.herokuapp.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link github' href="https://github.com/HoseaCodes/CareerConnect" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
        </div>
    )
}

export default CarouselCareerconnect;