import React, { Component } from "react";
import "./Technologies.css";

class Tech extends Component {
  render() {
    const Bootstrap =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/Bootstrap-min.png";
    const JS =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/JS-min.png";
    const Django =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/django-min.png";
    const MongoDB =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/MongoDB-min.png";
    const Node =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/Node-min.png";
    const postgresql =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/postgresql-min.png";
    const Py =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/Py-min.png";
    const Reactt =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/Reactt-min.png";
    const Swift =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/swift-min.png";
    const JQuery =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/jquery-min.png";
    const Azure =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/azure.png";
    const AWS =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/aws.png";
    const Arch =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/architecture.png";
    const DevOps =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/devops.png";
    const Firebase =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/firebase.png";
    const Github =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/GitHub.png";
    const GitLab =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/gitlab.png";
    const Splunk =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/splunk.png";
    const NPM =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/npm.png";
    const SpringBoot =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/springboot.png";
    const Terraform =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/terraform.png";
    const Tailwind =
      "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/tailwind.png";
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
