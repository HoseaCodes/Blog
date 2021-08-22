//https://hoseacodes.github.io/Project-1/

import React from 'react';
import './projectCardsFlip.css'

const ProjectCardsFlip = () => {
    return (
        <div>
            <h1> Projects</h1>
            <div className="wrapper">
                <div className="cols">
                    <div className="col" ontouchstart="this.classList.toggle('hover');">
                        <div className="container">
                            <div className="front" >
                                <div className="inner">
                                    <p>Project 1</p>
                                    <span>Calorie Kitchen</span>
                                </div>
                            </div>
                            <div className="back">
                                <div className="inner">
                                    <p>Project 1</p>
                                    <span>Lorem ipsum, dolor sit amet consectetur adipisicing elit. </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default ProjectCardsFlip;