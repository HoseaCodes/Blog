import React from 'react';
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp';
import SneakerAPI1 from '../../icons/SneakerAPI1.png';
import SneakerAPI2 from '../../icons/SneakerAPI2.png';
import SneakerAPI3 from '../../icons/SneakerAPI3.png';
import Modal from '../Modal/Modal'


function CarouselSneakerAPI() {
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

                <ul className='main-tag-container' style={{ display: 'flex', justifyContent: 'center', listStyle: 'none' }}>
                    <li className="main-tag">JavaScript</li>
                    <li className="main-tag">Mongoose</li>
                    <li className="main-tag">MongoDB</li>
                    <li className="main-tag">Express.js</li>
                    <li className="main-tag">EJS</li>
                    <li className="main-tag">Node.js</li>
                </ul>
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