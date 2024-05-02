import React, { useContext, useEffect } from "react";
import "../Home/Home.css";
import SocialMedia from "../../Components/SocialMedia/SocialMedia";
import PersonalBrand from "../../Components/PersonalBrand/PersonalBrandOriginal";
import Testimonial from "../../Components/Testimonials/testimonial";
import Tech from "../../Components/Technologies/Tech";
import { MdEmail } from "react-icons/md";
import ProjectHighlight from "../../Components/Project/projectHighlight";
import Hero from "../../Components/Hero/hero";
import { StyledHr } from "../../Layout/Hr/styledHr";
import { AncorButton } from "../../Components/Button/AncorButton";
import { GlobalState } from "../../GlobalState";
// import PrivateHome from "../../Components/Cards/privateHome";
import { HeroText } from "../../Layout/Hero/styledHero";
import moment from "moment-timezone";

const Home = () => {
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [articles] = state.articlesAPI.articles;
  const [user] = state.userAPI.user;
  const mainPosts = articles.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  useEffect(() => {
    console.log({ articles });
  }, [articles]);

  if (!articles && isLoggedIn) return <>loading...</>;

  const loggedInHome = () => {
    return (
      <>
        <div className="homepage-combo">
          <div className="d-none d-md-block">
            <HeroText>All Blog Posts</HeroText>
            {mainPosts.map((article) => {
              const timeFormater = moment
                .utc(article.createdAt)
                .format("MMMM Do YYYY");
              const updateTimeFormater = moment
                .utc(article.updatedAt)
                .format("MMMM Do YYYY");
              return (
                <></>
                // <PrivateHome
                //   article={article}
                //   user={user}
                //   timeFormater={timeFormater}
                //   updateTimeFormater={updateTimeFormater}
                // />
              );
            })}
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
        <div className="testimonies-group">
          <StyledHr Primary />
          <h2
            data-aos="fade-down"
            data-aos-offset="500"
            data-aos-duration="3000"
            data-aos-easing="ease-in"
            className="subTitle"
          >
            Testimonies
          </h2>
        </div>
        <StyledHr Primary />
        <br />
        <br />
        <div className="homepage-combo">
          <div className="socialmedia d-none d-md-block">
            <SocialMedia />
          </div>
          <div className="testomonies mobile">
            <Testimonial />
          </div>
        </div>
        <div className="contact">
          <StyledHr Primary />
          <div className="contact-group">
            <h2
              style={{
                fontSize: "5rem",
                textAlign: "center",
                color: "white",
                opacity: ".8",
                textTransform: "uppercase",
                textShadow: "2px 2px 2px #206a5d",
                letterSpacing: "1rem",
              }}
            >
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
