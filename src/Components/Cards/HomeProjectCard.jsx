import React from "react";
import { Button } from "../Button/Button";
import "./HomeProjectCard.css";

export default function HomeProjectCard() {
  const circleStyle = {
    borderRadius: "50%",
    padding: "5px",
    width: "5rem",
    height: "5rem",
    overflow: "hidden",
    border: "2px solid dimgray", // Add border for better visibility
    boxShadow: "0 0 5px rgba(0, 0, 0, 0.3)", // Add shadow for better aesthetics
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  };
    const data = [
      {
        title: "App Name",
        description:
          "Automate monetary transfers between your friends or family based on real life events. Track and get notifications about your spending across all accounts.",
        created: "2024",
        images: [
          "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://i.imgur.com/1t2PHXj.png",
          "https://i.imgur.com/1t2PHXj.png",
          "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://i.imgur.com/1t2PHXj.png",
        ],
        technologies: [
          "https://i.imgur.com/wiEM1zo.png",
          "https://i.imgur.com/ZJbzklr.png",
        ],
        status: "In Progress",
        variant: "vertical",
      },
      {
        title: "Test App Name",
        description:
          "Automate monetary transfers between your friends or family based on real life events. Track and get notifications about your spending across all accounts.",
        created: "2024",
        images: [
          "https://i.imgur.com/1t2PHXj.png",
          "https://i.imgur.com/1t2PHXj.png",
          "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://i.imgur.com/1t2PHXj.png",
        ],
        technologies: [
          "https://i.imgur.com/wiEM1zo.png",
          "https://i.imgur.com/ZJbzklr.png",
        ],
        status: "In Progress",
        variant: "horizontal",
      },
      {
        title: "Test App Name",
        description:
          "Automate monetary transfers between your friends or family based on real life events. Track and get notifications about your spending across all accounts.",
        created: "2024",
        images: [
          "https://i.imgur.com/1t2PHXj.png",
          "https://i.imgur.com/1t2PHXj.png",
          "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://i.imgur.com/1t2PHXj.png",
        ],
        technologies: [
          "https://i.imgur.com/wiEM1zo.png",
          "https://i.imgur.com/ZJbzklr.png",
        ],
        status: "In Progress",
        variant: "horizontal",
      },
      {
        title: "App Name",
        description:
          "Automate monetary transfers between your friends or family based on real life events. Track and get notifications about your spending across all accounts.",
        created: "2024",
        images: [
          "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://i.imgur.com/1t2PHXj.png",
          "https://i.imgur.com/1t2PHXj.png",
          "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://i.imgur.com/1t2PHXj.png",
        ],
        technologies: [
          "https://i.imgur.com/wiEM1zo.png",
          "https://i.imgur.com/ZJbzklr.png",
        ],
        status: "In Progress",
        variant: "vertical",
      },
      {
        title: "Test App Name",
        description:
          "Automate monetary transfers between your friends or family based on real life events. Track and get notifications about your spending across all accounts.",
        created: "2024",
        images: [
          "https://i.imgur.com/1t2PHXj.png",
          "https://i.imgur.com/1t2PHXj.png",
          "https://images.unsplash.com/photo-1551033406-611cf9a28f67?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "https://i.imgur.com/1t2PHXj.png",
        ],
        technologies: [
          "https://i.imgur.com/wiEM1zo.png",
          "https://i.imgur.com/ZJbzklr.png",
        ],
        status: "In Progress",
        variant: "horizontal",
      },
    ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        flexWrap: "wrap",
        padding: "2%",
      }}
    >
        {
              data.map((project, index) => {
                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flex: "1 1 65rem",
                          paddingTop: "2%",
                        }}
                      >
                        <div
                          className={`${
                            project.variant === "vertical"
                              ? "variant-vertical-card"
                              : "variant-horizontal-card"
                          }`}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h2>{project.title}</h2>
                            <Button
                              style={{ color: "dimgray" }}
                              label={project.status}
                            />
                          </div>
                          <div
                            className={`${
                              project.variant === "vertical"
                                ? "variant-vertical"
                                : "variant-horizontal"
                            }`}
                          >
                            {project.variant !== "horizontal" ? (
                              <img
                                style={{
                                  height: "40rem",
                                  width: "30rem",
                                  borderRadius: "10px",
                                }}
                                src={project.images[0]}
                                alt="demo image"
                              />
                            ) : (
                              <img
                                style={{
                                  height: "20rem",
                                  width: "40rem",
                                  borderRadius: "10px",
                                }}
                                src={project.images[0]}
                                alt="demo image"
                              />
                            )}
                            <div style={{ paddingLeft: "4%" }}>
                              <h3>{project.title}</h3>
                              <p style={{ fontSize: "1.5rem" }}>
                                {project.description}
                              </p>
                            </div>
                          </div>
                          <p
                            style={{
                              display: "flex",
                              alignSelf: "end",
                            }}
                          >
                            Created: {project.created}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignSelf: "end",
                              gap: "1rem",
                            }}
                          >
                            {project.technologies.map((tech, index) => {
                              return (
                                <div style={circleStyle} key={index}>
                                  <img
                                    src={tech}
                                    alt="Java"
                                    style={imageStyle}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    );
                })
        }
    </div>
  );
}
