import React from 'react';
import ProjectCard from '../Cards/projectCard';
import {projectData} from '../../Pages/Projects/ProjectsData';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './projectHighlight.css'
import { StyledButtonATag, StyledButtonH2, StyledDivButton } from '../../Layout/Button/styledButton';

function ProjectHighlight() {
  const highlights = projectData;
  highlights.length = 3;
  AOS.init();
    return (
        <div style={{ background: '#1A1E23' }}>
          {highlights.map(project => {
              return (<>
                <div className='project-container' style={{gridTemplateColumns: '1fr'}}>
                  <div className='project-content' data-aos={project.id % 2 == 0 ? "fade-right" : "fade-left"}
                    data-aos-offset="00"
                    data-aos-duration="3000">
                    <ProjectCard project={project}
                      key={project.id}/>
                  </div>
                </div>
              </>
            )})}
            <StyledDivButton>
              <StyledButtonH2>Visit my portfolio for more</StyledButtonH2>
              <StyledButtonATag href="http://www.dominiquehosea.com" rel="noopener noreferrer" target="_blank">My Portfolio</StyledButtonATag>
            </StyledDivButton>
        </div>
    )
}

export default ProjectHighlight;
