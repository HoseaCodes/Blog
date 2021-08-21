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
import './Technologies.css';


class Tech extends Component {
    
    render() {
        const imgSlide = {"bootstrap": Bootstrap, "javascript": JS, "Django": Django, 
        "mongodb": MongoDB, "nodejs": Node, "postgresql": postgresql, "python": Py, "react": Reactt, 
        "swift": Swift,"jquery": JQuery, "java": 'https://i.imgur.com/wiEM1zo.png',"solidity": 'https://i.imgur.com/NhpXJN2.png'};
        return (
            <>
                <div className="tech-container">
                    <h2 
                    data-aos="fade-down" 
                    data-aos-offset="500"
                    data-aos-duration="3000"
                    data-aos-easing="ease-in"
                    className='tech-title'>Technologies</h2>
                   
                    <div className="client-slider">
                        <div className="client-slide-track">
                            {Object.keys(imgSlide).map((img) => {
                                return (
                                    <>
                                     <div className="client-slide">
                                        <img src={imgSlide[img]} height="100" width="150" alt={img} />
                                    </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </>
        )
    }
}

export default Tech;
