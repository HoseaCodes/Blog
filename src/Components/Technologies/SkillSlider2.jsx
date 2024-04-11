import React from "react";
import "./SkillSlider2.css";
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

export default function SkillSlider2() {
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
  const classes = ["orb orb--l", "orb orb--s", "orb orb--m"];

  const selectRandomClass = (array) => {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  };
  return (
    <div className="container-wrapper-skill">
        {/* <div className="scroll">
          <div>
            <span>Full Stack</span>
            <span>Backend</span>
            <span>Frontend</span>
            <span>DevOps</span>
          </div>
          <div>
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
            <span>ReactJS</span>
            <span>Figma</span>
            <span>Photoshop</span>
            <span>Premiere Pro</span>
            <span>Figma</span>
            <span>Angular</span>
            <span>Node JS</span>
          </div>
          </div> */}
          
      <div className="container-inner">

        <ul className="orbs">
          {Object.keys(imgSlide).map((key, index) => {
            const randomClass = selectRandomClass(classes);
            const randomNoteClass = selectRandomClass([
              "noted",
              "",
              "",
              "",
              "",
              "offset",
            ]);
            const speeds = Object.keys(imgSlide).map(
              () => Math.random() * 5 + 2
            );
            return (
              <li
                key={index}
                className={`${randomClass} ${randomNoteClass}`}
                aria-label={key}
              >
                <a href="#" target="_blank">
                  <img src={imgSlide[key]} className="orb__img" alt={key} />
                </a>
              </li>
            );
          })}
          <li className="orb orb--l" aria-label="Paste by WeTransfer">
            <a href="#" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/paste-by-wetransfer-3229c21e4ba09f1add678504923fb8297be6e53d78e8aeb2044624838c9a805e.jpg"
                className="orb__img"
                alt="Paste logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Rapidweaver">
            <a
              href="https://www.realmacsoftware.com/rapidweaver/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/rapidweaver-c4749d14b02f3fe9c5ed281e14f50737252a874dead4d078eb1b9afd63cb4654.jpg"
                className="orb__img"
                alt="Rapidweaver logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="HP">
            <a href="https://www8.hp.com/ca/en/home.html" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/hp-5d806e6b8f7839f70b5b374d1530eb6993a8a0cb210655d0ee5f7c2100c73c13.jpg"
                className="orb__img"
                alt="HP logo"
              />
              <span>HP</span>
            </a>
          </li>
          <li className="orb orb--m" aria-label="Irvue">
            <a
              href="https://itunes.apple.com/us/app/irvue/id1039633667?mt=12"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/irvue-8d8f1700aca5fff0b456804feec1475bda11ee7069d1b44892b9428f178eb14a.jpg"
                className="orb__img"
                alt="Irvue logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Semplice">
            <a
              href="https://www.semplice.com/project/semplice-x-unsplash"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/semplice-5db5ed42d3a1c41d1f4c9ed7f29cc55efe7a818c39db799d4c4ccdbc280c01b0.jpg"
                className="orb__img"
                alt="Semplice logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Ghost">
            <a
              href="https://unsplash.com/blog/unsplash-partners-with-ghost-for-your-blog/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/ghost-9142044a14876d0a52d77941462946b971a4b924759246c462bdb6de2c34def5.jpg"
                className="orb__img"
                alt="Ghost logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Naver">
            <a href="https://www.naver.com/" target="_target">
              <img
                src="https://unsplash.com/assets/api/applications/devs/naver-a0a7f0bd0aee347bb9cc20010df173c03493d402047cfe9ff0eb6f7a5ec476ec.jpg"
                className="orb__img"
                alt="Naver logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Marvel">
            <a href="https://marvelapp.com" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/marvel-4331c198f7653961105a9e87f6c4ee3e251ba2fdccf9d4e7555ab437516ce98a.jpg"
                className="orb__img"
                alt="Marvel logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Unbounce">
            <a href="https://unbounce.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/unbounce-7a20885f1ebd50a3d7a8521d690c5508915da1ae2852137ccfb90bea62e16b40.jpg"
                className="orb__img"
                alt="Unbounce logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Framer">
            <a
              href="https://unsplash.com/blog/unsplash-framer/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/framer-78cbb399b6bfc044e6e16a704f3536ea65671f037a431054c68a3464eaa6380e.jpg"
                className="orb__img"
                alt="Framer logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Wattpad">
            <a href="https://www.wattpad.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/wattpad-68358ed4a09c667696dbfaf47283205b2508533ec25934b92dd839c34649a2c7.jpg"
                className="orb__img"
                alt="Wattpad logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Tencent">
            <a href="https://www.tencent.com/en-us/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/tencent-114dbfb4d8547d6578f0ef102ecd6069b1fb0e9801f0a87c746c192dbe32ddce.jpg"
                className="orb__img"
                alt="Tencet logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Weebly">
            <a
              href="https://unsplash.com/blog/unsplash-partners-with-weebly-for-your-email-marketing/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/weebly-381d7c8ebc12134cec375a36fbd735b4c91de6f2f3502590f80d091272528b3d.jpg"
                className="orb__img"
                alt="Weebly logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Notion">
            <a
              href="https://unsplash.com/blog/unsplash-notion/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/notion-8fb6a821e94ad96ea039587675c0a604f0a4a987f5c729a160ff843e6a7d5dfc.jpg"
                className="orb__img"
                alt="Notion logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Airtame">
            <a href="https://airtame.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/airtame-30a966c1a64afb9fd07c1274301da988ccf14a767f63f6dd8c6869ccc9166cd4.jpg"
                className="orb__img"
                alt="Airtame logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Over">
            <a href="https://madewithover.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/over-ac72cd05de62687871ea1800130005e8bfca170c6ae7ec58495ffb954fb76d63.jpg"
                className="orb__img"
                alt="Over logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Readymag">
            <a href="https://readymag.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/readymag-06449186dea62394af881fde4212c8cb233accb087170feea010945b7c5186a9.jpg"
                className="orb__img"
                alt="Readymag logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Frame">
            <a href="https://frame.io/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/frame-3fb35c1727b7e0d33cee938553d5c73b24b8c399776d3786e57fd9e18c00c76c.jpg"
                className="orb__img"
                alt="Frame logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Google">
            <a href="https://www.google.ca/slides/about/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/google-6a4028f6f5ea3e6ef1da633c850bdcc79c8ecaa714c67b84c8ce205e88969ca1.jpg"
                className="orb__img"
                alt="Google logo"
              />
              <span>Google</span>
            </a>
          </li>
          <li className="orb orb--m" aria-label="Articulate">
            <a href="https://articulate.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/articulate-f85cc99029f642f287f446cad109403731dff621170dbb39c163df255cbae803.jpg"
                className="orb__img"
                alt="Articulate logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="PicsArt">
            <a href="https://picsart.com/?hl=en" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/picsart-b2f04af0121c9b1dd3489bed5461783fbb29003e3b59a8c7571089e076d5b668.jpg"
                className="orb__img"
                alt="PicsArt logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Muzli">
            <a href="https://unsplash.com/blog/muzli-unsplash/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/muzli-f6b166ecc85d981e00d0ba747b6f7569b4c7275351284f8da8526c32d3beadfe.jpg"
                className="orb__img"
                alt="Muzli logo"
              />
            </a>
          </li>
        </ul>
        <ul className="orbs">
          <li className="orb orb--l" aria-label="Paste by WeTransfer">
            <a href="#" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/paste-by-wetransfer-3229c21e4ba09f1add678504923fb8297be6e53d78e8aeb2044624838c9a805e.jpg"
                className="orb__img"
                alt="Paste logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Rapidweaver">
            <a
              href="https://www.realmacsoftware.com/rapidweaver/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/rapidweaver-c4749d14b02f3fe9c5ed281e14f50737252a874dead4d078eb1b9afd63cb4654.jpg"
                className="orb__img"
                alt="Rapidweaver logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="HP">
            <a href="https://www8.hp.com/ca/en/home.html" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/hp-5d806e6b8f7839f70b5b374d1530eb6993a8a0cb210655d0ee5f7c2100c73c13.jpg"
                className="orb__img"
                alt="HP logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Irvue">
            <a
              href="https://itunes.apple.com/us/app/irvue/id1039633667?mt=12"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/irvue-8d8f1700aca5fff0b456804feec1475bda11ee7069d1b44892b9428f178eb14a.jpg"
                className="orb__img"
                alt="Irvue logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Semplice">
            <a
              href="https://www.semplice.com/project/semplice-x-unsplash"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/semplice-5db5ed42d3a1c41d1f4c9ed7f29cc55efe7a818c39db799d4c4ccdbc280c01b0.jpg"
                className="orb__img"
                alt="Semplice logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Ghost">
            <a
              href="https://unsplash.com/blog/unsplash-partners-with-ghost-for-your-blog/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/ghost-9142044a14876d0a52d77941462946b971a4b924759246c462bdb6de2c34def5.jpg"
                className="orb__img"
                alt="Ghost logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Naver">
            <a href="https://www.naver.com/" target="_target">
              <img
                src="https://unsplash.com/assets/api/applications/devs/naver-a0a7f0bd0aee347bb9cc20010df173c03493d402047cfe9ff0eb6f7a5ec476ec.jpg"
                className="orb__img"
                alt="Naver logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Marvel">
            <a href="https://marvelapp.com" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/marvel-4331c198f7653961105a9e87f6c4ee3e251ba2fdccf9d4e7555ab437516ce98a.jpg"
                className="orb__img"
                alt="Marvel logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Unbounce">
            <a href="https://unbounce.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/unbounce-7a20885f1ebd50a3d7a8521d690c5508915da1ae2852137ccfb90bea62e16b40.jpg"
                className="orb__img"
                alt="Unbounce logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Framer">
            <a
              href="https://unsplash.com/blog/unsplash-framer/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/framer-78cbb399b6bfc044e6e16a704f3536ea65671f037a431054c68a3464eaa6380e.jpg"
                className="orb__img"
                alt="Framer logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Wattpad">
            <a href="https://www.wattpad.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/wattpad-68358ed4a09c667696dbfaf47283205b2508533ec25934b92dd839c34649a2c7.jpg"
                className="orb__img"
                alt="Wattpad logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Tencent">
            <a href="https://www.tencent.com/en-us/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/tencent-114dbfb4d8547d6578f0ef102ecd6069b1fb0e9801f0a87c746c192dbe32ddce.jpg"
                className="orb__img"
                alt="Tencet logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Weebly">
            <a
              href="https://unsplash.com/blog/unsplash-partners-with-weebly-for-your-email-marketing/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/weebly-381d7c8ebc12134cec375a36fbd735b4c91de6f2f3502590f80d091272528b3d.jpg"
                className="orb__img"
                alt="Weebly logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Notion">
            <a
              href="https://unsplash.com/blog/unsplash-notion/"
              target="_blank"
            >
              <img
                src="https://unsplash.com/assets/api/applications/devs/notion-8fb6a821e94ad96ea039587675c0a604f0a4a987f5c729a160ff843e6a7d5dfc.jpg"
                className="orb__img"
                alt="Notion logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Airtame">
            <a href="https://airtame.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/airtame-30a966c1a64afb9fd07c1274301da988ccf14a767f63f6dd8c6869ccc9166cd4.jpg"
                className="orb__img"
                alt="Airtame logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Over">
            <a href="https://madewithover.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/over-ac72cd05de62687871ea1800130005e8bfca170c6ae7ec58495ffb954fb76d63.jpg"
                className="orb__img"
                alt="Over logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Readymag">
            <a href="https://readymag.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/readymag-06449186dea62394af881fde4212c8cb233accb087170feea010945b7c5186a9.jpg"
                className="orb__img"
                alt="Readymag logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Frame">
            <a href="https://frame.io/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/frame-3fb35c1727b7e0d33cee938553d5c73b24b8c399776d3786e57fd9e18c00c76c.jpg"
                className="orb__img"
                alt="Frame logo"
              />
            </a>
          </li>
          <li className="orb orb--l" aria-label="Google">
            <a href="https://www.google.ca/slides/about/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/google-6a4028f6f5ea3e6ef1da633c850bdcc79c8ecaa714c67b84c8ce205e88969ca1.jpg"
                className="orb__img"
                alt="Google logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="Articulate">
            <a href="https://articulate.com/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/articulate-f85cc99029f642f287f446cad109403731dff621170dbb39c163df255cbae803.jpg"
                className="orb__img"
                alt="Articulate logo"
              />
            </a>
          </li>
          <li className="orb orb--m" aria-label="PicsArt">
            <a href="https://picsart.com/?hl=en" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/picsart-b2f04af0121c9b1dd3489bed5461783fbb29003e3b59a8c7571089e076d5b668.jpg"
                className="orb__img"
                alt="PicsArt logo"
              />
            </a>
          </li>
          <li className="orb orb--s" aria-label="Muzli">
            <a href="https://unsplash.com/blog/muzli-unsplash/" target="_blank">
              <img
                src="https://unsplash.com/assets/api/applications/devs/muzli-f6b166ecc85d981e00d0ba747b6f7569b4c7275351284f8da8526c32d3beadfe.jpg"
                className="orb__img"
                alt="Muzli logo"
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
