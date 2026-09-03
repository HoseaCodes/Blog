import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import GithubBreakdown from "./GithubBreakdown";
import {
  GITHUB_PROFILE,
  GITHUB_CATALOG_UPDATED,
} from "../../Constants/githubRepos";

/*
  Detail view for a project record carrying `customView: "github-breakdown"`.

  Reached through the ordinary /project/:id route — ProjectItem picks the view
  out of the registry in projectViews.js. This file never names a slug, so the
  URL is whatever the record's `slug` says it is.

  Copy comes from the record (name, headline, description) so it stays editable
  the way every other project's copy is; the literals below are only fallbacks
  for a record that omits a field.
*/

const Page = styled.div`
  background: #0f1216;
  min-height: 100vh;
`;

const Hero = styled.section`
  position: relative;
  width: 100%;
  padding: 140px 24px 56px;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: 720px) {
    padding: 96px 18px 40px;
  }
`;

const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 0 0;
`;

const BackLink = styled(Link)`
  /* Block-level flex, not inline-flex: the Kicker below is inline-flex and
     would otherwise sit on the same line, reading "ALL PROJECTS — OPEN SOURCE"
     as one run. */
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 8px;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6b7479;
  text-decoration: none;
  margin-bottom: 28px;
  transition: color 0.2s ease;

  &:hover {
    color: #5bb39e;
    text-decoration: none;
  }
  /* Scoped name on purpose: games.css defines a global \`.arrow\`. */
  .back-arrow {
    transition: transform 0.18s ease;
  }
  &:hover .back-arrow {
    transform: translateX(-3px);
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

  &::before {
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
  font-size: clamp(34px, 5vw, 60px);
  line-height: 1.06;
  letter-spacing: -0.028em;
  color: #f4f6f8;
  margin: 0 0 18px;
`;

const Lede = styled.p`
  font-family: "Lato", sans-serif;
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.65;
  color: #a3acb2;
  max-width: 720px;
  margin: 0;

  a {
    color: #5bb39e;
    text-decoration: none;
    border-bottom: 1px solid rgba(91, 179, 158, 0.35);
  }
  a:hover {
    border-bottom-color: #5bb39e;
  }
`;

const Refreshed = styled.div`
  margin-top: 22px;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  color: #6b7479;
  letter-spacing: 0.02em;
`;

const GithubBreakdownView = ({ project }) => {
  // ProjectItem has already scrolled to the top for us — it runs the same
  // window.scrollTo on mount for every project, this one included.
  const heading = project?.headline || "The GitHub breakdown.";
  const eyebrow = project?.eyebrow || "Open source";
  const lede = project?.description;

  return (
    <Page>
      <Hero>
        <HeroGlow />
        <HeroGrid />
        <HeroInner>
          <BackLink to="/project">
            <span className="back-arrow">←</span> All projects
          </BackLink>
          <Kicker>{eyebrow}</Kicker>
          <Heading>{heading}</Heading>
          <Lede>
            {lede || (
              <>
                Every public repository on{" "}
                <a
                  href={GITHUB_PROFILE}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  github.com/HoseaCodes
                </a>{" "}
                — products, platform work, and the reference forks I learn
                from — grouped by what each one actually does.
              </>
            )}
          </Lede>
          <Refreshed>Catalog last refreshed {GITHUB_CATALOG_UPDATED}</Refreshed>
        </HeroInner>
      </Hero>

      <GithubBreakdown />
    </Page>
  );
};

export default GithubBreakdownView;
