import React from "react";
import "../Home/Home.css";
import RecentArticles from "../../Components/SocialMedia/RecentArticles";
import ContactCTA from "../../Components/Contact/ContactCTA";
import PersonalBrand from "../../Components/PersonalBrand/PersonalBrandOriginal";
import TechnicalAchievements from "../../Components/TechnicalAchievements/TechnicalAchievements";
import Tech from "../../Components/Technologies/Tech";
import ProjectHighlight from "../../Components/Project/projectHighlight";
import Hero from "../../Components/Hero/hero";
import { StyledHr } from "../../Layout/Hr/styledHr";

const Home = () => {
  return (
    <section className="home-page">
      <Hero
        id="top"
        Home
        username={{ firstName: "Dominique", lastName: "Hosea" }}
      />
      <StyledHr Primary />
      <PersonalBrand />
      <StyledHr Primary />
      <Tech />
      <StyledHr Primary />
      <div className="projects" id="projects">
        <ProjectHighlight />
      </div>
      <TechnicalAchievements />
      <RecentArticles />
      <ContactCTA />
    </section>
  );
};

export default Home;
