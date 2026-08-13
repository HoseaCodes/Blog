import React from "react";
import styled from "styled-components";

const ARTICLES = [
  {
    id: 1,
    title: "Scaling Authentication Systems to Handle 2M+ Daily Requests",
    excerpt:
      "Deep dive into distributed authentication architecture, implementing OpenTelemetry observability, and managing high-scale user sessions across microservices.",
    readTime: "8 min read",
    date: "Dec 10, 2024",
    category: "Distributed Systems",
    link: "/blog/scaling-authentication-systems",
  },
  {
    id: 2,
    title: "Microservices Observability: OpenTelemetry Implementation Guide",
    excerpt:
      "Complete walkthrough of implementing distributed tracing, metrics collection, and logging strategies for production microservices at enterprise scale.",
    readTime: "12 min read",
    date: "Dec 5, 2024",
    category: "Observability",
    link: "/blog/microservices-observability",
  },
  {
    id: 3,
    title: "Infrastructure Modernization: Monolith to Microservices Migration",
    excerpt:
      "Strategic approach to breaking down legacy systems, handling data consistency, and ensuring zero-downtime deployments during architecture transitions.",
    readTime: "15 min read",
    date: "Nov 28, 2024",
    category: "Architecture",
    link: "/blog/monolith-to-microservices",
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

const BgAccent = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.022) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(
    ellipse 70% 60% at 50% 50%,
    #000 30%,
    transparent 100%
  );
  -webkit-mask-image: radial-gradient(
    ellipse 70% 60% at 50% 50%,
    #000 30%,
    transparent 100%
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
  margin-bottom: 72px;

  @media (max-width: 720px) {
    margin-bottom: 48px;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const Card = styled.a`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.25s ease, transform 0.25s ease,
    background 0.25s ease;
  overflow: hidden;
  min-height: 280px;

  &::after {
    content: "→";
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 16px;
    color: #5bb39e;
    opacity: 0;
    transform: translate(-8px, 0);
    transition: opacity 0.22s ease, transform 0.22s ease;
  }

  &:hover {
    border-color: rgba(91, 179, 158, 0.25);
    transform: translateY(-3px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.035) 0%,
      rgba(255, 255, 255, 0.012) 100%
    );
    text-decoration: none;
    color: inherit;
  }
  &:hover::after {
    opacity: 1;
    transform: translate(0, 0);
  }
  &:hover .title {
    color: #ffffff;
  }
`;

const Category = styled.span`
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(91, 179, 158, 0.1);
  border: 1px solid rgba(91, 179, 158, 0.25);
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #5bb39e;
`;

const Title = styled.h3.attrs({ className: "title" })`
  font-family: "Lato", sans-serif;
  font-weight: 600;
  font-size: 19px;
  line-height: 1.32;
  letter-spacing: -0.012em;
  color: #f4f6f8;
  margin: 0;
  transition: color 0.18s ease;

  /* Clamp to 3 lines so cards have consistent height */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Excerpt = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;
  flex: 1;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: "Lato", sans-serif;
  font-size: 12px;
  color: #6b7479;
  letter-spacing: 0.01em;

  .dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #4d5559;
  }

  .read {
    color: #5bb39e;
    font-weight: 500;
  }
`;

const Footer = styled.div`
  margin-top: 64px;
  text-align: center;

  @media (max-width: 720px) {
    margin-top: 48px;
  }
`;

const FooterCTA = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 22px;
  border-radius: 10px;
  background: transparent;
  color: #d2d8da;
  border: 1px solid rgba(255, 255, 255, 0.16);
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  transition: background 0.18s ease, border-color 0.18s ease,
    transform 0.12s ease, color 0.18s ease;

  &::after {
    content: "→";
    transition: transform 0.18s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
    text-decoration: none;
    border-color: rgba(91, 179, 158, 0.35);
    transform: translateY(-1px);
  }
  &:hover::after {
    transform: translateX(3px);
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const RecentArticles = () => {
  return (
    <Section>
      <BgAccent />
      <Shell>
        <Header>
          <Kicker>Writing</Kicker>
          <Heading>Latest thinking.</Heading>
          <Tagline>
            Notes on distributed systems, observability, and the kind of
            infrastructure that runs in production.
          </Tagline>
        </Header>

        <Grid>
          {ARTICLES.map((article) => (
            <Card key={article.id} href={article.link}>
              <Category>{article.category}</Category>
              <Title>{article.title}</Title>
              <Excerpt>{article.excerpt}</Excerpt>
              <Meta>
                <span>{article.date}</span>
                <span className="dot" />
                <span className="read">{article.readTime}</span>
              </Meta>
            </Card>
          ))}
        </Grid>

        <Footer>
          <FooterCTA href="/blog">View all articles</FooterCTA>
        </Footer>
      </Shell>
    </Section>
  );
};

export default RecentArticles;
