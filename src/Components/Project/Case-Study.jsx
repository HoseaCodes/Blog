//Case Study Template

// Case studies are narratives that provide contextual details to tell a story about a particular project and the strategic process in which it developed. Your case study should be well written and articulated to lend credibility to your abilities as a developer, designer, or data scientist. It should offer the reader a rational and logical perspective and present your work in a thoughtful and concise manner that is easy to follow. This tool is a key component to a successful portfolio and will serve you well in your quest for employment. 

// FACTS AT A GLANCE
// Project Name


// Client/Geography 


// Industry


// Audience/Users


// Challenges


// Risks & Assumptions


// Solutions


// Results


// Technologies



// 1. Overview 
// Think of your Overview section as the executive summary of your case study. This allows your prospects to quickly understand the highlights of your work without reading it in its entirety. You should include the core takeaways from all other sections including the main problem, an overview of the solution, and key results. In order to write an effective and thorough case study, be aware how you intend to document the process. Strong documentation accurately illustrates your ideation, iteration, and key results.




// 2. Context & Challenge
// The second section is designed to provide your prospective client with a detailed description of the context that led to the creation of the project. It should provide a solid foundation and understanding of why it was important to tackle this problem and the circumstances surrounding its inception. This section is comprised of three parts:
// Background & Description
// Provide contextual information for the project to include timelines, budgetary constraints, team roles and responsibilities breakdown (if applicable), and the overarching purpose of the job.




// Problem
// Define the “why?” associated with what led to the creation of this project. Your case study should clearly explain this problem and should be the focal point for the project. 




// Goals & Objectives 
// Include any quantifiable metrics and set tangible goals and objectives to determine what success looks like. Having a clear vision of what you want to accomplish will help the reader understand when certain milestones have been satisfied. 




// 3. Process & Insight 
// Elaborate on why you made the decisions you made. This is where you document your research to help the reader arrive at the same insights. Walk the reader through your research, workflow, and iterations of your thought process while being mindful of the audience/user, business, or industry. Articulate the natural progression that deliberately explains the relationship and progression between the Challenge and the Solution. Be specific and include details that will illustrate your process such as wireframes, user flows, personas, brainstorming sketches, thumbnails, testing, and data diagrams.




// 4. Solution 
// This is where you get to show off your crowning achievements and your development and programming prowess. This is where the rubber hits the road. Include written descriptions of your work using whatever visual aids (code, photos, screenshots, sketches, videos, animations, etc.) you feel appropriate to illustrate your solutions. Be sure to highlight and describe in detail any defining features your solution(s) accomplish.





// 5. The Results
// This will be the qualitative and quantitative analysis of the project. This analysis and corresponding metrics should directly address the objectives and goals you set out to accomplish in the beginning (Context & Challenge). While success metrics are always desirable, never underestimate the importance and power of what made the project unsuccessful too. The emphasis is not on the failure but rather what was learned from it, what you would do differently, and how you intend to approach it again.




// Adapted from Simon Heaton - How to Write a Web Design Case Study that Lands New Clients featured in Shopify Partners blog post, January 15, 2016

import React from 'react';
import { Link } from "react-router-dom";
import '../Project/Case-Study.css';

const react = 'React'
const jQuery = 'Jquery'
const js = 'JavaScript'
const readMe = 'Read Me'
const library = 'Library'
const fEnd = 'FrontEnd'
const materialUI = 'Material UI'
const materialize = 'Materialize'
const bootstrap = 'Bootstrap'
const cs = 'Computer Science'
const structure = 'Data Structure'
const algorithms = 'Algorithms'
const db = 'Database'
const mongo = 'MongoDB'
const postgres = 'PostgreSQL'
const django = 'Django'
const python = 'Python'
const node = 'Node.JS'
const bEnd = 'Backend'

const CaseStudy = () => {
    return (
        <section>
            <div className="services-grid">
                <div className="service service1">
                    <h4 className='service-title'>{library}</h4>
                    <li className="skills"><span>{react}</span></li>
                    <li className="skills"><span>{jQuery}</span></li>
                    <li className="skills"><span>{js}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>
                <div className="service service1">
                    <h4 className='service-title'>{fEnd}</h4>
                    <li className="skills"><span>{materialUI}</span></li>
                    <li className="skills"><span>{materialize}</span></li>
                    <li className="skills"><span>{bootstrap}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>
                <div className="service service1">
                    <h4 className='service-title'>{cs}</h4>
                    <li className="skills"><span>{structure}</span></li>
                    <li className="skills"><span>{algorithms}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>

                <div className="service service1">
                    <i className="ti-light-bulb"></i>
                    <h4 className='service-title'>{bEnd}</h4>
                    <li className="skills"><span>{node}</span></li>
                    <li className="skills"><span>{python}</span></li>
                    <li className="skills"><span>{django}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>

                <div className="service service1">
                    <i className="ti-money"></i>
                    <h4 className='service-title'>{db}</h4>
                    <li className="skills"><span>{postgres}</span></li>
                    <li className="skills"><span>{mongo}</span></li>
                    <Link to="/projects" className="cta">{readMe}</Link>
                </div>
            </div>
        </section>
    )
}
export default CaseStudy;