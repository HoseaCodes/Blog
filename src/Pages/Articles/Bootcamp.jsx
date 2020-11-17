import React, { Component } from 'react'
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import EventNoteIcon from '@material-ui/icons/EventNote';
import MessageIcon from '@material-ui/icons/Message';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { articleData } from './ArticleData';
import StackResults from '../../icons/StackResults.png'
import Stackimg from '../../icons/Stackimg.png';
import NavBar2 from '../../Components/NavBar/NavBar2'
import './Blog.css'
import { styled } from '@material-ui/core';
import Subscribe from '../../Components/Subscribe/Subscribe';
import Footer from '../../Components/Footer/Footer';

class Bootcamp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            article: articleData[0],

        }
    }


    render() {
        function handleCount() {
            this.state({
                count: this.state.count + 1
            });
        }



        const { name, date, info, title, img, tags, subHeading, link } = this.state.article;
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
                                <img className='blog-img' src={img} alt={name} />
                                <article className='blog-card'>
                                    <section className="blog-heading">
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
                                        <h3 className='blog-title'>{title}</h3>
                                        <br />
                                        <h3>{subHeading[0]}</h3>
                                        <p>{info[0]}</p>
                                        <h3>{subHeading[1]}</h3>
                                        <p>{info[1]}</p>
                                        <h3>{subHeading[2]}</h3>
                                        <p>{info[2]}</p>
                                        <h3>{subHeading[3]}</h3>
                                        <p>{info[3]}</p>
                                        <h3>{subHeading[4]}</h3>
                                        <p>{info[4]}</p>
                                        <h3>{subHeading[5]}</h3>
                                        <p>{info[5]}</p>
                                        <h3>{subHeading[6]}</h3>
                                        <p>{info[6]}</p>
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
export default Bootcamp;