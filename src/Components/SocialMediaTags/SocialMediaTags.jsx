import React from 'react';
import './SocialMediaTags.css'
import Resume2020 from '../../Assets/Files/Resume2020.pdf'

const SocialMediaTags = () => {
    return (
        <ul className="social_footer_ul">
            <li><a rel="noopener noreferrer" href="https://github.com/HoseaCodes"><i className="fab fa-github"></i></a></li>
            <li><a rel="noopener noreferrer" href="https://codepen.io/hosead6168"><i className="fab fa-codepen"></i></a></li>
            <li><a rel="noopener noreferrer" href="https://twitter.com/DominiqueRHosea"><i className="fab fa-twitter"></i></a></li>
            <li><a rel="noopener noreferrer" href="https://www.linkedin.com/in/dominique-hosea/"><i className="fab fa-linkedin"></i></a></li>
            <li><a rel="noopener noreferrer" href="https://www.youtube.com/channel/UCW0iZYA3zE03qlVJqVE_ajQ"><i className="fab fa-youtube"></i></a></li>
            <li><a rel="noopener noreferrer" href={Resume2020} download="Resume2020.pdf"><i className="fas fa-download"></i></a></li>
        </ul>
    )
}

export default SocialMediaTags;
