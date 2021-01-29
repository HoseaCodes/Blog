//Testimonials are an optional feature that 
//can help make your website more impactful. 
//Ask internal or external clients, 
//colleagues, and supervisors for 
//testimonials that speak to your skill set 
//and your unique value proposition. Avoid 
//including testimonials that are general 
//and that don’t support your brand statement. 
//You can use your LinkedIn recommendations on 
//your website, or an edited snippet from a 
//longer LinkedIn recommendation. Aim to 
//showcase one to five short, powerful 
//testimonials. It is not necessary to include 
//a separate tab of testimonials. You can 
//include testimonials on your homepage, 
//“About Me” section, or with the projects 
//that you showcase in your portfolio section, 
//if the testimonial is directly related to one 
//of the projects that you are showcasing. 
//Testimonials are optional, so don’t feel 
//like your website is incomplete without them. 
//If you don’t have any testimonials currently, 
//consider making it a goal to gather some as 
//you progress in your career, and update your 
//website at a later date.


import React, { useState, useCallback } from "react";
import { useTransition, animated } from "react-spring";
import TwitterIcon from '@material-ui/icons/Twitter';
import './Testimonials.css'
import Aaron from '../../icons/aaron.png'
import Chengu from '../../icons/Chengu.png'
import Nathan from '../../icons/Nathan.png'


const steps = [
    {
        title: "Aaron Rascon",
        fName: 'Aaron',
        description:
            '"Oh man, professional! Knocked this one out of the park. The styling is amazing!! Absolutely wonderful UI."',
        imageUrl:
            Aaron,
        social:
            "https://twitter.com/Arooon08238727",

        isActive: false
    },
    {
        title: "Chengu Kargbo",
        fName: 'Chengu',
        description:
            '"Amazing job! 6 API’s! Nested ajax requests! And a beautiful layout with a video as your header!!! WOW!!"',
        imageUrl:
            Chengu,
        social:
            "https://twitter.com/ChenguKargbo",
        isActive: false
    },
    {
        title: "Nathan Childress",
        fName: 'Nathan',
        description:
            '"Liked the color scheme and how you made full use of everything your api collection had to offer. The joke addition adds a little personal connect feeling for the user and all the recipe info is not hidden behind a wall of filter choices."',
        imageUrl:
            Nathan,
        isActive: false
    },

];





const Testimonials = () => {
    const [index, setIndex] = useState(0);
    const prev = useCallback(
        () =>
            setIndex(state =>
                state === 0 ? steps.length - 1 : (state - 1) % steps.length
            ),
        []
    );
    const next = useCallback(
        () => setIndex(state => (state + 1) % steps.length),
        []
    );

    const transitions = useTransition(index, p => p, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 1 }
    });

    return (
        <div className="t-container">
            <ul className="step-list">
                <li className="step-overlay">
                    <button className="prev-button" onClick={prev}
                        data-aos="fade-left"
                        data-aos-offset="600"
                        data-aos-duration="3000"
                    >
                        ‹
              </button>
                    <button className="next-button" style={{ right: '0' }} onClick={next}
                        data-aos="fade-left"
                        data-aos-offset="600"
                        data-aos-duration="3000"
                    >
                        ›
              </button>
                </li>

                {transitions.map(({ item, key }) => {
                    let step = steps[item];

                    for (let i = 0; i < steps.length; i++) {
                        steps[i].isActive = false;
                    }

                    step.isActive = true;

                    return (
                        <animated.li className="step-item" key={key}>
                            <div className="step-image"
                                data-aos="fade-right"
                                data-aos-offset="600"
                                data-aos-duration="3000"
                            >
                                <img src={step.imageUrl} alt={step.title} />
                            </div>
                            <div className="step-content"
                                data-aos="fade-left"
                                data-aos-offset="600"
                                data-aos-duration="3000"
                            >
                                <h2 className='t-title' style={{ color: 'white', opacity: '.6' }}>
                                    <small style={{ color: 'white', opacity: '.6' }}>Testimony {item + 1}</small>
                                    <br />
                                    {step.title}
                                </h2>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                                    <p style={{ opacity: '.6' }} >{step.description}</p>
                                    <div style={{
                                        display: 'flex', flexDirection: 'column',
                                        alignItems: 'center'
                                    }}>
                                        <p style={{ opacity: '.6', margin: '0', lineHeight: '40px', letterSpacing: '1px' }}> Follow {step.fName} on Twitter</p>
                                        <a className='social' href={step.social} rel="noopener noreferrer" target="_blank">
                                            <TwitterIcon fontSize="large" />
                                        </a>
                                    </div>
                                </div>


                            </div>
                        </animated.li>
                    );
                })}
            </ul>

            <ul className="step-nav" style={{ listStyle: 'none' }}
                data-aos="fade-left"
                data-aos-offset="00"
                data-aos-duration="3000"
            >
                {steps.map((step, index) => {
                    return (
                        <li className={`nav-item ${step.isActive ? "active" : ""}`}>
                            <button
                                type="button"
                                className="nav-button"
                                onClick={() => setIndex(index)}
                            >
                                <img src={step.imageUrl} alt={step.fName} className="nav-image" />
                                <p className="nav-content">{`${index + 1}. ${step.title}`}</p>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Testimonials;
