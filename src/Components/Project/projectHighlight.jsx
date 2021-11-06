import React from 'react';
import ProjectCard from '../Cards/projectCard';
import {projectData} from '../../Pages/Projects/ProjectsData';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './projectHighlight.css'
import { StyledButtonATag, StyledButtonH2, StyledDivButton } from '../../Layout/Button/styledButton';

function ProjectHighlight() {

    AOS.init();
    return (
        <div style={{ background: '#1A1E23' }}>
            <div className='project-container' style={{gridTemplateColumns: '1fr'}}>
                <div className='project-content' data-aos="fade-right"
                data-aos-offset="00"
                data-aos-duration="3000"
                >
                    <ProjectCard project={projectData[0]}/>
                </div>
                {/* <div className='project-content' data-aos="fade-down" data-aos-duration="3000" data-aos-offset="500"
                    data-aos-delay="300">
                    <ProjectCard project={projectData[1]}/>
                </div>

                <div className='project-content' data-aos="fade-left"
                data-aos-offset="00"
                data-aos-duration="3000">
                    <ProjectCard project={projectData[2]}/>

                </div> */}
            </div>
            <StyledDivButton>
              <StyledButtonH2>Visit my portfolio for more</StyledButtonH2>
              <StyledButtonATag href="http://www.dominiquehosea.com" rel="noopener noreferrer" target="_blank">My Portfolio</StyledButtonATag>
            </StyledDivButton>
        </div>
    )
}

export default ProjectHighlight;
