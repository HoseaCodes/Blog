import React, { useState, useContext, useEffect } from "react";
import "./Articles.css";
import { GlobalState } from "../../GlobalState";
import SkeletonBlog from '../../Components/Skeleton/skeletonBlog';
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { truncate } from "../../Utils/helperFunctions";
import { projectData } from '../Projects/ProjectsData';
import faqs from "../../constants/faq";
import ThemeSwitcher from "./ThemeSwitcher";

const TechGuide = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [desktopView, setDesktopView] = useState(false);
  const [email, setEmail] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleFAQ = (index) => {
    console.log(`Before toggle: activeIndex=${activeIndex}, clicked index=${index}`);
    // Force state update with a completely new value rather than comparing
    setActiveIndex(prevIndex => prevIndex === index ? null : index);
    console.log(`Set new activeIndex to: ${index === activeIndex ? 'null' : index}`);
  };
  
  
  // State from Articles component
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [isAdmin] = state.userAPI.isAdmin;
  const [articles] = state.articlesAPI.articles;
  const [callback, setCallback] = state.articlesAPI.callback;
  const [loading, setLoading] = useState(false);
  const [tagsShow, setTagsShow] = useState("All");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  // Data preparation from Articles component
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const cleanArticles = articles.filter(
    (article) => article.draft === false && article.archived === false
  );

  const mainPosts = cleanArticles.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const archivedPosts = [];

  mainPosts.map(article => {
    if (article.archived) {
      archivedPosts.push(article);
      mainPosts.pop(article);
    }
    return null;
  });

  const currentPosts = mainPosts.slice(indexOfFirstPost, indexOfLastPost);
  const shuffleArray = arr => arr.sort(() => 0.5 - Math.random());
  const postsAfterEight = mainPosts.slice(8, 12);
  const popularPosts = shuffleArray([...postsAfterEight])
    // .filter(article => !currentPosts.includes(article))

  // Pagination functions
  const paginate = pageNum => setCurrentPage(pageNum);

  const nextPage = () => {
    if (currentPage > articles.length) return;
    setSearch("");
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage < 1) return;
    setSearch("");
    setCurrentPage(currentPage - 1);
  };

  // Article management functions
  const deleteArticle = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post("/api/destory", { public_id });
      const deleteArticle = axios.delete(`/api/articles/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImg;
      await deleteArticle;
      setLoading(false);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const archiveArticle = async (id, archived) => {
    try {
      const archive = !archived;
      setLoading(true);
      const archiveArticle = axios.patch(`/api/articles/${id}`,
        { archive },
        {
          headers: { Authorization: token },
        });
      await archiveArticle;
      setLoading(false);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleCheck = async (id) => {
    const updatedArticles = articles.map(article => {
      if (article._id === id) return { ...article, checked: !article.checked };
      return article;
    });
    // Assuming there's a setArticles function
    // setArticles(updatedArticles);
  };

  // Search and filter functions
  const filteredArticles = currentPosts.filter(article => {
    return article.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
  });

  const updateSearch = (event) => {
    const { value } = event.target;
    setSearch(value.substr(0, 20));
  };

  const updateItemsShow = (str) => {
    setTagsShow(str);
    setStatus("active");
  };

  let taggedArticles = [];
  if (tagsShow === "All") {
    taggedArticles = filteredArticles;
  } else if (tagsShow === "JavaScript") {
    taggedArticles = filteredArticles.filter((item) =>
      item.category.includes("JavaScript")
    );
  } else if (tagsShow === "Python") {
    taggedArticles = filteredArticles.filter((item) =>
      item.category.includes("Python")
    );
  } else if (tagsShow === "Software Engineer") {
    taggedArticles = filteredArticles.filter((item) =>
      item.category.includes("Software Engineer")
    );
  }

  // Handle subscribe form
  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log(`Subscribed with ${email}`);
    setEmail("");
  };

  // Load this effect on mount (simulate data loading)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Handle responsive design
  useEffect(() => {
    const onresize = () => {
      if (window.screen.width > 600) {
        setIsMobileView(false);
        setDesktopView(true);
      } else {
        setIsMobileView(true);
        setDesktopView(false);
      }
    };
    window.addEventListener("resize", onresize);
    onresize();

    return () => {
      window.removeEventListener("resize", onresize);
    };
  }, []);

  return (
    <div className="tech-guide">
      <ThemeSwitcher />
      <section className="hero-container">
        <div className="hero-bg-image" data-aos="fade"></div>
        <div className="hero-bg-overlay"></div>      
        <div className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text" data-aos="fade-right" data-aos-delay="200">
              <h1>Welcome to<br />HoseaCodes<br />Tech Guide</h1>
              <p>Get the latest news on your favourite mangas, anime and manhwa around the world!</p>
              
              <form className="subscribe-form" onSubmit={handleSubscribe} action="https://getform.io/f/7efda21f-ca67-48f6-8a1e-723776d4ae3b" method='POST'>
                <button type="submit" className="subscribe-btn">SUBSCRIBE</button>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </form>
            </div>
            
            <div className="hero-image-container" data-aos="fade-left" data-aos-delay="400">
              <div className="hero-image-slant">
                <img 
                  src="https://miro.medium.com/v2/resize:fit:1400/1*I_v3Mu-llbqCXR-VmXmy7w.jpeg" 
                  alt="Anime Character" 
                  className="hero-character-img"
                />
              </div>
            </div>
          </div>
          
          <div className="quick-links" data-aos="fade-up" data-aos-delay="600">
            <a href="#" onClick={() => updateItemsShow("JavaScript")}>JavaScript</a>
            <a href="#" onClick={() => updateItemsShow("Python")}>Python</a>
            <a href="#" onClick={() => updateItemsShow("React")}>React</a>
            <a href="#" onClick={() => updateItemsShow("Node.js")}>Node.js</a>
            <a href="#" onClick={() => updateItemsShow("TypeScript")}>TypeScript</a>
          </div>
        </div>
      </section>
      
      {/* New & Trendy Section */}
      <section className="trendy-section" data-aos="fade-up">
        <h2 className="section-heading" data-aos="fade-right">
          New & Trendy
        </h2>
        <hr data-aos="fade" data-aos-delay="100" />
        <div className="trendy-grid">          
          <div className="trendy-image-container" data-aos="zoom-in" data-aos-delay="200">
            <img
              src="https://d2nrcsymqn25pk.cloudfront.net/Assets/BG/anatomy-1751201_1280.png"
              alt="Zoro"
              className="trendy-image"
            />
          </div>
          {loading ? (
            <div className="trendy-article-container">
              <SkeletonBlog type="trendy" />
            </div>
          ) : (
            <div className="trendy-article-container" data-aos="fade-left" data-aos-delay="300">    
              {currentPosts.slice(0, 1).map(article => (
                <div key={article.id} className="trendy-article" 
                  style={{
                    backgroundImage: 'url("https://d2nrcsymqn25pk.cloudfront.net/Assets/BG/ambitiousconcepts_Design_a_professional_website_background_with_c19abf7a-5e1d-4eda-8de5-ba89de1ee4ba.png")'
                  }}>
                  <div className="trendy-article-overlay"></div>
                  <div className="trendy-article-content">
                    <div className="trendy-article-meta">
                      <span>{article.category ? article.category[0] : 'Technology'}</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="trendy-article-title">{article.title}</h3>
                    <p className="trendy-article-desc">
                      {truncate(article.description || article.content, 150)}
                    </p>
                    <div className="trendy-article-footer">
                      <span>12 Min Read</span>
                      <a href={`/blog/${article._id}`} className="read-more-link">
                        Read Full →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Second Article */}
          {loading ? (
            <div className="trendy-article-container">
              <SkeletonBlog type="trendy" />
            </div>
          ) : (
            <div className="trendy-article-container" data-aos="fade-right" data-aos-delay="400">    
              {currentPosts.slice(1, 2).map(article => (
                <div key={article.id} className="trendy-article"
                  style={{
                    backgroundImage: 'url("https://d2nrcsymqn25pk.cloudfront.net/Assets/BG/ambitiousconcepts_Design_a_professional_website_background_with_16b4be9c-5862-4df1-8aa0-8ea41836f8a8.png")'
                  }}>
                  <div className="trendy-article-overlay"></div>
                  <div className="trendy-article-content">
                    <div className="trendy-article-meta">
                      <span>{article.category ? article.category[0] : 'Technology'}</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="trendy-article-title">{article.title}</h3>
                    <p className="trendy-article-desc">
                      {truncate(article.description || article.content, 150)}
                    </p>
                    <div className="trendy-article-footer">
                      <span>12 Min Read</span>
                      <a href={`/blog/${article._id}`} className="read-more-link">
                        Read Full →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}          
          <div className="trendy-image-container" data-aos="zoom-in" data-aos-delay="500">
            <img
              src="https://d2nrcsymqn25pk.cloudfront.net/Assets/BG/wallpapersden.com_naruto-uzumaki-minimalist_4098x2304-removebg-preview.png"
              alt="Naruto"
              className="trendy-image large"
            />
          </div>
        </div>
      </section>

      {/* Now Trending Section - Using actual data */}
      <section className="now-trending-section" data-aos="fade-up">
        <h2 className="section-heading" data-aos="fade-right">Now Trending</h2>
        <hr className="section-divider" data-aos="fade" data-aos-delay="100" />

        <div className="trending-grid">
          {loading ? (
            <>
              <SkeletonBlog type="trending" />
              <SkeletonBlog type="trending" />
              <SkeletonBlog type="trending" />
            </>
          ) : (
            currentPosts.slice(0, 3).map((article, i) => (
              <div key={article.id} className="trending-card" 
                   data-aos="fade-up" 
                   data-aos-delay={200 + i * 100}>
                <div className="trending-image placeholder"
                  style={{
                    backgroundImage: article.images ? `url(${article.images.secure_url})` : ''
                  }}>
                  {!article.images && '1280 x 720'}
                </div>
                <div className="trending-meta">
                  <span>{article.category ? article.category[0] : 'Technology'}</span>
                  <span>· {new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="trending-title">{article.title}</h3>
                <p className="trending-desc">
                  {truncate(article.description || article.content, 100)}
                </p>
                <div className="trending-footer">
                  <span>12 Min Read</span>
                  <a href={`/blog/${article._id}`} className="read-more-link">
                    Read Full →
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Case Studies - Using actual data */}
        <h3 className="subsection-heading" data-aos="fade-right">Case Studies</h3>
        <hr className="section-divider" data-aos="fade" data-aos-delay="100" />

        <div className="case-studies-grid">
          {loading ? (
            <>
              <SkeletonBlog type="case-study" />
              <SkeletonBlog type="case-study" />
            </>
          ) : (
            projectData.slice(0, 2).map((article, i) => (
              <div key={article.id} className="case-study-card" 
                   data-aos="fade-up" 
                   data-aos-delay={200 + i * 100}>
                <div className="case-study-image placeholder"
                  style={{
                    backgroundImage: article.headerImg ? `url(${article.headerImg})` : ''
                  }}>
                  {!article.headerImg && '1280 x 720'}
                </div>
                <div className="case-study-content">
                  <h4 className="case-study-title">{article.name}</h4>
                  <p className="case-study-desc">
                    {truncate(article.background || article.objectives, 80)}
                  </p>
                  <div className="case-study-footer">
                    <a href={`/project/${article.id}`} className="read-more-link">
                      Read Full →
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      
      {/* Blog Section - Integrating article data and filtering from Article.js */}
      <section className="blog-section" data-aos="fade-up">
        <h2 data-aos="fade-right">Blog</h2>
        
        <div className="blog-tags" data-aos="fade-up" data-aos-delay="100">
          <button 
            className={tagsShow === "All" ? "tag active" : "tag"}
            onClick={() => updateItemsShow("All")}
          >all</button>
          <button 
            className={tagsShow === "JavaScript" ? "tag active" : "tag"}
            onClick={() => updateItemsShow("JavaScript")}
          >javascript</button>
          <button 
            className={tagsShow === "Python" ? "tag active" : "tag"}
            onClick={() => updateItemsShow("Python")}
          >python</button>
          <button 
            className={tagsShow === "React" ? "tag active" : "tag"}
            onClick={() => updateItemsShow("React")}
          >react</button>
          <button 
            className={tagsShow === "Software Engineer" ? "tag active" : "tag"}
            onClick={() => updateItemsShow("Software Engineer")}
          >software engineer</button>
        </div>
        
        {loading ? (
          <div className="blog-grid">
            <SkeletonBlog />
            <div className="blog-list">
              <SkeletonBlog type="trending"/>
              <SkeletonBlog type="trending" />
            </div>
            <div className="popular-posts">
              <SkeletonBlog />
            </div>
          </div>
        ) : (
          <div className="blog-grid">
            {taggedArticles.length > 0 && (
              <div className="main-blog-card" data-aos="fade-right" data-aos-delay="200">
                <div 
                  className="blog-image placeholder"
                  style={{
                    backgroundImage: taggedArticles[0].images ? `url(${taggedArticles[0].images.secure_url})` : ''
                  }}
                >
                  {!taggedArticles[0].images && 'Featured Image'}
                </div>
                <div className="blog-overlay">
                  <h3>{taggedArticles[0].title}</h3>
                  <p>{truncate(taggedArticles[0].description || taggedArticles[0].content, 120)}</p>
                  <div className="blog-meta">
                    <a href={`/blog/${taggedArticles[0]._id}`}>continue reading...</a>
                  </div>
                </div>
              </div>
            )}
            <div className="blog-list">
              {mainPosts.slice(3, 6).map((article, i) => (
                <div key={article._id} className="blog-list-item" 
                  data-aos="fade-up" 
                  data-aos-delay={300 + i * 100}
                  onClick={() => {
                    window.location.href = `/blog/${article._id}`;
                  }}
                >
                  <div 
                    className="blog-image small placeholder"
                    style={{
                      backgroundImage: article.images ? `url(${article.images.secure_url})` : ''
                    }}
                  >
                    {!article.images && 'Image'}
                  </div>
                  <div className="blog-info">
                    <h4>{article.title}</h4>
                    <p>{article.category ? article.category.join(', ') : 'Technology'}</p>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Popular Posts */}
            <div className="popular-posts" data-aos="fade-left" data-aos-delay="200">
              <h3>Popular reads</h3>
              
              <div className="popular-post-list">
                {popularPosts.slice(0, 3).map((article, i) => (
                  <div key={article._id} className="popular-post" 
                    data-aos="fade-up" 
                    data-aos-delay={400 + i * 100}
                    onClick={() => {
                      window.location.href = `/blog/${article._id}`;
                    }}
                  >
                    <div 
                      className="popular-post-image placeholder"
                      style={{
                        backgroundImage: article.images ? `url(${article.images.secure_url})` : ''
                      }}
                    >
                      {!article.images && 'Image'}
                    </div>
                    <div className="popular-post-info">
                      <h4>{article.title}</h4>
                      <p>{article.category ? article.category.join(', ') : 'Technology'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>
      
      {/* FAQ Section - remained the same */}
      <section className="faq-section" data-aos="fade-up">
        <div className="faq-container">
          <div className="faq-header" data-aos="fade-down">
            <h2>FREQUENTLY</h2>
            <h2>ASK <span className="highlight">QUESTIONS</span></h2>
          </div>
          
          <div className="faq-content">
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                  data-aos="fade-right"
                  data-aos-delay={100 * index}
                >
                  <div className="faq-question">
                    <span className="faq-number">{(index + 1) < 10 ? `0${index + 1}` : index + 1}</span>
                    <h3>{faq.question}</h3>
                    <button 
                      className="faq-toggle"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFAQ(index);
                      }}
                    >
                      <span className={activeIndex === index ? "minus" : "plus"}>
                        {activeIndex === index ? "−" : "+"}
                      </span>
                    </button>
                  </div>
                  {activeIndex === index && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="faq-image" data-aos="fade-left" data-aos-delay="300">
              <img
                src="https://d2nrcsymqn25pk.cloudfront.net/Assets/BG/quul6g5vkxb11.webp"
                alt="Anime Character"
                className="anime-character-img"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechGuide;