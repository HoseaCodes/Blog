import React, { useState, useContext, useEffect } from "react";
import "./Articles.css";
import Subscribe from "../../Components/Subscribe/Subscribe";
import ArticleCard from "./ArticleCard";
import { GlobalState } from "../../GlobalState";
// import Loading from '../../Loading';
import SkeletonBlog from '../../Components/Skeleton/skeletonBlog';
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import Pagination from "../../Components/Pagination/pagination";
import { StyledHr } from "../../Layout/Hr/styledHr";
import { truncate } from "../../Utils/helperFunctions";

const Articles = () => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [desktopView, setDesktopView] = useState(false);
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [isAdmin] = state.userAPI.isAdmin;
  const [articles] = state.articlesAPI.articles;
  // const [token] = state.token
  const [callback, setCallback] = state.articlesAPI.callback;
  const [loading, setLoading] = useState(false);
  const [tagsShow, setTagsShow] = useState("All");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(3);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const cleanArticles = articles.filter(article => article.draft === false && article.archived === false);

  const mainPosts = cleanArticles.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const currentPosts = mainPosts.slice(indexOfFirstPost, indexOfLastPost);
  const shuffleArray = arr => arr.sort(() => 0.5 - Math.random());
  const popularPosts = shuffleArray(mainPosts)
    .filter(article => article !== currentPosts)
    .slice(0, 5);

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

  const deleteArticle = async (id, public_id) => {
    try {
      setLoading(true);
      const destroyImg = axios.post("/api/destory", { public_id });
      const deleteArticle = axios.delete(`/api/articles/${id}`);
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
      const archiveArticle = axios.patch(`/api/articles/${id}`, { archive });
      await archiveArticle;
      setLoading(false);
      setCallback(!callback);
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  const handleCheck = async (id) => {
      articles.forEach(article => {
          if (article._id === id) article.checked = !article.checked
      })
      setArticles([...articles])
  }

  const filteredArticles = currentPosts.filter(article => {
    return article.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
  });

  const updateSearch = event => {
    const { value } = event.target;
    setSearch(value.substr(0, 20));
  };

  const updateItemsShow = str => {
    setTagsShow(str);
    setStatus("active");
  };

  let taggedArticles = [];
  if (tagsShow === "All") {
    taggedArticles = filteredArticles;
  } else if (tagsShow === "JavaScript") {
    taggedArticles = filteredArticles.filter(item =>
      item.category.includes("JavaScript")
    );
  } else if (tagsShow === "Python") {
    taggedArticles = filteredArticles.filter(item =>
      item.category.includes("Python")
    );
  } else if (tagsShow === "Software Engineer") {
    taggedArticles = filteredArticles.filter(item =>
      item.category.includes("Software Engineer")
    );
  }
  console.log(popularPosts);

  // Load this effect on mount
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    // Cancel the timer while unmounting
    return () => clearTimeout(timer);
  }, []);

  // if (loading) return <div className="products"><Loading /></div>

  useEffect(() => {
    const onresize = () => {
      if (window.screen.width > 600) {
        setIsMobileView(false);
        setDesktopView(true);
      }
    };
    window.addEventListener("resize", onresize);
    onresize();

    return () => {
      window.removeEventListener("resize", onresize);
    };
  }, []);

  return (
    <>
      <div className="article-container">
        <div className="article-header">
          <div className="artcile-header-logo"></div>
        </div>
        <StyledHr Primary />
        <div id="articles">
          <h3 className="articles-header">
            Thoughts of a Wise Mind
            <hr />
          </h3>
          <p style={{ fontSize: "1.5rem", color: "lightgray" }}>
            Here are some of my articles you may like.
          </p>
          <input
            type="text"
            className="article-search"
            label="Search Articles"
            placeholder="Find a Post"
            value={search}
            onChange={updateSearch}
          />
          <div className="article-box">
            {/* <!--───────────────Tabs───────────────--> */}

            <section id="tabs">
              <div className="row">
                <div className="col">
                  <nav>
                    <div
                      className="nav nav-tabs nav-fill blog-tabs"
                      id="nav-tab"
                      role="tablist"
                    >
                      <a
                        id="nav-all-tab"
                        data-toggle="tab"
                        href="#nav-all"
                        role="tab"
                        aria-controls="nav-all"
                        aria-selected="true"
                        onClick={() => updateItemsShow("All")}
                        className={status ? "tab-active" : "nav-item nav-link"}
                      >
                        All
                      </a>
                      <a
                        id="nav-javascript-tab"
                        data-toggle="tab"
                        href="#nav-javascript"
                        role="tab"
                        aria-controls="nav-javascript"
                        aria-selected="false"
                        onClick={() => updateItemsShow("JavaScript")}
                        className={status ? "tab-active" : "nav-item nav-link"}
                      >
                        JavaScript
                      </a>
                      <a
                        id="nav-python-tab"
                        data-toggle="tab"
                        href="#nav-python"
                        role="tab"
                        aria-controls="nav-python"
                        aria-selected="false"
                        onClick={() => updateItemsShow("Python")}
                        className={status ? "tab-active" : "nav-item nav-link"}
                      >
                        Python
                      </a>
                      <a
                        id="nav-softwareengineer-tab"
                        data-toggle="tab"
                        href="#nav-softwareengineer"
                        role="tab"
                        aria-controls="nav-softwareengineer"
                        aria-selected="false"
                        onClick={() => updateItemsShow("Software Engineer")}
                        className={status ? "tab-active" : "nav-item nav-link"}
                      >
                        Software Engineer
                      </a>
                    </div>
                  </nav>
                </div>
              </div>
            </section>
            {/* <!--───────────────card───────────────--> */}
            {loading ? (
              <section className="articleList">
                <SkeletonBlog />
                <hr />
                <SkeletonBlog />
                <hr />
                <SkeletonBlog />
              </section>
            ) : (
              <section className="articleList">
                {taggedArticles.map(article => {
                  return (
                    <ArticleCard
                      isAdmin={isAdmin}
                      isLoggedIn={isLoggedIn}
                      truncate={truncate}
                      archiveArticle={archiveArticle}
                      deleteArticle={deleteArticle}
                      handleCheck={handleCheck}
                      article={article}
                      key={article.id}
                    />
                  );
                })}
                <Pagination
                  currentPage={currentPage}
                  paginate={paginate}
                  nextPage={nextPage}
                  prevPage={prevPage}
                  postsPerPage={postsPerPage}
                  totalPosts={mainPosts.length}
                />
              </section>
            )}
            <div className="article-sidebar-container">
              <section className="article-sidebar">
                <div className="popular">
                  <h2 className="article-card-header">Popular Post</h2>
                  <section className="popular-articles">
                    {popularPosts.map(article => {
                      return (
                        <a
                          key={article.id}
                          href={`/blog/${article._id}`}
                          rel="noopener noreferrer"
                        >
                          <div className="popular-link">{article.title}</div>
                          <br />
                        </a>
                      );
                    })}
                  </section>
                </div>
                <br />
                <Subscribe />
              </section>
            </div>
          </div>
        </div>
      </div>
      <StyledHr Primary />
    </>
  );
};

export default Articles;
