import React, { Component } from 'react'
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { articleData } from './ArticleData';
import NavBar2 from '../../Components/NavBar/NavBar2'
import './Blog.css'
import Footer from '../../Components/Footer/Footer';

class Bash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: articleData[0],

        }
    }


    render() {
        const { name, date, info, title, img, tags, lists, subHeading } = this.state.article;
        return (
            <div>
                <NavBar2 />
                <main className="blog-content">
                    <article className='blog-main'>
                        <h2 style={{ marginTop: '5rem', fontSize: '3rem', fontWeight: '600' }}>{name}</h2>
                        <hr style={{ background: 'rgb(235,183,65)', width: '100vw' }} />
                        <p style={{ marginTop: '2rem' }}>Hosea Codes Blog</p>
                        <div className='blog-combo'>
                            <article>
                                <h3 className='blog-title'>{title}</h3>
                                <img className='blog-img' src="https://i.imgur.com/GYcr7gZ.png" alt={name} />
                                <article className='blog-card'>
                                    <section className="blog-heading">
                                        <br />
                                        <h6 className="blog-feature">Featured</h6>
                                        <h2>{name}</h2>
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
                                        <h3 className='blog-subtitle'>{subHeading[0]}</h3>
                                        <br />
                                        <p className='blog-content-info'>{info[0]}</p>
                                        <br />
                                        <div style={{ display: 'flex' }}>
                                            <img id="terminal" src="https://i.imgur.com/cnYPuQC.png" alt="terminal" />
                                            <p style={{ marginLeft: '1rem', textAlign: 'justify' }} className='blog-content-info'>{info[1]} </p>
                                        </div>
                                        <br />
                                        <p style={{ marginRight: '1rem', textAlign: 'justify' }} className='blog-content-info'>{info[2]}
                                            <a style={{ textDecoration: "none" }} href="http://https://github.com/HoseaCodes/Bash-Commands/blob/master/Bash-Commands.md" target="_blank" rel="noopener noreferrer"> Hoseacodes Cheatsheet</a></p>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                            <div>
                                                {lists.map(list => {
                                                    return (<li style={{ listStyle: "none", marginRight: "1rem" }} className='blog-content-info'>{list}</li>
                                                    )
                                                })}
                                            </div>
                                            <video loop="true" autoplay="autoplay" muted width="50%">
                                                <source src="https://i.imgur.com/gGeSG7W.mp4" type="video/mp4" />
                                            </video>
                                        </div>
                                        <br />
                                        <h3 className='blog-subtitle'>{subHeading[1]}</h3>
                                        <p className='blog-content-info'>{info[3]}</p>
                                        <h3 className='blog-subtitle'> {subHeading[2]}</h3>
                                        <h3 className='blog-subtitle'>{subHeading[3]}</h3>
                                        <h3 className='blog-subtitle'>{subHeading[4]}</h3>
                                        <p className='blog-content-info'>{info[4]}</p>
                                        <h3 className='blog-subtitle'>{subHeading[5]}</h3>
                                        <p className='blog-content-info'>{info[5]}</p>
                                        <h3 className='blog-subtitle'>{subHeading[6]}</h3>
                                        <p className='blog-content-info'>{info[6]}</p>
                                    </section>
                                    <section>
                                        <h4 className='blog-subtitle'>Reference Guide</h4>
                                        <h5>
                                            <a href="https://github.com/HoseaCodes/Bash-Commands/blob/master/Bash-Commands.md" target="_blank" rel="noopener noreferrer">Hoseacodes Cheatsheet</a>
                                        </h5>
                                        <h5>
                                            <a href="https://www.freecodecamp.org/news/basic-linux-commands-bash-tips-you-should-know/" target="_blank" rel="noopener noreferrer">Freecodecamp Cheatsheet</a>
                                        </h5>
                                        <h5>
                                            <a href="https://courses.cs.washington.edu/courses/cse391/16sp/bash.html" target="_blank" rel="noopener noreferrer">Bash List</a>
                                        </h5>
                                        <h5>
                                            <a href="https://www.educative.io/blog/bash-shell-command-cheat-sheet" target="_blank" rel="noopener noreferrer">Educative Cheatsheet</a>
                                        </h5>
                                        <h5>
                                            <a href="https://dev.to/awwsmm/101-bash-commands-and-tips-for-beginners-to-experts-30je" target="_blank" rel="noopener noreferrer">In-depth Bash Learning</a>
                                        </h5>
                                        <h5>
                                            <a href="https://www.puttygen.com/linux-commands#pdf" target="_blank" rel="noopener noreferrer">Linus Commands</a> (same as bash commands)
                                        </h5>
                                        <h5>
                                            <a href="https://explainshell.com/" target="_blank" rel="noopener noreferrer">Explain Shell</a> (breakdown each command)
                                        </h5>
                                    </section>
                                </article>
                            </article>
                            <section className='blog-categories'>
                                <h6>Categories</h6>
                                {tags.map(tag => {
                                    return (<a href="/" className="main-tag-article">{tag}</a>
                                    )
                                })}

                            </section>
                        </div>
                    </article>

                </main>
                <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
                <Footer />
            </div >
        )
    }
}
export default Bash;