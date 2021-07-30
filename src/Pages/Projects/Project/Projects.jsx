import React from 'react';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import EventNoteIcon from '@material-ui/icons/EventNote';
import NavBar2 from '../../../Components/NavBar/NavBar2';
import Footer from '../../../Components/Footer/Footer';
import {projectData} from '../ProjectsData'
import  './Projects.css';

const ProjectItem = (props) => {
    const [projects] = projectData

    const { title, type, info, description, img, id, name, date } = projects;

    console.log(props)

    return (
        <>
            <NavBar2/>
            <div id="single-work" class="cerasa">
                <header style={{backgroundImage: `url('https://i.imgur.com/6zFLMoK.jpg')`}} id="top" class="hero-single-work">
                    <div class="hero-single-work-content">
                        <div class="text-loading-mask">
                            <div class="text-loading-overlay is-reveal"></div>
                            <h1 itemprop="name" class="hero-single-work-title"> Black Paper - Crypto Learn</h1>
                        </div>
                        <div class="text-loading-mask">                            <div class="text-loading-overlay is-reveal"></div>
                            <h3 class="hero-single-work-subtitle">Learn crypto the easy way.</h3>
                        </div>
                    </div>
                    <div class="hero-single-context-stripe">
                        <div class="project-content">
                            <ul class="context-stripe-focus-area is-loaded">
                                <li>
                                <strong>Role</strong> 
                                    <span class="stripe-baffle">Consultant Software Developer</span>
                                </li>
                                <li><strong>Context</strong> <span class="stripe-baffle">IOS App Creation</span>
                                </li>
                                <li><strong>Period</strong> <span class="stripe-baffle">Summer 2021</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>
                <main class="single-work">
                    <section class="single-work-intro-section">
                        <div class="single-work-giga-text">
                            <p>BLACK PAPER</p>
                        </div>
                        <div class="project-content">            
                            <div class="overview-section">
                                <div class="overview-container project-services">
                                    <div class="sticky-labels services-label">
                                    <h3 class="outline-title">Overview</h3>
                                    </div>
                                    <div class="w-layout-grid services-list">
                                        <div class="service-item">
                                            <div class="overview-column">
                                                <h6 class="overview-titles">Background</h6>
                                                <div class="separation-line service-line"></div>
                                                <p class="overview-descrp">Sphere is a premier private space travel company offering trips to Mars. Sphere is looking to sell tickets to Mars by fostering public interest and increasing transparency in space tourism. </p>
                                            </div>
                                            <div data-w-id="d560b535-42b5-12a8-ef8c-77aab6dce6db" class="services-column">
                                                <div class="column">
                                                    <h6 class="overview-titles">Objectives</h6>
                                                    <div class="separation-line service-line"></div>
                                                    <p class="overview-descrp">Design a responsive space tourism website that not only informs the user of the mission and astronaut process, but also is visually captivating and futuristic <br/></p>
                                                </div>
                                            </div>
                                            <div class="column">
                                                <h6 class="overview-titles">My role</h6>
                                                <div class="separation-line service-line"></div>
                                                <p class="overview-descrp">Research, UX, UI</p>
                                            </div>
                                            <div class="column">
                                                <h6 class="overview-titles">Scope</h6>
                                                <div class="separation-line service-line"></div>
                                                <p class="overview-descrp">156 hours<br/>Self-started project</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="button-content single-work-anim-text">
                                <a href="http://cerasa.it/" target="_blank" rel="noopener" class="case-study-single-button ghost no-smoothState">
                                    <span class="button-text">Visit Website</span>
                                    <span class="button-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213"><path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path></svg>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </section>
                    <section class="single-work-section">
                        <div class="section-mask"></div>
                        <div class="project-content">
                            <div class="section-text-mask">
                                <h4 class="h5 section-subtitle">Analysis &amp; Preparation</h4>
                            </div>
                            <div class="section-text-mask">
                                <h2 class="h3 section-title">Branding</h2>
                            </div>
                            <div class="inner-container">
                                <div class="single-work-text-content is-left single-work-first-anim-blocks">
                                    <h3 class="single-work-content-title">An elegant design.</h3>
                                    <div class="single-work-content-separator"></div>
                                    <div class="single-work-content-desc">
                                        <p>As the <strong>Front-end Developer</strong>, I was responsible of building the entire UI for the new website, redefining the User Experience and studying new interactions between the User and the Interface.</p><p>One of the most exciting experience was integrating the entire front-end system with the <strong>Ruby on Rails Application</strong> and the change page animation.</p>
                                    </div>
                                </div>
                                <div class="single-work-img-content single-work-first-anim-blocks">
                                    <img src="https://i.imgur.com/9Ewbskn.png" alt="Cerasa User Interface Example"/>
                                </div>
                            </div>
                            <div class="inner-container color-palette-section">
                                <div class="color-palette-container">
                                    <div style={{backgroundColor: "#060c10"}} class="color-palette"></div>
                                    <h5 class="color-palette-name">$ebony</h5>
                                </div>
                                <div class="color-palette-container">
                                    <div style={{backgroundColor: "#333333"}} class="color-palette"></div>
                                    <h5 class="color-palette-name">$mine-shaft</h5>
                                </div>
                                <div class="color-palette-container">
                                    <div style={{backgroundColor: "#ededed"}} class="color-palette"></div>
                                    <h5 class="color-palette-name">$gallery</h5>
                                </div>
                                <div class="color-palette-container">
                                    <div class="color-palette"></div>
                                    <h5 class="color-palette-name">$white</h5>
                                </div>
                                <div class="color-palette-container">
                                    <div style={{backgroundColor: "#0069a6"}} class="color-palette"></div>
                                    <h5 class="color-palette-name">$denim</h5>
                                </div>
                            </div>
                            <div class="inner-container">
                                <div style={{backgroundImage: `url('https://i.imgur.com/yeC3yEc.png');`}} class="single-work-font single-work-first-anim-blocks"></div>
                                <div style={{backgroundImage: `url('https://i.imgur.com/yeC3yEc.png');`}} class="single-work-font single-work-first-anim-blocks"></div>
                            </div>
                        </div>
                        <div class="single-work-ui">
                            <div class="project-content">
                                <div class="section-text-mask">
                                    <h4 class="h5 section-subtitle">UI &amp; Components.</h4>
                                </div>
                                <div class="section-text-mask">
                                        <h2 class="h3 section-title">Design</h2>
                                </div>
                                <div class="inner-container single-work-ui-row single-work-anim-text">
                                    <div class="single-work-ui-image">
                                        <img src="https://i.imgur.com/i8bkYCv.png" alt="cerasa ui description" itemprop="image"/>
                                    </div>
                                    <div class="single-work-ui-image">
                                        <img src="ihttps://i.imgur.com/VAcp7Js.png" alt="cerasa ui pagination"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="single-work-ui">
                            <div class="project-content">
                                <div class="section-text-mask">
                                    <h4 class="h5 section-subtitle">User flows  &amp; Tasks.</h4>
                                </div>
                                <div class="section-text-mask">
                                    <h2 class="h3 section-title">The Flow</h2>
                                </div>
                                <div class="inner-container single-work-ui-row single-work-anim-text">
                                    <p class="main-case-study-text"> User flows and tasks are lists of all possible actions that needs to be thoroughly considered, as well as the system behavior in each scenario. It gives us the overview of the activities user is able to perform. The user flows and the task that the children would complete were based on the schools curricula ad their resources. <br/><br/>
                                    Together with the school board we decided to focus on 4 main functions: learning materials, consolidation of knowledge, exams and educational games. Children can first learn a specific substance, consolidate and later check and test the knowledge in an entertaining game. <br/><br/>
                                        <ul class="case-study-flows">
                                            <h4>4 main functions:</h4>
                                            <li>Learning materials</li>
                                            <li>Consolidation of knowledge</li>
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </div>        
                        <div class="single-work-ui">
                            <div class="project-content">
                                <div class="section-text-mask">
                                    <h4 class="h5 section-subtitle">The Goal &amp; What's neaxt?.</h4>
                                </div>
                                <div class="section-text-mask">
                                    <h2 class="h3 section-title">The Black Paper v1.0</h2>
                                </div>
                                <div class="inner-container single-work-ui-row single-work-anim-text">
                                    <p class="main-case-study-text"> The primary app idea is to allow users to easily create, share and count down to their moments. Whether it's a wedding, a holiday or just a night out with friends. There are many similar apps already on the market, however most of them provide a very complex, buggy solutions cluttered with ads. <br/><br/>
                                    Our main requirements has always been to keep the app usable, reliable and functional. Aesthetically minimal, simple and clean. No ads, no tricks, but a consistent and intuitive user experience, providing value to our users, keeping them satisfied and engaged. Our reviews on App Store speak for themself:<br/><br/>
                                    After our first launch we have closely monitored and collected feedback from customers. We have addressed and implemented all of the most requested features. Our app was growing and at the we had over 140k monthly active users. As we were identifying new opportunities to scale the app, we have decided to prepare a better foundation to support future ideas and direction. Redesigning and rebuilding the app in code was a necessary step to move forward. With releasing Days 2.0 we made the app faster, smarter and more beautiful than ever.</p>
                                </div>
                            </div>
                        </div> 
                    </section>
                    <a href="/lato" data-destination="lato" class="next-work">
                        <div class="project-content">
                            <h5 class="h5 next-work-lead">Next Work</h5>
                            <h4 class="h2 next-work-title">Project Lato</h4>
                            <div class="next-work-arrow">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213"><path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path></svg>
                            </div>    
                        </div>
                    </a>
                </main>
            </div>
            <Footer/>
        </>
    )
}

export default ProjectItem;