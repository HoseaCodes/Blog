import React, { Component, useEffect, useReducer, useState } from 'react';
import Bootstrap from '../../icons/Bootstrap.png';
import JS from '../../icons/jsicon.png';
import Django from '../../icons/django.png';
import MongoDB from '../../icons/MongoDB.png';
import Node from '../../icons/Node.png';
import postgresql from '../../icons/postgresql.png';
import Py from '../../icons/Py.png';
import Reactt from '../../icons/Reactt.png';
import Swift from '../../icons/swift.png';
import JQuery from '../../icons/jquery.png';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import './Technologies.css';

const ImageSlider = () => {

    const img = [Bootstrap, JS, Django, MongoDB, Node, postgresql, Py, Reactt, Swift, JQuery];
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent(current === img.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? img.length - 1 : current - 1);
    };

    if (!Array.isArray(img) || img.length <= 0) {
        return null;
    }

    return (
        <section className='slider' style={{ display: 'flex' }}>
            <div className="slide-track">
                <ArrowBackIosIcon
                    className='left-arrow'
                    onClick={prevSlide}>
                    ←
                </ArrowBackIosIcon>
                {img.map((slide, index) => {
                    return (
                        <div
                            className={index === current ? 'img-slide active' : 'img-slide'}
                            key={index}
                        >
                            {index === current && (
                                <img
                                    src={slide} alt='image'
                                    className='image' />
                            )}
                        </div>
                    );
                })}
                <ArrowForwardIosIcon
                    className='right-arrow'
                    onClick={nextSlide
                    }>
                    →
            </ArrowForwardIosIcon>
            </div>
        </section>
    );
};
class Tech extends Component {
    render() {
        return (
            <div className="tech-container">
                <h2 className='tech-title'>Technologies</h2>
                <ImageSlider></ImageSlider>

            </div>
        )
    }
}

export default Tech;
