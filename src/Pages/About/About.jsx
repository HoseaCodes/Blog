//Include an “About Me” section in your website. T
//he “About Me” section is an opportunity to expand 
//on the introduction that you offer to your audience 
//when they arrive on your homepage. In this section 
//you show some of your personality and let your audience 
//connect with the person behind the work. Tap into your 
//professional story and your value proposition, and highlight 
//what you do, why you do it, and how you do it. 
//You can communicate how you became motivated to start a career 
//in your desired industry, what drives you currently, 
//the problems that you solve, and your current industry-related
//passions. There is no need to include extensive details or your 
//whole life story in the “About Me” section. Stick to the what, 
//why, and how of your professional story, and any personal 
//information that impacted or informed your professional story.
//You can include some additional, brief details about your 
//personal life in the “About Me” section, after you’ve detailed 
//your professional story. You can include information about your 
//interests, hobbies, pets, kids, partner, and geographic location. 
//Including this information can help your audience connect with 
//the person behind the work. It is important, however, to keep 
//the personal details brief and not too personal. Remember that 
//we want to cast the widest net when job searching. Use your 
//judgement and avoid including any personal details that could 
//be interpreted as less than positive by anyone in your audience.
//If you have another passion, particularly if that passion 
//compliments the work that you will be doing in your desired 
//industry, it’s also acceptable to include this information in 
//your “About Me” section. For example, if you’re a UX designer, 
//who also has a passion and talent for graphic design, you can 
//include information about your graphic design skills, and 
//include a link to your graphic design website. If you do 
//include information about a secondary passion, be sure that your 
//messaging around this interest is brief and doesn’t distract 
//from your primary messaging around your career interest.
//You can consider including a photo of yourself in the “About Me” 
//section. Adding a photo can help your audience connect with you. 
//Some job seekers include professional headshots, while others 
//opt for action photos that show them engaging in the work that 
//they are interested in doing professionally. Whichever type of 
//photo you include, it should be high-quality and represent your 
//personal brand.
//Make sure to include a downloadable PDF version of your resume in 
//your “About Me” section as well.

import React, { Component } from 'react';
import './About.css';
import ccLogo from '../../icons/ccLogo.png';
import MA from '../../icons/MA.mp4';
import MA1 from '../../icons/MA1.png';
import CK from '../../icons/CK.png';
import MI from '../../icons/MI.png';
import MI2 from '../../icons/MI2.png';
import CB from '../../icons/CB.jpeg';
import AD from '../../icons/AD.jpeg';
import ST from '../../icons/ST.jpeg';
import Carousel from 'react-elastic-carousel';
import NavBar2 from '../../Components/NavBar/NavBar2';


class Logo extends Component {
    state = {
        logos: [
            { id: 1, title: 'JavaScript', img: ccLogo },
            { id: 2, title: 'Bootstrap', img: MA },
            { id: 3, title: 'Django', img: MA1 },
            { id: 4, title: 'MongoDB', img: CK },
            { id: 5, title: 'Node', img: MI },
            { id: 6, title: 'postgresql', img: MI2 },
            { id: 7, title: 'Python', img: CB },
            { id: 8, title: 'React', img: AD },
            { id: 9, title: 'Swift', img: ST },
        ]
    }
    constructor(props) {
        super(props)
        this.breakPoints = [
            { width: 1, itemsToShow: 1 },
            { width: 550, itemsToShow: 2, itemsToScroll: 2, pagination: false },
            { width: 850, itemsToShow: 3 },
            { width: 1150, itemsToShow: 4, itemsToScroll: 2 },
            { width: 1450, itemsToShow: 5 },
            { width: 1750, itemsToShow: 6 },
        ];

    }
    render() {
        const { logos } = this.state;

        return (
            <Carousel style={{ background: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }} itemsToScroll={1} itemsToShow={2}
                initialActiveIndex={4} focusOnSelect={true}
                enableAutoPlay autoPlaySpeed={2000}
                itemPadding={[10, 40]} >
                {logos.map(logo => <div key={logo.id}>
                    <img src={logo.img} alt={logo.title} width="300px" />
                </div>)}
            </Carousel>
        );
    }
};

const About = () => {
    return (
        <div>
            <NavBar2 />
            <div className='aHeader'></div>
            <div className="quote">
                <q>
                    What you think, you become. What you feel, you attract. What you imagine, you create.
                </q>
                <p className="pQuote">-Buddha</p>
            </div>
            <div className="imageHiglights">
                <Logo />
            </div>
            {/* <!-- Quote/Highlight End  --> */}

            {/* <!-- Timeline  -->  */}
            <div className="timeline">
                <div id="timeline" className="about-container left">
                    <div className="content">
                        <h2>2020</h2>
                        <p className="timelineP a-content">I enrolled as a full stack software engineer student at General Assembly, where I was exposed to the MERN stack. In the program I was able to turn my MIS knowledge into applicable real-world solutions. I developed several full stack web apps, and worked on dynamic team projects. The projects allowed me to hone my skills in frontend development, client-servers and routing, Node.js, Express.js, MongoDB, OAuth, SPA Architecture, React, Python, JavaScript and Django web framework.</p>
                    </div>
                </div>
                <div className="about-container right">
                    <div className="content">
                        <h2>2017</h2>
                        <p className="timelineP a-content">My attention to detail and love for technology lead me to seek a deep understanding in Management of Information Systems and dive back into software engineering. I received my Master of Science in Management Information Systems where I got a sound understanding of relational database, SQL, C#/C++, and business processes.</p>
                    </div>
                </div>
                <div className="about-container left">
                    <div className="content">
                        <h2>2014</h2>
                        <p className="timelineP a-content">After I received my Bachelor of Business Administration in Management with focus in supply chain, I got a job as an Operations Manager at J.B. Hunt. During this time identified underlying problems, analyzing potential solutions and implementing resolutions.</p>
                    </div>
                </div>
                <div className="about-container right">
                    <div className="content">
                        <h2>2010</h2>
                        <p className="timelineP a-content">In my junior year I decided to take Java and C++ as my elective course and my interest was peaked. I new I wanted to continue but I did not know how I wanted to proceed. </p>
                    </div>
                </div>
            </div>
            {/* <!-- Timeline End  --> */}
        </div>
    )
}

export default About;