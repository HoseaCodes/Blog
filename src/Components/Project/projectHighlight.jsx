import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { projectData } from "../../Pages/Projects/ProjectsData";

/* ------------------------------------------------------------------
   Curated showcase data — overrides + supplements ProjectsData
   for the home-page treatment. Keeps source of truth in ProjectsData
   but lets us cherry-pick the marketing copy, tech stack, and links
   without forcing schema changes upstream.
------------------------------------------------------------------ */

const SHOWCASE = [
  {
    id: 1,
    eyebrow: "01 / SOCIAL RING",
    title: "Custom borders for social profile pictures.",
    description:
      "iOS app letting users layer custom-designed rings around their profile pictures — 100+ borders, in-app editor, pinch-to-resize. Grew to 500+ active users before v2.",
    role: "Software Lead · Swift / SwiftUI",
    timeframe: "Spring 2021 · 120 hrs",
    stack: ["Swift", "SwiftUI", "iOS", "UIKit"],
    image: "https://i.imgur.com/138wx8D.png",
    links: [
      { label: "Case study", href: "/project/1", internal: true, primary: true },
      { label: "App Store", href: "https://apps.apple.com/us/app/social-ring/id1551446005", external: true },
      { label: "Website", href: "https://www.social-ring.com/", external: true },
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
    stack: ["Node.js", "Next.js", "AWS", "MySQL", "Redux"],
    image: "https://i.imgur.com/9k4vVxL.png",
    links: [
      { label: "Case study", href: "/project/2", internal: true, primary: true },
      { label: "goaimly.com", href: "https://goaimly.com/", external: true },
    ],
  },
];

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

const Section = styled.section`
  position: relative;
  width: 100%;
  background: #0f1216;
  padding: 120px 24px;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: 720px) {
    padding: 80px 18px;
  }
`;

const BgGlow = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      40% 35% at 80% 10%,
      rgba(32, 106, 93, 0.1),
      transparent 70%
    ),
    radial-gradient(
      40% 35% at 20% 90%,
      rgba(32, 106, 93, 0.07),
      transparent 70%
    );
  pointer-events: none;
  z-index: 0;
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 80px;

  @media (max-width: 720px) {
    margin-bottom: 56px;
  }
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
  margin-bottom: 16px;

  &::before,
  &::after {
    content: "";
    width: 24px;
    height: 1px;
    background: #5bb39e;
    opacity: 0.6;
  }
`;

const Heading = styled.h2`
  font-family: "Lato", sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 52px);
  line-height: 1.08;
  letter-spacing: -0.022em;
  color: #f4f6f8;
  margin: 0 0 14px;
`;

const Tagline = styled.p`
  font-family: "Lato", sans-serif;
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.55;
  color: #a3acb2;
  max-width: 560px;
  margin: 0 auto;
`;

const Showcase = styled.div`
  display: flex;
  flex-direction: column;
  gap: 96px;

  @media (max-width: 900px) {
    gap: 64px;
  }
`;

const Row = styled.article`
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 56px;
  align-items: center;

  ${({ reverse }) =>
    reverse &&
    `
    direction: rtl;
    > * { direction: ltr; }
  `}

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
    direction: ltr;
  }
`;

const Media = styled(Link)`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 16px;
  overflow: hidden;
  background: #14191e;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s ease, border-color 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 50%,
      rgba(15, 18, 22, 0.45) 100%
    );
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(91, 179, 158, 0.25);
    box-shadow:
      0 32px 100px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(91, 179, 158, 0.12) inset;
  }

  &:hover img {
    transform: scale(1.03);
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
  background: rgba(15, 18, 22, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #d2d8da;

  &::before {
    content: "";
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #5bb39e;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
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
  font-size: clamp(24px, 2.6vw, 32px);
  line-height: 1.15;
  letter-spacing: -0.018em;
  color: #f4f6f8;
  margin: 0;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  color: #6b7479;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  span + span::before {
    content: "·";
    margin-right: 8px;
    color: #4d5559;
  }
`;

const Description = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 15px;
  line-height: 1.65;
  color: #a3acb2;
  margin: 0;
`;

const Stack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
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

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const linkBase = `
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: transform 0.12s ease, background 0.18s ease,
    border-color 0.18s ease, color 0.18s ease;
`;

const PrimaryLink = styled(Link)`
  ${linkBase}
  background: #206a5d;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 6px 18px rgba(32, 106, 93, 0.28);

  &::after {
    content: "→";
    transition: transform 0.18s ease;
  }
  &:hover {
    background: #267a6b;
    color: #ffffff;
    text-decoration: none;
    transform: translateY(-1px);
  }
  &:hover::after {
    transform: translateX(3px);
  }
`;

const GhostLink = styled.a`
  ${linkBase}
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  border: 1px solid rgba(255, 255, 255, 0.12);

  &::after {
    content: "↗";
    font-size: 12px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    text-decoration: none;
    border-color: rgba(255, 255, 255, 0.22);
    transform: translateY(-1px);
  }
`;

const Footer = styled.div`
  margin-top: 96px;
  text-align: center;

  @media (max-width: 720px) {
    margin-top: 64px;
  }
`;

const FooterText = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 14px;
  color: #6b7479;
  margin: 0 0 16px;
  letter-spacing: 0.01em;
`;

const FooterCTA = styled.a`
  ${linkBase}
  background: transparent;
  color: #d2d8da;
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 14px 22px;
  font-size: 14px;

  &::after {
    content: "↗";
    transition: transform 0.18s ease;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
    text-decoration: none;
    border-color: rgba(91, 179, 158, 0.35);
  }
  &:hover::after {
    transform: translate(2px, -2px);
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

function ProjectHighlight() {
  const showcase = SHOWCASE.filter((s) => projectData.some((p) => p.id === s.id));

  return (
    <Section>
      <BgGlow />
      <Shell>
        <Header>
          <Kicker>Work</Kicker>
          <Heading>Selected systems.</Heading>
          <Tagline>
            Products I've designed and built end-to-end — from API architecture
            to the interface someone actually clicks.
          </Tagline>
        </Header>

        <Showcase>
          {showcase.map((project, idx) => {
            const reverse = idx % 2 === 1;
            return (
              <Row key={project.id} reverse={reverse}>
                <Media to={`/project/${project.id}`} aria-label={`Open ${project.title} case study`}>
                  <MediaBadge>{project.role.split("·")[0].trim()}</MediaBadge>
                  <MediaImg src={project.image} alt={project.title} loading="lazy" />
                </Media>

                <Content>
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
                  <Links>
                    {project.links.map((link) =>
                      link.internal ? (
                        <PrimaryLink key={link.label} to={link.href}>
                          {link.label}
                        </PrimaryLink>
                      ) : (
                        <GhostLink
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.label}
                        </GhostLink>
                      )
                    )}
                  </Links>
                </Content>
              </Row>
            );
          })}
        </Showcase>

        <Footer>
          <FooterText>More work outside this site</FooterText>
          <FooterCTA
            href="http://www.dominiquehosea.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit full portfolio
          </FooterCTA>
        </Footer>
      </Shell>
    </Section>
  );
}

export default ProjectHighlight;
