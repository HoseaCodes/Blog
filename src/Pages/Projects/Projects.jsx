import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { projectData } from "./ProjectsData";

/* ------------------------------------------------------------------
   Marketing copy + curated stack pills. Mirrors the SHOWCASE in
   projectHighlight.jsx so the home page and this page stay aligned
   without forcing schema changes upstream in ProjectsData.
------------------------------------------------------------------ */

const SHOWCASE = [
  {
    id: 1,
    eyebrow: "01 / SOCIAL RING",
    title: "Custom borders for social profile pictures.",
    description:
      "iOS app letting users layer custom-designed rings around their profile pictures — 100+ borders, in-app editor, pinch-to-resize. Grew to 500+ active users before v2.",
    role: "Software Lead",
    timeframe: "Spring 2021 · 120 hrs",
    type: "iOS App",
    stack: ["Swift", "SwiftUI", "iOS", "UIKit"],
    image: "https://i.imgur.com/138wx8D.png",
    externals: [
      { label: "App Store", href: "https://apps.apple.com/us/app/social-ring/id1551446005" },
      { label: "Website", href: "https://www.social-ring.com/" },
    ],
  },
  {
    id: 2,
    eyebrow: "02 / AIMLY",
    title: "Digital fundraising platform with gourmet chips.",
    description:
      "Lead backend engineer on the API powering campaign creation, donations, team leaderboards, inventory, and shipment tracking. Real-time reporting, payment gateway integration, and serverless data layer.",
    role: "Lead Backend Engineer",
    timeframe: "Fall 2022 · 2.5k hrs",
    type: "Web Platform",
    stack: ["Node.js", "Next.js", "AWS", "MySQL", "Redux"],
    image: "https://i.imgur.com/9k4vVxL.png",
    externals: [{ label: "goaimly.com", href: "https://goaimly.com/" }],
  },
];

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

const Page = styled.div`
  background: #0f1216;
  min-height: 100vh;
`;

const Hero = styled.section`
  position: relative;
  width: 100%;
  padding: 140px 24px 80px;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: 720px) {
    padding: 96px 18px 56px;
  }
`;

const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      55% 50% at 50% 0%,
      rgba(32, 106, 93, 0.15),
      transparent 70%
    );
  pointer-events: none;
  z-index: 0;
`;

const HeroGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(
    ellipse 80% 60% at 50% 30%,
    #000 30%,
    transparent 100%
  );
  -webkit-mask-image: radial-gradient(
    ellipse 80% 60% at 50% 30%,
    #000 30%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 0;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
`;

const Kicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;
  margin-bottom: 18px;

  &::before,
  &::after {
    content: "";
    width: 24px;
    height: 1px;
    background: #5bb39e;
    opacity: 0.6;
  }
`;

const Heading = styled.h1`
  font-family: "Lato", sans-serif;
  font-weight: 800;
  font-size: clamp(40px, 6vw, 72px);
  line-height: 1.04;
  letter-spacing: -0.028em;
  color: #f4f6f8;
  margin: 0 0 16px;
`;

const Tagline = styled.p`
  font-family: "Lato", sans-serif;
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 1.6;
  color: #a3acb2;
  max-width: 580px;
  margin: 0 auto;
`;

const Counts = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 32px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-family: "Lato", sans-serif;
  font-size: 12px;
  color: #a3acb2;
  letter-spacing: 0.01em;

  .num {
    color: #f4f6f8;
    font-weight: 600;
  }
  .dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #4d5559;
  }
`;

const Grid = styled.section`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px 120px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding-bottom: 80px;
  }
  @media (max-width: 720px) {
    padding: 8px 18px 64px;
  }
`;

const Card = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  transition: border-color 0.25s ease, transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.28);
    transform: translateY(-4px);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
    text-decoration: none;
  }
  &:hover img {
    transform: scale(1.04);
  }
`;

const Media = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #14191e;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 55%,
      rgba(15, 18, 22, 0.55) 100%
    );
    pointer-events: none;
  }
`;

const MediaImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
`;

const MediaBadge = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(15, 18, 22, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #d2d8da;
`;

const Body = styled.div`
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 720px) {
    padding: 22px;
  }
`;

const Eyebrow = styled.div`
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;
`;

const Title = styled.h3`
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-size: clamp(20px, 2.2vw, 26px);
  line-height: 1.18;
  letter-spacing: -0.018em;
  color: #f4f6f8;
  margin: 0;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  color: #6b7479;
  letter-spacing: 0.01em;

  span + span::before {
    content: "·";
    margin-right: 8px;
    color: #4d5559;
  }
`;

const Description = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;
`;

const Stack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
  border-radius: 999px;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #c5cbcf;
  letter-spacing: 0.01em;
`;

const Footer = styled.div`
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #5bb39e;
  letter-spacing: 0.01em;

  .arrow {
    transition: transform 0.18s ease;
  }
  ${Card}:hover & .arrow {
    transform: translateX(4px);
  }
`;

const ExternalsRow = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 500;
  color: #6b7479;
  letter-spacing: 0.04em;
  text-transform: uppercase;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const Projects = () => {
  // Only show showcase entries that exist as active projects upstream
  const showcase = SHOWCASE.filter((s) =>
    projectData.some((p) => p.id === s.id)
  );

  return (
    <Page>
      <Hero>
        <HeroGlow />
        <HeroGrid />
        <HeroInner>
          <Kicker>Work</Kicker>
          <Heading>Projects &amp; systems.</Heading>
          <Tagline>
            End-to-end products I've designed, built, and shipped — from
            API architecture to the interface someone actually clicks.
          </Tagline>
          <Counts>
            <span>
              <span className="num">{showcase.length}</span> shipped
            </span>
            <span className="dot" />
            <span>Backend · Mobile · Web</span>
          </Counts>
        </HeroInner>
      </Hero>

      <Grid>
        {showcase.map((project) => (
          <Card key={project.id} to={`/project/${project.id}`}>
            <Media>
              <MediaBadge>{project.type}</MediaBadge>
              <MediaImg
                src={project.image}
                alt={project.title}
                loading="lazy"
              />
            </Media>
            <Body>
              <Eyebrow>{project.eyebrow}</Eyebrow>
              <Title>{project.title}</Title>
              <Meta>
                <span>{project.role}</span>
                <span>{project.timeframe}</span>
              </Meta>
              <Description>{project.description}</Description>
              <Stack>
                {project.stack.map((t) => (
                  <Pill key={t}>{t}</Pill>
                ))}
              </Stack>
              <Footer>
                <span>View case study</span>
                {project.externals.length > 0 ? (
                  <ExternalsRow>
                    {project.externals.map((e, i) => (
                      <span key={e.label}>
                        {i > 0 ? "·" : ""} {e.label}
                      </span>
                    ))}
                  </ExternalsRow>
                ) : (
                  <span className="arrow">→</span>
                )}
              </Footer>
            </Body>
          </Card>
        ))}
      </Grid>
    </Page>
  );
};

export default Projects;
