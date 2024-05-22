import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp'
import Modal4 from '../Modal/Modal4'

function CarouselMergeImmersive() {
    const MergeImmersive = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/MergeImmersive.png'
    const MergeImmersive2 = 'https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/MergeImmersive2.png'
    let merge = [
        <ImgComp src={MergeImmersive} />,
        <ImgComp src={MergeImmersive2} />,

    ];
    const p4 = 'Merge Immersive'
    const [x, setX] = useState(0)
    const goLeft = () => {
        x === 0 ? setX(-100 * (merge.length - 1)) : setX(x + 100);
    };
    const goRight = () => {
        x === -100 * (merge.length - 1) ? setX(0) : setX(x - 100);

    };
    return (
        <div className='carousel-container'>
            <div className='p-details'>
                <h2 className='p-h2'>{p4}</h2>
                <div className='c-carousel'>
                    {merge.map((item, index) => {
                        return (
                            <div key={index} className='slide' style={{ transform: `translateX(${x}%)` }}>
                                {item}
                            </div>
                        )
                    })}
                    <button className='btn-left' onClick={goLeft}> ‹ </button>
                    <button className='btn-right' onClick={goRight}> › </button>
                </div>

                <ul className='main-tag-container' style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', listStyle: 'none' }}>
                    <li><a href="#" className="main-tag">React.js</a></li>
                    <li><a href="#" className="main-tag">Node,js</a></li>
                    <li><a href="#" className="main-tag">AJAX</a></li>
                    <li><a href="#" className="main-tag">Passport.js</a></li>
                </ul>
                <Modal4 />
                <div style={{ display: 'flex', marginTop: '30px' }}>
                    <a className='link' href="http://www.mergeimmersive.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link github' href="https://github.com/HoseaCodes/merge-immersive" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
        </div>
    )
}

export default CarouselMergeImmersive;