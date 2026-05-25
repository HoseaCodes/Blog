import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import styled from 'styled-components';
import { GlobalState } from '../../../GlobalState';
import moment from 'moment-timezone';
import axios from 'axios';
import SideBar from '../../../Components/NavBar/SideBar';
import MainContainer from '../../../Components/Article/MainContainer';
import RightColumn from '../../../Components/Article/RightColumn';

const SITE_URL = 'https://hoseacodes.com';
const DEFAULT_OG_IMAGE = 'https://hoseacodes.com/logo.png';

const stripMarkdown = (md = '') =>
  md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const buildDescription = (article) => {
  if (article.description) return article.description.slice(0, 160);
  if (article.subtitle) return article.subtitle.slice(0, 160);
  return stripMarkdown(article.markdown).slice(0, 160);
};

// =============================================
// MEDIUM DESIGN TOKENS
// =============================================
const mediumTheme = {
  colors: {
    background: {
      white: '#0f1216'
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
  overflow-x: hidden;
`;

const BlogContent = styled.main`
  display: flex;
  gap: 0;
  width: 100%;
  min-height: 100vh;

  @media (max-width: ${mediumTheme.breakpoints.tablet}) {
    flex-direction: column;
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
    if (!params.id) return;

    let cancelled = false;

    const foundArticle = articles.find(article => article._id === params.id);
    if (foundArticle) {
      setDetailArticle(foundArticle);
      return;
    }

    const fetchArticle = async () => {
      try {
        const response = await axios.get(`/api/articles/${params.id}`);
        if (!cancelled) setDetailArticle(response.data.article);
      } catch (err) {
        if (!cancelled) console.error('Error fetching article:', err);
      }
    };
    fetchArticle();

    return () => {
      cancelled = true;
    };
  }, [params.id, articles]);

  if (!detailArticle._id) return null;

  const { createdAt, markdown } = detailArticle;
  const timeFormater = moment.utc(createdAt).format('MMMM Do, YYYY');
  const avgWordsMinRead = 238;
  const wordCount = (markdown?.length || 0) + 700;
  const readTime = Math.round(wordCount / avgWordsMinRead);

  const canonicalSlug = detailArticle.slug || detailArticle._id;
  const canonicalUrl = `${SITE_URL}/blog/${canonicalSlug}`;
  const pageTitle = `${detailArticle.title} | Hosea Codes`;
  const pageDescription = buildDescription(detailArticle);
  const ogImage = detailArticle.images?.secure_url || detailArticle.images?.url || DEFAULT_OG_IMAGE;
  const tags = Array.isArray(detailArticle.tags) ? detailArticle.tags : [];
  const categories = Array.isArray(detailArticle.categories) ? detailArticle.categories : [];
  const keywords = [...tags, ...categories].join(', ');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    headline: detailArticle.title,
    description: pageDescription,
    image: ogImage,
    datePublished: detailArticle.createdAt,
    dateModified: detailArticle.updatedAt || detailArticle.createdAt,
    author: { '@type': 'Person', name: 'Dominique Hosea', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: 'Hosea Codes',
      logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    },
    keywords: keywords || undefined,
  };

  return (
    <ArticlePageContainer>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        {keywords && <meta name="keywords" content={keywords} />}
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={detailArticle.title} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="Hosea Codes" />
        <meta property="article:published_time" content={detailArticle.createdAt} />
        {detailArticle.updatedAt && (
          <meta property="article:modified_time" content={detailArticle.updatedAt} />
        )}
        {tags.map((tag) => (
          <meta key={`tag-${tag}`} property="article:tag" content={tag} />
        ))}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={detailArticle.title} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
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