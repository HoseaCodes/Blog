import React, { Component } from "react";
import "./Technologies.css";

class Tech extends Component {
  render() {
    const Bootstrap =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/Bootstrap-min.png";
    const JS =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/JS-min.png";
    const Django =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/django-min.png";
    const MongoDB =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/MongoDB-min.png";
    const Node =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/Node-min.png";
    const postgresql =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/postgresql-min.png";
    const Py =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/Py-min.png";
    const Reactt =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/Reactt-min.png";
    const Swift =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/swift-min.png";
    const JQuery =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/jquery-min.png";
    const Azure =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/azure.png";
    const AWS =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/aws.png";
    const Arch =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/architecture.png";
    const DevOps =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/devops.png";
    const Firebase =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/firebase.png";
    const Github =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/GitHub.png";
    const GitLab =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/gitlab.png";
    const Splunk =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/splunk.png";
    const NPM =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/npm.png";
    const SpringBoot =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/springboot.png";
    const Terraform =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/terraform.png";
    const Tailwind =
      "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/tailwind.png";
    const imgSlide = {
      AWS: AWS,
      azure: Azure,
      Architecture: Arch,
      firebase: Firebase,
      github: Github,
      gitlab: GitLab,
      splunk: Splunk,
      npm: NPM,
      springboot: SpringBoot,
      terraform: Terraform,
      react: Reactt,
      tailwind: Tailwind,
      DevOps: DevOps,
      bootstrap: Bootstrap,
      javascript: JS,
      Django: Django,
      mongodb: MongoDB,
      nodejs: Node,
      postgresql: postgresql,
      python: Py,
      swift: Swift,
      jquery: JQuery,
      java: "https://i.imgur.com/wiEM1zo.png",
      solidity: "https://i.imgur.com/K662O2U.png",
    };
    function getRandomObjectKeys(obj, count) {
      const keys = Object.keys(obj);
      const shuffledKeys = keys.sort(() => 0.5 - Math.random());
      return shuffledKeys.slice(0, count);
    }

    const selectedObjects = getRandomObjectKeys(imgSlide, 14);
    return (
      <>
        <div className="tech-container">
          <h2
            data-aos="fade-down"
            data-aos-offset="500"
            data-aos-duration="3000"
            data-aos-easing="ease-in"
            className="tech-title"
          >
            Technologies
          </h2>

          <div className="client-slider">
            <div className="client-slide-track">
              {selectedObjects.map((img) => {
                return (
                  <div className="client-slide" key={img}>
                    <img
                      style={{
                        width: "auto",
                        height: "-webkit-fill-available",
                      }}
                      src={imgSlide[img]}
                      height="50"
                      width="150"
                      alt={img}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Tech;
