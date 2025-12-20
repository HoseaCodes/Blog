import React, { useContext, useEffect, useState } from "react";
import "../Home/Home.css";
import RecentArticles from "../../Components/SocialMedia/RecentArticles";
import PersonalBrand from "../../Components/PersonalBrand/PersonalBrandOriginal";
import TechnicalAchievements from "../../Components/TechnicalAchievements/TechnicalAchievements";
import Tech from "../../Components/Technologies/Tech";
import { MdEmail } from "react-icons/md";
import ProjectHighlight from "../../Components/Project/projectHighlight";
import Hero from "../../Components/Hero/hero";
import { StyledHr } from "../../Layout/Hr/styledHr";
import { AncorButton } from "../../Components/Button/AncorButton";
import { GlobalState } from "../../GlobalState";
import { truncate } from "../../Utils/helperFunctions";
// import PrivateHome from "../../Components/Cards/privateHome";
import { HeroText } from "../../Layout/Hero/styledHero";
import moment from "moment-timezone";
import axios from "axios";

const Home = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [user] = state.userAPI.user;
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [articles] = state.articlesAPI.articles;
  const [userArticles, setUserArticles] = useState([]);
  const [mainPosts, setMainPosts] = useState([]);

  useEffect(() => {
    articles.forEach((article) => {
      if (isLoggedIn) {
        if (user && Array.isArray(user.articles) && user.articles.includes(article.article_id)) {
          console.log(article)
          setUserArticles((prev) => [...prev, article]);
        }
      }
    });
  }, [articles]);

  if (!userArticles && isLoggedIn) return <>loading...</>;

  useEffect(() => {
    if (userArticles.length >= 1) {
      const updateMainPosts = userArticles.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMainPosts(updateMainPosts);
    }
  }, [userArticles]);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (user) {
      await axios.delete(`/api/articles/${id}`, {
        headers: { Authorization: token }
      }
      );
    }
  };

  const handleArchive = async (e, id, archive) => {
    e.preventDefault();
    if (user) {
      await axios.put(
        `/api/articles/${id}`,
        {
          archive: archive ? false : true,
        },
        {
          headers: { Authorization: token },
        }
      );
    }
  };

  const handleDraft = async (e, id, draft) => {
    e.preventDefault();
    if (user) {
      await axios.put(
        `/api/articles/${id}`,
        {
          draft: draft,
        },
        {
          headers: { Authorization: token },
        }
      );
    }
  };

  const loggedInHome = () => {
    return (
      <>
        <StyledHr Primary />
        <div className="homepage-combo">
          <div className="d-none d-md-block">
            <HeroText>All Blog Posts</HeroText>
            {mainPosts.length === 0 ? (
              <></>
            ) : (
              mainPosts.map((article) => {
                const timeFormater = moment
                  .utc(article.createdAt)
                  .format("MMMM Do YYYY");
                const updateTimeFormater = moment
                  .utc(article.updatedAt)
                  .format("MMMM Do YYYY");
                return (
                  <section key={article._id} className="list-group">
                    <li className="list-group-item">
                      <div className="mr-5 d-flex flex-row justify-content-end align-items-center">
                        <div className="p-2 d-flex flex-row justify-content-between align-items-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={article.draft}
                            name="draft"
                            id="flexCheckChecked"
                            onChange={(e) => handleDraft(e, article._id, article.draft)}
                          />
                          &nbsp;&nbsp;
                          <label
                            className="form-check-label"
                            for="flexCheckChecked"
                          >
                            Draft
                          </label>
                        </div>
                        <br />
                        <div className="p-2 d-flex flex-row justify-content-between align-items-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value={article.archive}
                            id="flexCheckChecked"
                            onChange={(e) => handleArchive(e, article._id, article.archive)}
                            // checked
                          />
                          &nbsp;&nbsp;
                          <label
                            className="form-check-label"
                            for="flexCheckChecked"
                          >
                            Archive
                          </label>
                        </div>
                        <div className="p-2 d-flex flex-row justify-content-between align-items-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexCheckChecked"
                            onChange={(e) => handleDelete(e, article._id)}
                            // checked
                          />
                          &nbsp;&nbsp;
                          <label
                            className="form-check-label"
                            for="flexCheckChecked"
                          >
                            Delete
                          </label>
                        </div>
                      </div>

                      <a
                        href={`/admin/blog/edit/${article._id}`}
                        className={`list-group-item list-group-item-action ${
                          article[0] && "active"
                        }`}
                        aria-current="true"
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h5 className="mb-1">{article.title}</h5>
                          <div>
                            <small>Created On: {timeFormater}</small>
                            <br />
                            <small>Last Updated On: {updateTimeFormater}</small>
                            <h6 className="mb-1">
                              Comments: &nbsp;
                              <span className="badge text-bg-primary rounded-pill">
                                {article.comments.length}
                              </span>
                            </h6>
                            <h6 className="mb-1">
                              Likes: &nbsp;
                              <span className="badge text-bg-primary rounded-pill">
                                {article.likes}
                              </span>
                            </h6>
                          </div>
                        </div>
                        <br />
                        <p className="mb-1">{truncate(article.description)}</p>
                        <span>Categories: </span>
                        {article.categories.length >= 1 &&
                        article.categories[0] !== "" ? (
                          article.categories.map((category) => {
                            return (
                              <small
                                key={category}
                                style={{
                                  backgroundColor: "#206a5d",
                                  color: "white",
                                  padding: ".5rem",
                                  borderRadius: "5px",
                                }}
                              >
                                {category}
                              </small>
                            );
                          })
                        ) : (
                          <small>None</small>
                        )}
                        <br />
                        <span>Tags: </span>
                        {article.tags.length >= 1 ? (
                          article.tags.map((tag) => {
                            return (
                              <small
                                key={tag}
                                style={{
                                  backgroundColor: "#206a5d",
                                  color: "white",
                                  padding: ".5rem",
                                  borderRadius: "5px",
                                }}
                              >
                                {tag}
                              </small>
                            );
                          })
                        ) : (
                          <small>None</small>
                        )}
                      </a>
                    </li>
                  </section>
                );
              })
            )}
          </div>
        </div>
        <StyledHr Primary />
      </>
    );
  };

  const publicHome = () => {
    return (
      <>
        <Hero
          id="top"
          Home
          username={{ firstName: "Hosea", lastName: "Codes" }}
        />
        <StyledHr Primary />
        <PersonalBrand />
        <StyledHr Primary />
        <Tech />
        <StyledHr Primary />
        <div className="projects">
          <ProjectHighlight />
        </div>
        <StyledHr Primary />
        <div className="achievements-section-wrapper">
          <TechnicalAchievements />
        </div>
        <StyledHr Primary />
        <div className="articles-section-wrapper">
          <RecentArticles />
        </div>
        <div className="contact">
          <StyledHr Primary />
          <div className="contact-group">
            <h2 className="contact-heading">
              Send Me A Message
            </h2>
            <a
              className="social"
              href="https://mail.google.com/mail/u/0/#inbox?compose=new"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MdEmail
                className="email"
                fontSize="large"
                style={{ color: "#206a5d", width: "15rem !important" }}
              />
            </a>
          </div>
          <StyledHr Primary />
          <br />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <AncorButton
              primary
              href="#top"
              target="_self"
              label="Back to Top"
              data-aos="fade-right"
              data-aos-offset="200"
              data-aos-duration="3000"
              data-aos-easing="ease-in"
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <section className="home-page">
      {isLoggedIn ? loggedInHome() : publicHome()}
    </section>
  );
};

export default Home;
