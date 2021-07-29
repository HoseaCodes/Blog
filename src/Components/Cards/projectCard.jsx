import React from 'react';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './projectCard.css'
import { Link } from 'react-router-dom';

function ProjectCard(props) {

  return (
      <>
       <section id="case-studies"  className="case-studies-section">
        <div className="section-mask"></div>
        <div className="case-study-content">
          <ul className="case-studies-list">
            <li>
              <Link to={`/project/${props.project.id}`}  className="case-study">
                <div className="case-study-mask"></div>
                <div className="case-study-reveal-mask"></div>
                <div className="case-study-mask-number">
                  <div className="case-study-mask-back">01</div>
                  <div className="case-study-mask-front">
                    <div data-index="01" className="case-study-mask-overlay">01</div></div>            
                    </div>
                <div className="case-study-text-section">
                  <h3 className="h2 case-study-title">Cerasa Redesign</h3>
                  <h5 className="case-study-subtitle">Leader in bathroom furniture since 1983.</h5>
                  <button className="case-study-button call-to-button">
                    <span className="case-study-button-text">Case Study</span>
                    <div className="case-study-button-mask"></div>
                    <span className="case-study-button-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213"><path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path></svg>                   </span>
                  </button>
                </div>
              </Link>
              </li>  
            </ul>
          </div>
        </section>
      </>
    )
}

export default ProjectCard;