//Be mindful that your portfolio website
//is a representation of your personal 
//brand. All information, projects, and 
//images, as well as the language and tone, 
//should be aligned with your personal brand, 
//and help to illustrate your unique value 
//proposition. Showcase work that supports 
//your brand statement and value proposition. 
//The story that you tell with your website, 
//like your personal brand, should be about 
//your skills, as well as your passions, drive, 
//interests, and intellectual curiosity. Be 
//sure that why you do what you do is as clear 
//to your audience as what you do.

import React from 'react';
import './PersonalBrand.css'
import hosea2 from '../../icons/hosea2.jpeg';

const PersonalBrand = () => {
    return (
        <div className='personal-container'>
            <div className='group1'>
                <div className='group2'>
                </div>
                <img className='domImg' src={hosea2} alt="Dominique" width="300" height="300" />
                <div className='group3'>
                    <h2 className='pb-h2 letter'>About Me</h2>
                </div>
            </div>
            <h2 className='pb-h2'>Developer | Traveler | Adventurer </h2>
            <h2 className='pb-h2 skill'>Skills</h2>
            <hr />
            <p>I am skilled in front- and back-end technologies, frameworks, tools, and methods. I currently excel with React.js and Node.js</p>
            <h2 className='pb-h2 skill'>Education</h2>
            <hr />
            <p>I followed my passion and took the Software Engineer Immersive Course at General Assembly. Before that, I graduated from Texas Southern  University in 2017 with a degree in Management Information Systems. Since 2014 I have been working as an Operations Manager in logistics.</p>
            <h2 className='pb-h2 skill'>Fun</h2>
            <hr />
            <p>I love to learn, COD, traveling and sports like activities. I am passionate about Software Engineering and aesthetically pleasing applications.</p>
        </div>


    )
}

export default PersonalBrand;
