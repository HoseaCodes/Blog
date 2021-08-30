import React from 'react';
import { Link } from 'react-router-dom';

import './projectCard.css'

function ProjectCard(props) {

  return (
      <>
        <section id="case-studies"  className="case-studies-section">
          <div className="section-mask"></div>
          <div className="case-study-content">
              <div className="case-studies-list">
                  <Link to={`/project/${props.project.id}`}  className="case-study" style={{backgroundImage: `url(${props.project.img})`}}>
                    <div className="case-study-mask"></div>
                    <div className="case-study-reveal-mask"></div>
                    <div className="case-study-mask-number">
                      <div className="case-study-mask-back">0{props.project.id}</div>
                      <div className="case-study-mask-front">
                        <div data-index={`0${props.project.id}`} className="case-study-mask-overlay">{props.project.id}</div>
                      </div>            
                    </div>
                    <div className="case-study-text-section">
                      <h3 className="case-study-title">{props.project.name}</h3>
                      <h5 className="case-study-subtitle">{props.project.title}</h5>
                      <button className="case-study-button call-to-button">
                        <span className="case-study-button-text">Case Study</span>
                        <div className="case-study-button-mask"></div>
                        <span className="case-study-button-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213"><path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path></svg>                   
                          </span>
                      </button>
                    </div>
                  </Link>
                </div>
              </div>
        </section>
      </>
    )
}

export default ProjectCard;