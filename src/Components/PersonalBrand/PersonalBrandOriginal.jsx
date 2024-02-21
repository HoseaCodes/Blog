import React from 'react';
import './PersonalBrand.css';
import nique from '../../Assets/Images/nique-min.jpg'
import Resume2020 from '../../Assets/Files/Resume2020.pdf'
import { Button } from '../Button/Button';

const PersonalBrand = () => {

    function handleClick(e) {
        e.preventDefault();
        window.location.href = '/about';

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
              driven by a passion for knowledge. I am focused on building
              software that improves user engagement and experience through
              &nbsp;
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
                  In my previous Operations Manager role, I identified
                  underlying problems, analyzing potential solutions, and
                  implementing resolutions. My attention to detail and love for
                  technology lead me to seek a deep understanding of Management
                  of Information Systems. In my graduate program, I received a
                  sound understanding of the relational database, SQL, C#/C++,
                  and business processes.
                </p>
                <br />
                <p className="personal-card-content">
                  I enrolled in an immersive full-stack software engineering
                  program, where I was exposed to the MERN stack and turned my
                  MIS knowledge into applicable, real-world solutions. I
                  developed several full-stack web apps and worked on dynamic
                  team projects. The projects allowed me to hone my skills in
                  front-end development, client-servers and routing, Node.js,
                  Express.js, MongoDB, OAuth, SPA Architecture, React, Python,
                  JavaScript, and Django web framework. Each new language not
                  only broadened my coding knowledge but made me more excited to
                  learn more while also finding ways to integrate my experiences
                  and new-found knowledge to enhance user experience.
                </p>
                <br />
                <p className="personal-card-content">
                  {" "}
                  I’m looking to move into a role where I can grow with
                  motivated people that believe in growth and innovation. I have
                  worked progressively with major companies since the beginning
                  of my career and I am excited for the opportunity to continue
                  this journey with another industry leader.
                </p>
                <div className="personal-btn-wrapper">
                  <Button primary label="More about Dominique" onClick={handleClick} />
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
}

export default PersonalBrand;
