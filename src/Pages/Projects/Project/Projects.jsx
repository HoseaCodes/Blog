import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar2 from '../../../Components/NavBar/NavBar2';
import Footer from '../../../Components/Footer/Footer';
import {projectData} from '../ProjectsData'
import  './Projects.css';

const ProjectItem = (props) => {
    const params = useParams()

    const newparm = parseInt(params.id)

    const { headerImg, name, link, title, role, objectives, subHeading, source, 
        background, context, design, designImg, headline, date, websites, typography,
        designColor, uiDesignImg, userFlows, mainFunctions, goal, version} = projectData[params.id - 1 ];

        const nextProjectLink = 
        <>
        { newparm + 1 <= projectData.length && newparm !== 0 ?
        <a style={{backgroundImage: `url(${projectData[newparm].headerImg})`}} href={`/project/${newparm + 1}`} className="next-work next-work-headerimg">
            <div className="project-content">
                <h5 className="h5 next-work-lead">Next Work</h5>
                <h4 className="h2 next-work-title">{projectData[newparm].name}</h4>
                <div className="next-work-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213"><path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path></svg>
                </div>    
            </div>
        </a>
    :
        <a style={{backgroundImage: `url(${projectData[newparm - 2].headerImg})`}} href={`/project/${newparm - 1}`} className="next-work">
            <div className="project-content">
                <h5 className="h5 next-work-lead">Previous Work</h5>
                <h4 className="h2 next-work-title">{projectData[newparm - 2].name}</h4>
                <div className="next-work-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213"><path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path></svg>
                </div>    
            </div>
        </a>
        }
        </>

    return (
        <>
            <NavBar2/>
            <div id="single-work" className="project-group">
                <header style={{backgroundImage: `url(${headerImg})`}} id="top" className="hero-single-work">
                    <div className="hero-single-work-content">
                        <div className="text-loading-mask">
                            <div className="text-loading-overlay is-reveal"></div>
                            <h1 className="hero-single-work-title">{name}</h1>
                        </div>
                        <div className="text-loading-mask">                            
                            <div className="text-loading-overlay is-reveal"></div>
                            <h3 className="hero-single-work-subtitle">{headline}</h3>
                        </div>
                    </div>
                    <div className="hero-single-context-stripe">
                        <div className="project-content">
                            <ul className="context-stripe-focus-area is-loaded">
                                <li>
                                <strong>Role</strong> 
                                    <span className="stripe-baffle">{role}</span>
                                </li>
                                <li><strong>Context</strong> <span className="stripe-baffle"> {context}</span>
                                </li>
                                <li><strong>Period</strong> <span className="stripe-baffle"> {date}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>
                <main className="single-work">
                    <section className="single-work-intro-section">
                        <div className="single-work-giga-text">
                            <p>{title}</p>
                        </div>
                        <div className="project-content">            
                            <div className="overview-section">
                                <div className="overview-container project-services">
                                    <div className="sticky-labels services-label">
                                    <h3 className="outline-title">Overview</h3>
                                    </div>
                                    <div className="w-layout-grid services-list">
                                        <div className="service-item">
                                            <div className="overview-column">
                                                <h6 className="overview-titles">Background</h6>
                                                <div className="separation-line service-line"></div>
                                                <p className="overview-descrp">{background}</p>
                                            </div>
                                            <div data-w-id="d560b535-42b5-12a8-ef8c-77aab6dce6db" className="services-column">
                                                <div className="column">
                                                    <h6 className="overview-titles">Objectives</h6>
                                                    <div className="separation-line service-line"></div>
                                                    <p className="overview-descrp">{objectives} <br/></p>
                                                </div>
                                            </div>
                                            <div className="column">
                                                <h6 className="overview-titles">My role</h6>
                                                <div className="separation-line service-line"></div>
                                                <p className="overview-descrp">{subHeading}</p>
                                            </div>
                                            <div className="column">
                                                <h6 className="overview-titles">Scope</h6>
                                                <div className="separation-line service-line"></div>
                                                <p className="overview-descrp">
                                                    {source.map((item) => {
                                                        return <>{item} <br/></>
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="button-content single-work-anim-text">
                                <a href={websites[0]} target="_blank" rel="noopener noreferrer" className="case-study-single-button ghost no-smoothState">
                                    <span className="button-text">Visit Website</span>
                                    <span className="button-icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 476.213 476.213"><path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path></svg>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </section>
                    <section className="single-work-section">
                        <div className="section-mask"></div>
                        <div className="project-content">
                            <div className="section-text-mask">
                                <h4 className="h5 section-subtitle">Analysis &amp; Preparation</h4>
                            </div>
                            <div className="section-text-mask">
                                <h2 className="h3 section-title">Branding</h2>
                            </div>
                            <div className="inner-container">
                                <div className="single-work-text-content is-left single-work-first-anim-blocks">
                                    <h3 className="single-work-content-title">An elegant design.</h3>
                                    <div className="single-work-content-separator"></div>
                                    <div className="single-work-content-desc">
                                        <p>{design}</p>
                                    </div>
                                </div>
                                <div className="single-work-img-content single-work-first-anim-blocks">
                                    <img src={designImg} alt="Cerasa User Interface Example"/>
                                </div>
                            </div>
                            <div className="inner-container color-palette-section">
                                {
                                    Object.keys(designColor).map((color) => {
                                        return (
                                            <>
                                                <div className="color-palette-container">
                                                    <div style={{backgroundColor: `${designColor[color]}`}} className="color-palette"></div>
                                                    <h5 className="color-palette-name">{color}</h5>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                            </div>
                            <div className="inner-container typography-container">
                                { Object.keys(typography).map((typeface, i) => {
                                    return (
                                        <>
                                        <div className="section-title">
                                            <h5 style={{paddingLeft: '30px'}}>{typeface}</h5>
                                            <img  style={{objectFit: 'contain', padding: '30px'}} src={typography[typeface]} alt="" srcset="" />
                                        </div>
                                        </>
                                    )
                                })
                            }
                            </div>
                        </div>    
                    </section>
                    <section className="single-work-intro-section">
                        <div className="section-mask"></div>
                        <div className="single-work-ui">
                            <div className="project-content">
                                <div className="section-text-mask">
                                    <h4 className="h5 section-subtitle">UI &amp; Components.</h4>
                                </div>
                                <div className="section-text-mask">
                                        <h2 className="h3 section-title">Design</h2>
                                </div>
                                <div className="inner-container single-work-ui-row single-work-anim-text">
                                    <div className="single-work-ui-image">
                                        <img src={uiDesignImg[0]} alt="cerasa ui description" />
                                    </div>
                                    <div className="single-work-ui-image">
                                        <img src={uiDesignImg[1]} alt="cerasa ui pagination"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="single-work-section">
                        <div className="section-mask"></div>
                        <div className="single-work-ui">
                            <div className="project-content">
                                <div className="section-text-mask">
                                    <h4 className="h5 section-subtitle">User flows  &amp; Tasks.</h4>
                                </div>
                                <div className="section-text-mask">
                                    <h2 className="h3 section-title">The Flow</h2>
                                </div>
                                <div className="inner-container single-work-ui-row single-work-anim-text">
                                    <p className="main-case-study-text"> 
                                        {userFlows}
                                        <br/><br/>
                                        <ul className="case-study-flows">
                                            <h4 className="h3 section-title">{mainFunctions.length} main functions:</h4>
                                            {
                                                mainFunctions.map((item) => {
                                                    return (
                                                        <li>{item}</li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </p>
                                </div>
                            </div>
                        </div>        
                        <div className="single-work-ui">
                            <div className="project-content">
                                <div className="section-text-mask">
                                    <h4 className="h5 section-subtitle">The Goal &amp; What's neaxt?.</h4>
                                </div>
                                <div className="section-text-mask">
                                    <h2 className="h3 section-title">{version}</h2>
                                </div>
                                <div className="inner-container single-work-ui-row single-work-anim-text">
                                    <p className="main-case-study-text">{goal} </p>
                                </div>
                            </div>
                        </div> 
                    </section>
                    {
                        nextProjectLink
                    }
                </main>
            </div>
            <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
            <Footer/>
        </>
    )
}

export default ProjectItem;