import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import '../Articles.css'
import moment from 'moment-timezone'
import SideBar from '../../../Components/NavBar/SideBar';
import RightColumn from '../../../Components/Article/RightColumn';
import MainContainer from '../../../Components/Article/MainContainer';
import axios from 'axios';

const ArticleItem = () => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [isLoggedIn] = state.userAPI.isLoggedIn;
    const [isAdmin] = state.userAPI.isAdmin;
    const [user] = state.userAPI.user;
    const [articles] = state.articlesAPI.articles
    const [callback, setCallback] = state.articlesAPI.callback
    const [detailArticle, setdetailArticle] = useState([])
    const [viewComment, setViewComment] = useState(false)

    const deleteArticle = async (id, public_id) => {
        try {
            const destroyImg = axios.post('/api/destory', { public_id });
            const deleteArticle = axios.delete(`/api/articles/${id}`);
            await destroyImg;
            await deleteArticle;
            setCallback(!callback);
        } catch (err) {
            alert(err.response?.data?.msg || 'Error deleting article');
        }
    }

    const handleCheck = async (id) => {
        try {
            await axios.patch(`/api/articles/${id}`, { checked: true });
            setCallback(!callback);
        } catch (err) {
            alert(err.response?.data?.msg || 'Error updating article');
        }
    }

    useEffect(() => {
        if (params.id) {
            articles.forEach(article => {
                if (article._id === params.id) setdetailArticle(article)
            })
        }
      // );
    // }
  }, [params.id]);

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
                <SideBar user={user} article={detailArticle} className='d-none d-lg-block'/>
            }
            <MainContainer isAdmin={isAdmin} isLoggedIn={isLoggedIn} viewComment={viewComment} setViewComment={setViewComment}  user={user} articles={articles} 
            timeFormater={timeFormater} readTime={readTime} detailArticle={detailArticle} deleteArticle={deleteArticle} handleCheck={handleCheck} />
            <RightColumn setViewComment={setViewComment} viewComment={viewComment} user={user} articles={articles}/>
          </main>
        </>
    )
}

export default ArticleItem;
