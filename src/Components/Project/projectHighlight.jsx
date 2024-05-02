import React from 'react';
import ProjectCard from '../Cards/project';
import {projectData} from '../../Pages/Projects/ProjectsData';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './projectHighlight.css'
import { StyledButtonH2, StyledDivButton } from '../../Layout/Button/styledButton';
import { AncorButton } from '../Button/AncorButton';

function ProjectHighlight() {
  const highlights = projectData;
  highlights.length = 3;
  AOS.init();
    return (
        <div style={{ background: '#1A1E23' }}>
          {highlights.map(project => {
              return (<div key={project.id} >
                <div className='project-container' style={{gridTemplateColumns: '1fr'}}>
                  <div className='project-content' data-aos={project.id % 2 == 0 ? "fade-right" : "fade-left"}
                    data-aos-offset="00"
                    data-aos-duration="3000">
                    <ProjectCard project={project}
                      key={project.id}/>
                  </div>
                </div>
              </div>
            )})}
            <StyledDivButton>
              <StyledButtonH2>Visit my portfolio for more</StyledButtonH2>
              <AncorButton primary href="http://www.dominiquehosea.com" target="_blank" label="My Portfolio"/>
            </StyledDivButton>
        </div>
    )
}

export default ProjectHighlight;
