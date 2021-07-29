import React from 'react';
import ProjectCard from '../Cards/projectCard';
import {projectData} from '../../Pages/Projects/ProjectsData';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';


function ProjectHighlight() {

    window.addEventListener(
        "scroll",
        () => {
            document.body.style.setProperty(
                "--scroll",
                window.pageYOffset / (document.body.offsetHeight - window.innerHeight)
            );
        },
        false
    );
    AOS.init();
    return (
        <div style={{ background: '#1A1E23' }}>
            <div className='p-container'>
                <div className='p-content' data-aos="fade-right"
                data-aos-offset="00"
                data-aos-duration="3000"
                >
                    <ProjectCard project={projectData[0]}/>
                </div>
                <div className='p-content' data-aos="fade-down" data-aos-duration="3000" data-aos-offset="500"
                    data-aos-delay="300">
                    <ProjectCard project={projectData[1]}/>
                </div>

                <div className='p-content' data-aos="fade-left"
                data-aos-offset="00"
                data-aos-duration="3000">
                    <ProjectCard project={projectData[2]}/>

                </div>
            </div>
            <div className="portfolio-group">
                <h2 className='p-h2'>Visit my portfolio for more</h2>
                <a className="link portfolio" href="http://www.dominiquehosea.com" rel="noopener noreferrer" target="_blank">My Portfolio</a>
            </div>
        </div>
    )
}

export default ProjectHighlight;