import React from "react";
import "./PersonalBrand.css";
import Resume2020 from "../../Assets/Files/Resume2020.pdf";
import { Button } from "../Button/Button";

const PersonalBrand = () => {
  const nique =
    "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/nique-min.jpg";
  function handleClick(e) {
    e.preventDefault();
    window.location.href = "/about";
  }
  function handleDownload(e) {
    e.preventDefault();
    window.location.href = Resume2020;
  }

  return (
    <>
      <div className="personal-container">
        {/* <Cards />
            <Resume /> */}
        <div
          data-aos="fade-right"
          data-aos-offset="500"
          data-aos-duration="3000"
          data-aos-easing="ease-in"
          className="personalBrand-opener"
        >
          <h2 className="name-title">Dominique Hosea</h2>
          <p className="bio-info">
            A full-stack &nbsp;
            <span className="personalBrand-p">Software Engineer </span>
            driven by a passion for knowledge. I am focused on building software
            that improves user engagement and experience through &nbsp;
            <span>developing fast solutions </span>
            to complex problems that allow users to excel.
          </p>
          <hr
            id="aboutme"
            style={{ background: "white", margin: "50px", width: "80vw" }}
          />
        </div>
        <div className="personal-combo">
          <img
            className="personal-image"
            src={nique}
            alt="Dominique Hosea"
            data-aos="fade-right"
            data-aos-offset="500"
            data-aos-duration="3000"
            data-aos-easing="ease-in"
          />
          <div
            className="personal-card"
            data-aos="fade-left"
            data-aos-offset="500"
            data-aos-duration="3000"
            data-aos-easing="ease-in"
          >
            <div className="personal-card-info">
              <h3 className="personal-card-title">
                Software Developer.Engineer
              </h3>
              <br />
              <p className="personal-card-content">
                {" "}
                In my prior role as an Operations Manager, I excelled in
                identifying underlying issues, analyzing potential solutions,
                and implementing effective resolutions. My attention to detail
                and passion for technology fueled my pursuit of a profound
                understanding of Management Information Systems (MIS). During my
                graduate program, I acquired a solid foundation in relational
                databases, SQL, C#/C++, and business processes.
              </p>
              <br />
              <p className="personal-card-content">
                Eager to bridge my MIS knowledge with practical software
                engineering skills, I enrolled in an immersive full-stack
                software engineering program. Here, I delved into the MERN
                stack, translating my MIS expertise into real-world
                applications. Through dynamic team projects, I honed my skills
                in front-end development, client-servers and routing, Node.js,
                Express.js, MongoDB, OAuth, SPA Architecture, React, Python,
                JavaScript, and the Django web framework. Each new language
                broadened my coding proficiency, fostering excitement for
                continuous learning and integration to enhance user experiences.
              </p>
              <br />
              <p className="personal-card-content">
                My professional journey has recently led me to State Farm in
                Dallas, TX, where I serve as a Software Engineer. Since April
                2021, I've been at the forefront of developing maintainable and
                scalable web and mobile applications, focusing on
                enterprise-level projects. My responsibilities include
                optimizing existing systems, automating workflows for
                efficiency, ensuring over 70% hands-on engagement, and
                collaborating with cross-functional teams to integrate solutions
                seamlessly. I also track the business impact of features and
                provide insights for future directions, ensuring the reliability
                and uptime of internal and external systems.
              </p>
              <br />
              <p className="personal-card-content">
                Additionally, I held a position as Lead Backend Software
                Engineer at Aimly in Austin, TX, where I further honed my
                expertise. I wrote unit and integration tests for quality
                assurance, utilized Node.js for backend system development, and
                implemented software engineering best practices such as
                automated pipelines, Operational Excellence, and Information
                Security. Proficient in internal integration within AWS using
                DynamoDB with Lambda functions, I showcased the ability to
                architect and implement robust serverless applications.
                Additionally, I leveraged AWS SDK and TypeScript effectively,
                set up and configured GitHub Actions for continuous integration
                and continuous deployment (CI/CD) pipelines.
              </p>
              <br />
              <p className="personal-card-content">
                {" "}
                I am now seeking a role where I can continue to grow alongside
                motivated individuals who share a belief in continuous growth
                and innovation. Having progressively contributed to major
                companies throughout my career, I am enthusiastic about the
                prospect of contributing to another industry leader's success.
              </p>
              <div className="personal-btn-wrapper">
                <Button
                  primary
                  label="More about Dominique"
                  onClick={handleClick}
                />
                <Button
                  primary
                  label="Download my Resume"
                  className="download-btn"
                  onClick={handleDownload}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalBrand;
