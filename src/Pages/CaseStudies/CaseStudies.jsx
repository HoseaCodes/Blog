import React from "react";
import styled from "styled-components";
import {
  caseStudyData,
  caseStudyGroups,
  caseStudyPath,
  groupPath,
} from "./CaseStudiesData";
import CaseStudyCard, { SectionCard } from "./CaseStudyCard";

/* ------------------------------------------------------------------
   Case Studies index. Mirrors the styling of Projects.jsx (same dark
   theme + hero). Renders standalone case studies as text-forward cards
   plus a "section" card for each group (a collection of related case
   studies with its own landing page). Cards live in CaseStudyCard.jsx.
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
  max-width: 600px;
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

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const CaseStudies = () => {
  const standalone = caseStudyData.filter((c) => !c.group);

  return (
    <Page>
      <Hero>
        <HeroGlow />
        <HeroGrid />
        <HeroInner>
          <Kicker>Case Studies</Kicker>
          <Heading>Engineering case studies.</Heading>
          <Tagline>
            In-depth, sanitized write-ups of the systems I've owned — the
            architecture decisions, reliability tradeoffs, and engineering
            judgment behind production software at scale.
          </Tagline>
          <Counts>
            <span>
              <span className="num">{caseStudyData.length}</span> case studies
            </span>
            <span className="dot" />
            <span>Backend · Platform · Reliability</span>
          </Counts>
        </HeroInner>
      </Hero>

      <Grid>
        {standalone.map((study) => (
          <CaseStudyCard
            key={study.id}
            study={study}
            to={caseStudyPath(study)}
          />
        ))}
        {caseStudyGroups.map((group) => (
          <SectionCard
            key={group.slug}
            group={group}
            count={
              caseStudyData.filter((c) => c.group === group.slug).length
            }
            to={groupPath(group)}
          />
        ))}
      </Grid>
    </Page>
  );
};

export default CaseStudies;
