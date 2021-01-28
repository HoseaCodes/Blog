import React, { Component } from 'react';
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
import Carousel from 'react-bootstrap/Carousel'
import './Technologies.css';

class Tech extends Component {
    render() {
        const img = [Bootstrap, JS, Django, MongoDB, Node, postgresql, Py, Reactt, Swift, JQuery, 'https://i.imgur.com/wiEM1zo.png'];
        return (
            <div className="tech-container">
                <h2 className='tech-title'>Technologies</h2>
                <Carousel>

                    {img.map(image => {
                        return (<Carousel.Item interval={500} keyboard="true" pause="hover">
                            <img
                                className="img d-block"
                                im
                                src={image}
                                alt="First slide"
                            />
                        </Carousel.Item>

                        )
                    })}


                </Carousel>

            </div>
        )
    }
}

export default Tech;
