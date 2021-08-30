import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import '../Articles.css'
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import EventNoteIcon from '@material-ui/icons/EventNote';
import NavBar from '../../../Components/NavBar/NavBar';
import Footer from '../../../Components/Footer/Footer';
import marked from 'marked';
import moment from 'moment-timezone'

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
    
    const timeFormater = moment.utc(createdAt).format('MM/YYYY')

    return (
        <>
            <NavBar/>
            <main className="blog-content">
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
                                        <EventNoteIcon /> <span> {timeFormater}</span>
                                        &nbsp;&nbsp;
                                    </section>
                                </section>
                                <br />
                                <section className='blog-post'>
                                    <br />
                                    <p className='blog-content-info'>{description}</p>
                                    <br />     
                                    <br />
                                    <p className='blog-content-info'  dangerouslySetInnerHTML={{ __html: marked(markdown) }}></p>
                                    <br />
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