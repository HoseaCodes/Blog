import React from 'react';
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp';
// import Socialring from '../../icons/socialring.png';
// import Socialring2 from '../../icons/socialring2.png';
// import Socialring3 from '../../icons/socialring3.png';
import Modal from '../Modal/Modal'


function Carouselsocialring() {
    let project1 = [
        <ImgComp className='cover' src="https://i.imgur.com/OTlZhu8.jpg" />,
        <ImgComp className='cover' src="https://i.imgur.com/XHVDZhx.jpg" />,
        <ImgComp className='cover' src="https://i.imgur.com/8lqi3Ff.jpg" />,

    ];
    const p1 = 'Social Ring';
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
                <div style={{ display: 'flex', flexDirection: 'row', width: '300px', justifyContent: 'space-evenly', marginTop: '30px' }}>
                <Modal />
                    <a className='link' href="https://apps.apple.com/us/app/social-ring/id1551446005" target="_blank" rel="noopener noreferrer">View Live App</a>
                </div>
            </div>
        </div>
    )
}


export default
    Carouselsocialring;