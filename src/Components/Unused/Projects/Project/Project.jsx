import React from 'react';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import EventNoteIcon from '@material-ui/icons/EventNote';
import NavBar2 from '../../../Components/NavBar/NavBar2';
import Footer from '../../../Components/Footer/Footer';
import {projectData} from '../ProjectsData'

const ProjectItem = (props) => {
    const [projects] = projectData

    const { title, type, info, description, img, id, name, date } = projects;

    console.log(props)

    return (
        <>
            <NavBar2/>
            <main class="blog-content">
                <article className='blog-main'>
                    <h2 style={{ marginTop: '5rem', fontSize: '3rem', fontWeight: '600' }}>{name}</h2>
                    <hr style={{ background: 'rgb(235,183,65)', width: '100vw' }} />
                    <p style={{ marginTop: '2rem' }}>Hosea Codes Blog</p>
                    <div className='blog-combo'>
                        <section>
                            <h3 className='blog-title'>{title}</h3>
                            <img className='blog-img' src={img} alt={title}  />
                            <section className='blog-card'>
                                <section className="blog-heading">
                                    <br />
                                    <h6 className="blog-feature">Featured</h6>
                                    <h2>{info}</h2>
                                    <section className='blog-icon'>
                                        <PermIdentityIcon /> <span> By Dominique Hosea</span>
                                        &nbsp;&nbsp;
                                        <EventNoteIcon /> <span> {date}</span>
                                        &nbsp;&nbsp;
                                    </section>
                                </section>
                                <br />
                                <section className='blog-post'>
                                    <br />
                                    <p className='blog-content-info'>{description}</p>
                                    <br />     
                                    <br />
                                    <p className='blog-content-info'>{info}</p>
                                    <br />
                                </section>
                            </section>
                        </section>
                    </div>
                </article>
            </main>
            <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
            <Footer/>
        </>
    )
}

export default ProjectItem;