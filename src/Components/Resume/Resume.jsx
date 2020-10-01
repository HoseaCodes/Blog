import React from 'react';
import './Resume.css'
import Resume2020 from '../../icons/Resume2020.pdf'
const Resume = () => {
    return (
        <div className='resume-group'>
            <a className="btn-input" href={Resume2020} download="Resume2020.pdf">
                Download Resume
    </a>
            <br />
            <a className="btn-input" href='#btn'>
                View Resume
    </a>
        </div>
    )
}
export default Resume;