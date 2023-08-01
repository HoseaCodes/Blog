import React from 'react';
import './timeline.css';

const Timeline = () => {
  return (
    <>
       <div className="timeline">
                <div id="timeline" className="about-container right">
                    <div className="content">
                        <h2>2023</h2>
                        <p className="timelineP a-content">
                            While in my Software Engineer II position I was exposed to architecture, SRE foundations, and cloud development in AWS.
                            Where I built severless applications with services ranging from Lambdas, Cloudwatch, VPCs, Subnets, ECS, S3, SNS and IAM.
                            Using our services like Terraform, pipelines, chaos engineering, failovers, and circuit breakers.
                        </p>
                    </div>
                </div>
                <div id="timeline" className="about-container left">
                    <div className="content">
                        <h2>2022</h2>
                        <p className="timelineP a-content">
                            I completed my first year as a Software Engineer I at State Farm, where I was shortly promoted to Software Engineer II.
                            I took on several exisiting Java projects revolving around data manipulation, logging, intenral application proxy, and email services.
                            The projects allowed me to advance my skills in backend development to become a more well rounded Full-Stack Engineer.
                        </p>
                    </div>
                </div>
                <div id="timeline" className="about-container right">
                    <div className="content">
                        <h2>2021</h2>
                        <p className="timelineP a-content">I secured my first position as a Full-Stack Java Software Engineer at State Farm in March of 2021. Working in a full agile software development process including mining technical business features and utilizing Java Spring Boot with Maven to create a REST micro-service applications. </p>
                    </div>
                </div>
                <div id="timeline" className="about-container left">
                    <div className="content">
                        <h2>2020</h2>
                        <p className="timelineP a-content">I enrolled as a full stack software engineer student at General Assembly, where I was exposed to the MERN stack. In the program I was able to turn my MIS knowledge into applicable real-world solutions. I developed several full stack web apps, and worked on dynamic team projects. The projects allowed me to hone my skills in frontend development, client-servers and routing, Node.js, Express.js, MongoDB, OAuth, SPA Architecture, React, Python, JavaScript and Django web framework.</p>
                    </div>
                </div>
                <div className="about-container right">
                    <div className="content">
                        <h2>2017</h2>
                        <p className="timelineP a-content">My attention to detail and love for technology lead me to seek a deep understanding in Management of Information Systems and dive back into software engineering. I received my Master of Science in Management Information Systems where I got a sound understanding of relational database, SQL, C#/C++, and business processes.</p>
                    </div>
                </div>
                <div className="about-container left">
                    <div className="content">
                        <h2>2014</h2>
                        <p className="timelineP a-content">After I received my Bachelor of Business Administration in Management with focus in supply chain, I got a job as an Operations Manager at J.B. Hunt. During this time identified underlying problems, analyzing potential solutions and implementing resolutions.</p>
                    </div>
                </div>
                <div className="about-container right">
                    <div className="content">
                        <h2>2010</h2>
                        <p className="timelineP a-content">In my junior year I decided to take Java and C++ as my elective course and my interest was peaked. I new I wanted to continue but I did not know how I wanted to proceed. </p>
                    </div>
                </div>
            </div>
    </>
  )
}

export default Timeline;
