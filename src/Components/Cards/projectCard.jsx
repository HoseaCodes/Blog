import React from 'react';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './projectCard.css'

function ProjectCard() {

    return (
      <>
       <section id="case-studies"  class="case-studies-section">
   <div class="section-mask"></div>
   <div class="case-study-content">
     <ul class="case-studies-list">
       <li>
         <a href="#" class="case-study">
           <div class="case-study-mask"></div>
           <div class="case-study-reveal-mask"></div>
           <div class="case-study-mask-number">
             <div class="case-study-mask-back">01</div>
             <div class="case-study-mask-front">
               <div data-index="01" class="case-study-mask-overlay">01</div></div>            
               </div>
           <div class="case-study-text-section">
             <h3 class="h2 case-study-title">Cerasa Redesign</h3>
             <h5 class="case-study-subtitle">Leader in bathroom furniture since 1983.</h5>
             <button class="case-study-button call-to-button">
               <span class="case-study-button-text">Case Study</span>
               <div class="case-study-button-mask"></div>
               <span class="case-study-button-icon">
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213"><path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path></svg>                   </span>
             </button>
           </div>
         </a>
        </li>  
      </ul>
    </div>
   </section>
      </>
    )
}

export default ProjectCard;