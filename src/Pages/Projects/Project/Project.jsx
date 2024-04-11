import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { StyledHr } from "../../../Layout/Hr/styledHr";
import { projectData } from "../ProjectsData";
import "./Project.css";
// import Carousel from "../../../Components/Carousel/Carousel";
import AnimatedImage from "../../../Components/Animation/Image/AnimatedImage";
import AnimatedTextCharacter from "../../../Components/Animation/Text/AnimatedTextCharacter";
import AnimatedTextSlide from "../../../Components/Animation/Text/AnimatedTextSlide";
import AnimatedTextBlockRevealer from "../../../Components/Animation/Text/AnimatedTextBlockRevealer";
import AnimatedParagraphFade from "../../../Components/Animation/Text/AnimatedParagraphFade";
import AOS from "aos";
import "aos/dist/aos.css";
import { useInView } from "react-intersection-observer";

const ProjectItem = () => {
  const params = useParams();
  const newparm = parseInt(params.id);

  const {
    headerImg,
    name,
    title,
    role,
    objectives,
    subHeading,
    source,
    background,
    backgroundColor,
    secondaryBackgroundColor,
    textColor,
    context,
    design,
    designImg,
    uiDesignImgs,
    headline,
    date,
    websites,
    app,
    typography,
    designColor,
    frontEnd,
    backEnd,
    userFlows,
    apiManagement,
    features,
    goal,
    version,
    prototype,
  } = projectData[params.id - 1];

  useEffect(() => {
    // Scroll to the top of the page on component mount (reload)
    window.scrollTo(0, 0);
  }, []);

  const nextProjectLink = (
    <>
      {newparm + 1 <= projectData.length && newparm !== 0 ? (
        <>
          <div id="overlay-wrapper">
            <a
              style={{
                backgroundImage: `url(${projectData[newparm].headerImg})`,
              }}
              href={`/project/${newparm + 1}`}
              className="next-work next-work-headerimg"
            >
              <div className="project-content">
                <h5 className="h5 next-work-lead">Next Work</h5>
                <h4 className="h2 next-work-title">
                  {projectData[newparm].name}
                </h4>
                <div className="next-work-arrow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 476.213 476.213"
                  >
                    <path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path>
                  </svg>
                </div>
              </div>
            </a>
            <div className="overlay"></div>
          </div>
        </>
      ) : (
        <div id="overlay-wrapper">
          <a
            style={{
              // backgroundImage: `url(${projectData[newparm - 2].headerImg})`
              backgroundImage: `url(https://i.imgur.com/6zFLMoK.jpg)`,
              objectFit: "contain",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            href={`/project/${newparm - 1}`}
            className="next-work pervious-work"
          >
            <div className="project-content">
              <h5 className="h5 next-work-lead pervious-work-lead">
                Previous Work
              </h5>
              <h4 className="h2 next-work-title pervious-work-title">
                {projectData[newparm - 2].name}
              </h4>
              <div className="next-work-arrow pervious-work-arrow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 476.213 476.213"
                >
                  <path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path>
                </svg>
              </div>
            </div>
          </a>
        </div>
      )}
    </>
  );

  const TextStyle = ({ style }) => {
    switch (style) {
      case "Block":
        return <AnimatedTextBlockRevealer data={[[name, headline]]} />;
      case "Slide":
        return <AnimatedTextSlide topText={name} bottomText={headline} />;
      default:
        return <AnimatedTextSlide topText={name} bottomText={headline} />;
    }
  };

  AOS.init();
  const { ref: designTextSection, inView: designTextSectionIsVisible } =
    useInView();
  const { ref: userFlowTextSection, inView: userFlowTextSectionIsVisible } =
    useInView();
  const { ref: goalTextSection, inView: goalTextSectionIsVisible } =
    useInView();
  const { ref: featureTextSection, inView: featureTextSectionIsVisible } =
    useInView();
  const { ref: featureBulletTextSection, inView: featureBulletTextSectionIsVisible } =
    useInView();
  const { ref: otherFeatureBulletTextSection, inView: otherFeatureBulletTextSectionIsVisible } =
    useInView();
  return (
    <>
      <div id="single-work" className="project-group">
        <div
          style={{ backgroundImage: `url(${headerImg})` }}
          id="top"
          className="hero-single-work"
        >
          <div className="hero-single-work-content">
            <TextStyle style="Block" />
            {app && (
              <div
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-easing="ease-in"
                className="app"
              >
                <a
                  href={app}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button highlight"
                >
                  <i className="fa fa-apple fa-lg"></i>Get The App
                </a>
              </div>
            )}
          </div>
          <div className="hero-single-context-stripe">
            <div className="project-content">
              <ul className="context-stripe-focus-area is-loaded">
                <li>
                  <strong>Role:</strong>
                  <span>
                    <AnimatedTextCharacter text={`${role}`} />
                  </span>
                </li>
                <li>
                  <strong>Context:</strong>{" "}
                  <span>
                    <AnimatedTextCharacter text={`${context}`} />
                  </span>
                </li>
                <li>
                  <strong>Period:</strong>{" "}
                  <span>
                    <AnimatedTextCharacter text={`${date}`} />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <StyledHr Primary />
        <main className="single-work" style={{ color: textColor }}>
          <section
            className="single-work-intro-section"
            style={{ backgroundColor: backgroundColor }}
          >
            <div className="single-work-giga-text">
              <p>{title}</p>
            </div>
            <div className="project-content">
              <div className="overview-section">
                <div className="overview-container project-services">
                  <div className="sticky-labels services-label">
                    <h3 className="outline-title">Overview</h3>
                  </div>
                  <div className="w-layout-grid services-list">
                    <div className="service-item">
                      <div
                        data-aos="fade-down-right"
                        data-aos-offset="500"
                        data-aos-duration="1500"
                        data-aos-easing="ease-in"
                        className="overview-column"
                      >
                        <h6 className="overview-titles">Background</h6>
                        <div
                          className="separation-line service-line"
                          style={{ backgroundColor: textColor }}
                        ></div>
                        <p className="overview-descrp">{background}</p>
                      </div>
                      <div
                        data-w-id="d560b535-42b5-12a8-ef8c-77aab6dce6db"
                        className="services-column"
                      >
                        <div
                          data-aos="fade-down-left"
                          data-aos-offset="500"
                          data-aos-duration="1500"
                          data-aos-easing="ease-in"
                          className="column"
                        >
                          <h6 className="overview-titles">Objectives</h6>
                          <div
                            className="separation-line service-line"
                            style={{ backgroundColor: textColor }}
                          ></div>
                          <p className="overview-descrp">
                            {objectives} <br />
                          </p>
                        </div>
                      </div>
                      <div
                        data-aos="fade-up-right"
                        data-aos-offset="500"
                        data-aos-duration="1500"
                        data-aos-easing="ease-in"
                        className="column"
                      >
                        <h6 className="overview-titles">My role</h6>
                        <div
                          className="separation-line service-line"
                          style={{ backgroundColor: textColor }}
                        ></div>
                        <p className="overview-descrp">{subHeading}</p>
                      </div>
                      <div
                        data-aos="fade-up-left"
                        data-aos-offset="500"
                        data-aos-duration="1500"
                        data-aos-easing="ease-in"
                        className="column"
                      >
                        <h6 className="overview-titles">Scope</h6>
                        <div
                          className="separation-line service-line"
                          style={{ backgroundColor: textColor }}
                        ></div>
                        <p className="overview-descrp">
                          {source.map((item) => {
                            return (
                              <>
                                {item} <br />
                              </>
                            );
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                data-aos="fade-up"
                data-aos-duration="1500"
                data-aos-easing="ease-in"
                className="button-content single-work-anim-text"
              >
                <a
                  href={websites[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-study-single-button ghost no-smoothState"
                >
                  <span className="button-text">Visit Website</span>
                  <span className="button-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 476.213 476.213"
                    >
                      <path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path>
                    </svg>
                  </span>
                </a>
                {prototype && (
                  <>
                    <br />
                    <br />
                    <a
                      href={prototype}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="case-study-single-button ghost no-smoothState"
                    >
                      <span className="button-text">View Prototye</span>
                      <span className="button-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 476.213 476.213"
                        >
                          <path d="M405.606 167.5l-21.212 21.213 34.393 34.393H0v30h418.787L384.394 287.5l21.212 21.213 70.607-70.607"></path>
                        </svg>
                      </span>
                    </a>
                  </>
                )}
              </div>
            </div>
          </section>
          {frontEnd && (
            <section
              className="single-work-section"
              style={{ backgroundColor: secondaryBackgroundColor }}
            >
              <div className="section-mask"></div>
              <div className="project-content analysis-section">
                <div
                  data-aos="fade-right"
                  data-aos-offset="500"
                  data-aos-duration="1500"
                  data-aos-easing="ease-in"
                  className="section-text-mask"
                >
                  <h4 className="h5 section-subtitle">
                    Analysis &amp; Preparation
                  </h4>
                </div>
                <div
                  data-aos="fade-left"
                  data-aos-offset="500"
                  data-aos-duration="1500"
                  data-aos-easing="ease-in"
                  className="section-text-mask"
                >
                  <h2 className="h3 section-title">Branding</h2>
                </div>

                <div className="inner-container">
                  <div className="single-work-text-content is-left single-work-first-anim-blocks">
                    <h3
                      data-aos="fade-down"
                      data-aos-offset="500"
                      data-aos-duration="1500"
                      data-aos-easing="ease-in"
                      className="single-work-content-title"
                    >
                      An elegant design.
                    </h3>
                    <div className="single-work-content-separator"></div>
                    <div
                      className="single-work-content-desc"
                      ref={designTextSection}
                    >
                      <AnimatedParagraphFade
                        visible={designTextSectionIsVisible}
                        paragraph={design}
                      />
                    </div>
                  </div>
                  <div className="single-work-img-content single-work-first-anim-blocks">
                    {designImg.includes(".mp4") ? (
                      <video autoPlay controls width={850}>
                        <source src={designImg} type="video/mp4" />
                      </video>
                    ) : (
                      <AnimatedImage image={designImg} />
                    )}
                  </div>
                </div>
                {designColor && (
                  <>
                    <div
                      data-aos="zoom-out-down"
                      data-aos-offset="500"
                      data-aos-duration="1000"
                      data-aos-easing="ease-in"
                      className="inner-container color-palette-section"
                    >
                      {Object.keys(designColor).map((color) => {
                        return (
                          <>
                            <div className="color-palette-container">
                              <div
                                style={{
                                  backgroundColor: `${designColor[color]}`,
                                }}
                                className="color-palette"
                              ></div>
                              <h5 className="color-palette-name">{color}</h5>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </>
                )}
                {typography && (
                  <>
                    <div
                      data-aos="fade-up"
                      data-aos-offset="300"
                      data-aos-easing="ease-in-sine"
                      className="inner-container typography-container"
                    >
                      {Object.keys(typography).map((typeface, i) => {
                        return (
                          <>
                            <div key={i} className="section-title">
                              <h5 style={{ fontSize: "2rem" }}>{typeface}</h5>
                              <img
                                style={{
                                  objectFit: "contain",
                                  width: "80rem",
                                  padding: "30px",
                                  height: "20 rem",
                                }}
                                src={typography[typeface]}
                                alt=""
                                srcset=""
                              />
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </>
                )}
                {/* <div className="section-text-mask pb-5">
                    <h2 className="h3 section-title">Key Problems to Address</h2>
                    <div className="inner-container" style={{ marginLeft: "20%" }}>
                      <div className="single-work-text-content is-left single-work-first-anim-blocks">
                        <h3 className="single-work-content-title">Leadership</h3>
                        <div className="single-work-content-separator"></div>
                        <div className="single-work-content-desc">
                          <ul>
                            <p>1.) Show the impact of the program</p>
                            <p>2.) Export and share clean data</p>
                            <p>3.) Track metrics on a regular basis</p>
                            <p>4.) Inaccurate data being reported</p>
                          </ul>
                        </div>
                      </div>
                      <div className="single-work-img-content single-work-first-anim-blocks">
                        <h3 className="single-work-content-title">Team Leads</h3>
                        <div className="single-work-content-separator"></div>
                        <div className="single-work-content-desc">
                          <ul>
                            <p>1.) Keep their teams accountable</p>
                            <p>2.) Track daily/weekly performance</p>
                            <p>3.) More detail about interactions</p>
                            <p>4.) Inaccurate data being reported</p>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div> */}
                {/* <div className="section-text-mask pt-5">
                    <h2 className="h3 section-title">
                      Opportunities for Improvement
                    </h2>
                    <div
                      className="single-work-text-content is-left single-work-first-anim-blocks text-center"
                      style={{ marginLeft: "30%" }}
                    >
                      <h3 className="single-work-content-title pb-5">
                        Task flows are too long.
                      </h3>
                      <div className="single-work-content-desc pb-5">
                        <p>
                          We want to decrease the number of pages required to record
                          an interaction.
                        </p>
                      </div>
                      <h3 className="single-work-content-title pb-5">
                        Too much mobile scrolling.
                      </h3>
                      <div className="single-work-content-desc pb-5">
                        <p>We want to shorten the time spent on each page.</p>
                      </div>
                    </div>
                  </div> */}
              </div>
            </section>
          )}
          {backEnd && (
            <section
              className="single-work-section"
              style={{ backgroundColor: secondaryBackgroundColor }}
            >
              <div className="section-mask"></div>
              <div className="project-content">
                <div
                  data-aos="fade-down-right"
                  data-aos-duration="1500"
                  data-aos-easing="ease-in"
                  className="section-text-mask"
                >
                  <h4 className="h5 section-subtitle">API design</h4>
                </div>
                <div
                  data-aos="fade-down-left"
                  data-aos-duration="1500"
                  data-aos-easing="ease-in"
                  className="section-text-mask"
                >
                  <h2 className="h3 section-title">REST API</h2>
                </div>

                <div className="inner-container">
                  <div
                    data-aos="fade-right"
                    data-aos-offset="500"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in"
                    className="single-work-text-content is-left single-work-first-anim-blocks"
                  >
                    <h3 className="single-work-content-title">Web services</h3>
                    <div className="single-work-content-separator"></div>
                    <div
                      ref={designTextSection}
                      className="single-work-content-desc"
                    >
                      <p>
                        <AnimatedParagraphFade
                          visible={designTextSectionIsVisible}
                          paragraph={design}
                        />
                      </p>
                    </div>
                  </div>
                  <div className="single-work-img-content single-work-first-anim-blocks">
                    <AnimatedImage image={designImg} />
                  </div>
                </div>
              </div>
            </section>
          )}
          {uiDesignImgs && (
            <>
              <section
                className="single-work-intro-section"
                style={{ backgroundColor: secondaryBackgroundColor }}
              >
                <div className="section-mask"></div>
                <div className="single-work-ui">
                  <div className="project-content ui-components">
                    <div
                      data-aos="fade-right"
                      data-aos-offset="500"
                      data-aos-duration="1500"
                      data-aos-easing="ease-in"
                      className="section-text-mask"
                    >
                      <h4 className="h5 section-subtitle">
                        UI &amp; Components.
                      </h4>
                    </div>
                    <div
                      data-aos="fade-left"
                      data-aos-offset="500"
                      data-aos-duration="1500"
                      data-aos-easing="ease-in"
                      className="section-text-mask"
                    >
                      <h2 className="h3 section-title">Design</h2>
                    </div>
                    {uiDesignImgs.length > 1 ? (
                      <div
                        data-aos="fade-up"
                        data-aos-duration="1500"
                        data-aos-easing="ease-in"
                      >
                        {/* <Carousel items={uiDesignImgs} /> */}
                      </div>
                    ) : (
                      <AnimatedImage
                        styles={{
                          objectFit: "contain",
                          height: "75rem",
                          width: "75rem",
                        }}
                        image={uiDesignImgs[0].image.src}
                      />
                      // <img
                      //   style={{
                      //     objectFit: "contain",
                      //     height: "75rem",
                      //     width: "75rem",
                      //   }}
                      //   src={uiDesignImgs[0].image.src}
                      // />
                    )}
                  </div>
                </div>
              </section>
            </>
          )}
          {features && (
            <>
              <section
                className="single-work-section"
                style={{
                  backgroundColor: secondaryBackgroundColor,
                }}
              >
                <div className="section-mask"></div>
                <div className="project-content">
                  <div
                    data-aos="fade-down-right"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in"
                    className="section-text-mask"
                  >
                    <h4 className="h5 section-subtitle">Features</h4>
                  </div>
                  <div className="inner-container">
                    <div className="single-work-content-desc">
                      {features.content.map((feature, i) => {
                        return (
                          <div
                            ref={featureTextSection}
                            key={i}
                            className="inner-container single-work-ui-row single-work-anim-text"
                          >
                            <p className="main-case-study-text">
                              <AnimatedParagraphFade
                                visible={featureTextSectionIsVisible}
                                paragraph={feature}
                              />
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="single-work-content-desc">
                      <div
                        data-aos="fade-down"
                        data-aos-duration="1500"
                        data-aos-easing="ease-in"
                        className="inner-container"
                      >
                        <p className="main-case-study-text">
                          {features.highlights.map((highlight, i) => {
                            return (
                              <ul
                                ref={featureBulletTextSection}
                                className="context-stripe-focus-area is-loaded"
                                key={i}
                              >
                                <li style={{ listStyle: "none" }}>
                                  <p className="main-case-study-text">
                                    {highlight}
                                  </p>
                                </li>
                              </ul>
                            );
                          })}
                        </p>
                      </div>
                    </div>
                    <div
                      className="project-content"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: "4% !important",
                      }}
                    >
                      {features.videos &&
                        features.videos.map((video, i) => {
                          return (
                            <video
                              data-aos="fade-down-right"
                              data-aos-duration="1500"
                              data-aos-easing="ease-in"
                              key={i}
                              autoPlay
                              muted
                              controls
                              style={{
                                objectFit: "scale-down",
                                width : `${video.vertical ? "50rem" : "100rem"}`
                              }}
                            >
                              <source src={video.src} type="video/mp4" />
                            </video>
                          );
                        })}
                      {features.images &&
                        features.images.map((image, i) => {
                          return (
                            <AnimatedImage
                              styles={{
                                paddingTop: "4%",
                                objectFit: "contain",
                                width: "100rem",
                              }}
                              key={i}
                              image={image}
                            />
                          );
                        })}
                    </div>

                    <div className="single-work-content-desc">
                      <div
                        data-aos="fade-left"
                        data-aos-duration="1500"
                        data-aos-easing="ease-in"
                        className="inner-container"
                      >
                        <p
                          className="main-case-study-text"
                          style={{ paddingTop: "4%" }}
                        >
                          Other notable contributions include:
                        </p>
                        {features.otherContributions &&
                          features.otherContributions.map((item, i) => {
                            return (
                              <ul key={i}>
                                <li style={{ listStyle: "none" }}>
                                  <p className="main-case-study-text">{item}</p>
                                </li>
                              </ul>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
          {frontEnd && (
            <section
              className="single-work-section"
              style={{ backgroundColor: secondaryBackgroundColor }}
            >
              <div className="section-mask"></div>
              <div className="single-work-ui">
                <div className="project-content">
                  <div
                    data-aos="fade-right"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in"
                    className="section-text-mask"
                  >
                    <h4 className="h5 section-subtitle">
                      User flows &amp; Tasks.
                    </h4>
                  </div>
                  <div
                    data-aos="fade-left"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in"
                    className="section-text-mask"
                  >
                    <h2 className="h3 section-title">The Flow</h2>
                  </div>
                  <div
                    ref={userFlowTextSection}
                    className="inner-container single-work-ui-row single-work-anim-text"
                  >
                    <p className="main-case-study-text">
                      <AnimatedParagraphFade
                        visible={userFlowTextSectionIsVisible}
                        paragraph={userFlows}
                      />
                    </p>
                  </div>
                </div>
              </div>
              <div className="single-work-ui">
                <div className="project-content">
                  <div
                    data-aos="fade-right"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in"
                    className="section-text-mask"
                  >
                    <h4 className="h5 section-subtitle">
                      The Goal &amp; What's next?.
                    </h4>
                  </div>
                  <div
                    data-aos="fade-left"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in"
                    className="section-text-mask"
                  >
                    <h2 className="h3 section-title">{version}</h2>
                  </div>
                  <div
                    ref={goalTextSection}
                    className="inner-container single-work-ui-row single-work-anim-text"
                  >
                    <p className="main-case-study-text">
                      <AnimatedParagraphFade
                        visible={goalTextSectionIsVisible}
                        paragraph={goal}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
          {backEnd && (
            <section
              className="single-work-section"
              style={{ backgroundColor: secondaryBackgroundColor }}
            >
              <div className="section-mask"></div>
              <div className="single-work-ui">
                <div className="project-content">
                  <div
                    data-aos="fade-down-right"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in"
                    className="section-text-mask"
                  >
                    <h4 className="h5 section-subtitle">API integration.</h4>
                  </div>
                  <div
                    data-aos="fade-down-left"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in"
                    className="section-text-mask"
                  >
                    <h2 className="h3 section-title">API management</h2>
                  </div>
                  <div
                    ref={userFlowTextSection}
                    className="inner-container single-work-ui-row single-work-anim-text"
                  >
                    <p className="main-case-study-text">
                      <AnimatedParagraphFade
                        paragraph={apiManagement}
                        visible={userFlowTextSectionIsVisible}
                      />
                      {/* <br />
                      <br />
                      <h4 className="h3 section-title">Main Functions:</h4>
                      <ul
                        className="case-study-flows text-center"
                        style={{ marginLeft: "17%" }}
                      >
                        {mainFunctions.map((item) => {
                          return <p>{item}</p>;
                        })}
                      </ul> */}
                    </p>
                  </div>
                </div>
              </div>
              <div className="single-work-ui">
                <div className="project-content">
                  <div
                    data-aos="fade-down-right"
                    data-aos-duration="1500"
                    data-aos-easing="ease-in"
                    className="section-text-mask"
                  >
                    <h4 className="h5 section-subtitle">
                      The Goal &amp; What's next?.
                    </h4>
                  </div>
                  <div className="section-text-mask">
                    <h2 className="h3 section-title">{version}</h2>
                  </div>
                  <div
                    ref={goalTextSection}
                    className="inner-container single-work-ui-row single-work-anim-text"
                  >
                    <p className="main-case-study-text">
                      <AnimatedParagraphFade
                        paragraph={goal}
                        visible={goalTextSectionIsVisible}
                      />
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
          {projectData.length >= 1 ? nextProjectLink : null}
        </main>
      </div>
      <StyledHr Primary />
    </>
  );
};

export default ProjectItem;
