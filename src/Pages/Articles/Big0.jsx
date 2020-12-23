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
            article: articleData[1],

        }
    }


    render() {
        function handleCount() {
            this.state({
                count: this.state.count + 1
            });
        }


        const { name, date, info, title, img, tags, lists, lists2, subHeading, link } = this.state.article;
        return (
            <div>
                <NavBar2 />
                <main class="blog-content">
                    <article className='blog-main'>
                        <h2 style={{ marginTop: '5rem', fontSize: '3rem', fontWeight: '600' }}>{name}</h2>
                        <hr style={{ background: 'rgb(235,183,65)', width: '100vw' }} />
                        <p style={{ marginTop: '2rem' }}>Hosea Codes Blog</p>
                        <div className='blog-combo'>
                            <article>
                                <h3 className='blog-title'>{title}</h3>
                                <img className='blog-img' src="https://i.imgur.com/ryddD6l.png" alt={name} />
                                <article className='blog-card'>
                                    <section className="blog-heading">
                                        <br />
                                        <h6 className="blog-feature">Featured</h6>
                                        <h2>{name}</h2>
                                        <section className='blog-icon'>
                                            <PermIdentityIcon /> <span> By Dominique Hosea</span>
                                    &nbsp;&nbsp;
                                    <EventNoteIcon /> <span> {date}</span>
                                            {/* &nbsp;&nbsp;
                                    <MessageIcon /> <span> 5</span>
                                    &nbsp;&nbsp;
                                    <ThumbUpIcon /> <span>12 k</span> */}
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
                                            <img id="cheatsheet" src="https://i.imgur.com/OxrRto8.png" alt="cheatsheet" />
                                            <div>
                                                <h3 style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold' }} className='blog-subtitle'>{subHeading[1]}</h3>
                                                <p style={{ marginLeft: '1rem', }} className='blog-content-info'>{info[1]} </p>
                                            </div>
                                        </div>
                                        <br />
                                        <p style={{ marginRight: '1rem', textAlign: 'justify' }} className='blog-content-info'>{info[2]}</p>
                                        <h3 className='blog-subtitle'>{subHeading[2]}</h3>
                                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                            <div>
                                                {lists.map(list => {
                                                    return (
                                                        <li style={{ listStyle: "none", marginLeft: "1rem" }} className='blog-content-info'>{list}</li>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <br />
                                        <h3 className='blog-subtitle'>{subHeading[3]}</h3>
                                        <p className='blog-content-info'>{info[3]}</p>
                                        <h3 className='blog-subtitle'>{subHeading[4]}</h3>
                                        <p className='blog-content-info'>{info[4]}</p>
                                        <div>
                                            {lists2.map(list => {
                                                return (
                                                    <li style={{ listStyle: "none" }} className='blog-content-info'>{list}</li>
                                                )
                                            })}
                                        </div>
                                    </section>
                                    <section>
                                        <h4 className='blog-subtitle'>Reference Guide</h4>
                                        <h5>
                                            <a href="https://www.geeksforgeeks.org/analysis-algorithms-big-o-analysis/" target="_blank" rel="noopener noreferrer">GeeksforGeeks</a>
                                        </h5>
                                        <h5>
                                            <a href="https://www.freecodecamp.org/news/big-o-notation-explained-with-examples/" target="_blank" rel="noopener noreferrer">Freecodecamp</a>
                                        </h5>
                                        <h5>
                                            <a href="https://web.mit.edu/16.070/www/lecture/big_o.pdf" target="_blank" rel="noopener noreferrer">MIT</a>
                                        </h5>
                                    </section>
                                </article>
                            </article>
                            <section className='blog-categories'>
                                <h6>Categories</h6>
                                {tags.map(tag => {
                                    return (<a href="#" className="main-tag-article">{tag}</a>
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