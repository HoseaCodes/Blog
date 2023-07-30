import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import '../Articles.css'
import moment from 'moment-timezone'
import SideBar from '../../../Components/NavBar/SideBar';
import RightColumn from '../../../Components/Article/RightColumn';
import MainContainer from '../../../Components/Article/MainContainer';

const ArticleItem = () => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [user] = state.userAPI.user;
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

    const { createdAt, markdown } = detailArticle;

    const timeFormater = moment.utc(createdAt).format('MMMM Do YYYY')
    const avgWordsMinRead = 238
    const wordCount = markdown.length + 700
    const readTime = Math.round(wordCount / avgWordsMinRead)
    return (
        <>
          <main className="blog-content">
            {
                user.name !== "" && 
                <SideBar/>
            }
            <MainContainer user={user} articles={articles} timeFormater={timeFormater} readTime={readTime} detailArticle={detailArticle} />
            <RightColumn user={user} articles={articles}/>
          </main>
        </>
    )
}

export default ArticleItem;
