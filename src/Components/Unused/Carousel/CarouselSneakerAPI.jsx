import React from 'react';
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp';
import Modal from '../Modal/Modal'


function CarouselSneakerAPI() {
    const SneakerAPI1 = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/SneakerAPI1.png';
    const SneakerAPI2 = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/SneakerAPI2.png';
    const SneakerAPI3 = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/SneakerAPI3.png';
    let project1 = [
        <ImgComp className='cover' src={SneakerAPI1} />,
        <ImgComp className='cover' src={SneakerAPI2} />,
        <ImgComp className='cover' src={SneakerAPI3} />,

    ];
    const p1 = 'Sneaker API';
    const [x, setX] = useState(0)
    const goLeft = () => {
        x === 0 ? setX(-100 * (project1.length - 1)) : setX(x + 100);
    };
    const goRight = () => {
        x === -100 * (project1.length - 1) ? setX(0) : setX(x - 100);

    };
    return (
        <div className='carousel-container' >
            <div className='p-details'>
                <h2 className='p-h2'>{p1}</h2>
                <div className='c-carousel'>
                    {project1.map((item, index) => {
                        return (
                            <div key={index} className='slide' style={{ transform: `translateX(${x}%)` }}>
                                {item}
                            </div>
                        )
                    })}
                    <button className='btn-left' onClick={goLeft}> ‹ </button>
                    <button className='btn-right' onClick={goRight}> › </button>
                </div>
                <Modal />
                <div style={{ display: 'flex', marginTop: '30px' }}>
                    <a className='link' href=" https://hoseacodes.github.io/Sneaker-Api/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link github' href="https://sneaker-api-htx.herokuapp.com/" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
        </div>
    )
}


export default
    CarouselSneakerAPI;