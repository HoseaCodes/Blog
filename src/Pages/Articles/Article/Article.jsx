import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalState } from '../../../GlobalState';
import moment from 'moment-timezone';
import axios from 'axios';
import SideBar from '../../../Components/NavBar/SideBar';
import MainContainer from '../../../Components/Article/MainContainer';
import RightColumn from '../../../Components/Article/RightColumn';

// =============================================
// MEDIUM DESIGN TOKENS
// =============================================
const mediumTheme = {
  colors: {
    background: {
      white: '#ffffff'
    }
  },
  breakpoints: {
    tablet: '1024px'
  }
};

// =============================================
// LAYOUT COMPONENTS
// =============================================
const ArticlePageContainer = styled.div`
  min-height: 100vh;
  background-color: ${mediumTheme.colors.background.white};
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
`;

const BlogContent = styled.main`
  position: absolute;
  max-height: 100%;
  overflow: auto;
  display: flex;
  gap: 0;
  width: 100%;
  min-height: 100vh;

  @media (max-width: ${mediumTheme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    max-width: 740px;
    margin: 0 auto;
    padding: 0 24px;
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

// =============================================
// MAIN COMPONENT
// =============================================
const ArticleItem = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [isAdmin] = state.userAPI.isAdmin;
  const [user] = state.userAPI.user;
  const [articles] = state.articlesAPI.articles;
  const [callback, setCallback] = state.articlesAPI.callback;
  const [token] = state.token;
  
  const [detailArticle, setDetailArticle] = useState({});
  const [viewComment, setViewComment] = useState(false);

  // Article management functions
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
  };

  const handleCheck = async (id) => {
    try {
      await axios.patch(`/api/articles/${id}`, { checked: true });
      setCallback(!callback);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error updating article');
    }
  };

  // Load article data
  useEffect(() => {
    if (params.id) {
      const foundArticle = articles.find(article => article._id === params.id);
      if (foundArticle) {
        setDetailArticle(foundArticle);
      } else {
        const fetchArticle = async () => {
          try {
            const response = await axios.get(`/api/articles/${params.id}`);
            setDetailArticle(response.data.article);
          } catch (err) {
            console.error('Error fetching article:', err);
          }
        };
        fetchArticle();
      }
    }
  }, [params.id, articles]);

  if (!detailArticle._id) return null;

  const { createdAt, markdown } = detailArticle;
  const timeFormater = moment.utc(createdAt).format('MMMM Do, YYYY');
  const avgWordsMinRead = 238;
  const wordCount = (markdown?.length || 0) + 700;
  const readTime = Math.round(wordCount / avgWordsMinRead);

  return (
    <ArticlePageContainer>
      <BlogContent>
        {/* Left Sidebar - Only show if user is logged in */}
        {user.name && (
          <SideBar 
            user={user} 
            article={detailArticle} 
          />
        )}

        {/* Main Content */}
        <MainContainer 
          detailArticle={detailArticle}
          user={user}
          articles={articles}
          timeFormater={timeFormater}
          readTime={readTime}
          viewComment={viewComment}
          setViewComment={setViewComment}
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
          deleteArticle={deleteArticle}
          handleCheck={handleCheck}
        />

        {/* Right Sidebar */}
        <RightColumn 
          user={user}
          articles={articles}
          viewComment={viewComment}
          setViewComment={setViewComment}
        />
      </BlogContent>
    </ArticlePageContainer>
  );
};

export default ArticleItem;