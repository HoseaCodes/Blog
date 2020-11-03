import React from 'react';
import './Resume.css'
import Resume2020 from '../../icons/Resume2020.pdf'
const Resume = () => {
    return (
        <div className='resume-group'>
            <a className="btn-input" href={Resume2020} download="Resume2020.pdf"
                data-aos="fade-right"
                data-aos-offset="300"
                data-aos-easing="ease-in-sine"
            >
                Download Resume
    </a>
            <br />
            <a className="btn-input" href='#btn'
                data-aos="fade-left"
                data-aos-offset="500"
                data-aos-duration="500"
            >
                View Resume
    </a>
        </div>
    )
}
export default Resume;