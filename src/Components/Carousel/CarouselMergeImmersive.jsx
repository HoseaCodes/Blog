import React from 'react'
import '../Carousel/Carousel.css'
import { useState } from 'react';
import ImgComp from './ImgComp'
import MergeImmersive from '../../icons/MergeImmersive.png'
import MergeImmersive2 from '../../icons/MergeImmersive2.png'


function CarouselMergeImmersive() {
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
            <div className='p-details'>
                <h2 className='p-h2'>{p4}</h2>
                <ul className='main-tag-container' style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', listStyle: 'none' }}>
                    <li><a href="#" className="main-tag">React.js</a></li>
                    <li><a href="#" className="main-tag">Node,js</a></li>
                    <li><a href="#" className="main-tag">AJAX</a></li>
                    <li><a href="#" className="main-tag">Passport.js</a></li>
                </ul>
                <p className='p-extended'>Collaborative Project: Merge-Immersive — This application was developed with a full stack MERN M - MongoDB to store data, E - Express, a back-end framework, R - React, a client side framework, N - NodeJS (RESTful routing) - to run back end service and written in JavaScript including JWT authentication . Styling with Bootstrap and CSS. Problem: Students in the bootcamp have a difficult time connecting with current and past students including students from different disciplines. Another challenge is maintaining the ability to communicate and collaborate on projects. Solution:  Our application gives GA students the ability to see their current projects, websites and applications. Also, giving them the ability to reach out to current and past students even students that are not in their program type like Software Engineering and Data Science. Allowing students to connect and build a stronger network.</p>
                <div style={{ display: 'flex', marginTop: '30px' }}>
                    <a className='link' href="http://www.mergeimmersive.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link github' href="https://github.com/HoseaCodes/merge-immersive" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
        </div>
    )
}

export default CarouselMergeImmersive;