import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import '../Blog.css'
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import EventNoteIcon from '@material-ui/icons/EventNote';
import NavBar2 from '../../../Components/NavBar/NavBar2';
import Footer from '../../../Components/Footer/Footer';

const ArticleItem = (props) => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [articles] = state.articlesAPI.articles
    const [detailArticle, setdetailArticle] = useState([])

    useEffect(() => {
        if (params.id) {
            articles.forEach(article => {
                if (article._id === params.id) setdetailArticle(article)
            })
        }
    }, [params.id, articles])

    if (detailArticle.length === 0) return null;

    const { title, subtitle, createdAt, description, images, markdown } = detailArticle;
    console.log(props)

    return (
        <>
            <NavBar2/>
            <main class="blog-content">
                <article className='blog-main'>
                    <h2 style={{ marginTop: '5rem', fontSize: '3rem', fontWeight: '600' }}>{subtitle}</h2>
                    <hr style={{ background: 'rgb(235,183,65)', width: '100vw' }} />
                    <p style={{ marginTop: '2rem' }}>Hosea Codes Blog</p>
                    <div className='blog-combo'>
                        <section>
                            <h3 className='blog-title'>{title}</h3>
                            <img className='blog-img' src={images.url} alt={title}  />
                            <section className='blog-card'>
                                <section className="blog-heading">
                                    <br />
                                    <h6 className="blog-feature">Featured</h6>
                                    <h2>{subtitle}</h2>
                                    <section className='blog-icon'>
                                        <PermIdentityIcon /> <span> By Dominique Hosea</span>
                                        &nbsp;&nbsp;
                                        <EventNoteIcon /> <span> {createdAt}</span>
                                        &nbsp;&nbsp;
                                    </section>
                                </section>
                                <br />
                                <section className='blog-post'>
                                    <br />
                                    <p className='blog-content-info'>{description}</p>
                                    <br />     
                                    <br />
                                    <p className='blog-content-info'>{markdown}</p>
                                    <br />
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
                                {/* <input type="checkbox" checked={checked}
                                    onChange={() => props.handleCheck(_id)} /> */}
                                    {/* <BtnRender article={props.article} deleteArticle={props.deleteArticle} /> */}
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

export default ArticleItem;