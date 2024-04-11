import React from 'react'
import './LogoSlider.css'
import Bootstrap from "../../Assets/Images/Bootstrap-min.png";
import JS from "../../Assets/Images/JS-min.png";
import Django from "../../Assets/Images/django-min.png";
import MongoDB from "../../Assets/Images/MongoDB-min.png";
import Node from "../../Assets/Images/Node-min.png";
import postgresql from "../../Assets/Images/postgresql-min.png";
import Py from "../../Assets/Images/Py-min.png";
import Reactt from "../../Assets/Images/Reactt-min.png";
import Swift from "../../Assets/Images/swift-min.png";
import JQuery from "../../Assets/Images/jquery-min.png";
import Azure from "../../Assets/Images/azure.png";
import AWS from "../../Assets/Images/aws.png";
import Arch from "../../Assets/Images/architecture.png";
import DevOps from "../../Assets/Images/devops.png";
import Firebase from "../../Assets/Images/firebase.png";
import Github from "../../Assets/Images/GitHub.png";
import GitLab from "../../Assets/Images/gitlab.png";
import Splunk from "../../Assets/Images/splunk.png";
import NPM from "../../Assets/Images/npm.png";
import SpringBoot from "../../Assets/Images/springboot.png";
import Terraform from "../../Assets/Images/terraform.png";
import Tailwind from "../../Assets/Images/tailwind.png";

export default function LogoSlider() {
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
  );
}