import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

/* ------------------------------------------------------------------
   Shared card components for the Case Studies index and section pages.

   - CaseStudyCard: a single case study (text-forward, no media).
   - SectionCard:   a "collection" card linking to a section landing
                    page that groups several case studies.

   Both mirror the dark theme and the Projects-page card system.
------------------------------------------------------------------ */

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
    border-color: rgba(91, 179, 158, 0.55);
    transform: translateY(-6px);
    box-shadow: 0 22px 55px rgba(0, 0, 0, 0.45),
      0 0 0 1px rgba(91, 179, 158, 0.25);
    text-decoration: none;
  }

  /* "Read case study" arrow slides on card hover */
  &:hover .arrow {
    transform: translateX(6px);
    color: #7fd0bc;
  }

  /* Stacked-paper edge to signal a "collection" on section cards */
  ${(props) =>
    props.section &&
    `
    &::before,
    &::after {
      content: "";
      position: absolute;
      left: 12px;
      right: 12px;
      top: -6px;
      height: 6px;
      border-radius: 8px 8px 0 0;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-bottom: none;
      z-index: -1;
    }
    &::after {
      left: 24px;
      right: 24px;
      top: -11px;
      background: rgba(255, 255, 255, 0.03);
    }
    margin-top: 11px;
  `}
`;

const AccentBar = styled.div`
  height: 4px;
  width: 100%;
  background: linear-gradient(90deg, #206a5d 0%, #5bb39e 100%);
  opacity: 0.9;
`;

const Body = styled.div`
  padding: 30px 28px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  flex: 1;

  @media (max-width: 720px) {
    padding: 24px 22px;
  }
`;

const Eyebrow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;
`;

const SectionTag = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid rgba(91, 179, 158, 0.35);
  background: rgba(91, 179, 158, 0.08);
  font-size: 10px;
  letter-spacing: 0.16em;
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

const Focus = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 12.5px;
  line-height: 1.5;
  font-weight: 500;
  color: #c5cbcf;
  margin: -4px 0 0;
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
  margin-top: auto;
  padding-top: 16px;
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
    display: inline-block;
    transition: transform 0.2s ease, color 0.2s ease;
  }
`;

/* A single case study card */
const CaseStudyCard = ({ study, to }) => (
  <Card to={to}>
    <AccentBar />
    <Body>
      <Eyebrow>{study.eyebrow}</Eyebrow>
      <Title>{study.title}</Title>
      <Meta>
        <span>{study.role}</span>
        <span>{study.timeframe}</span>
      </Meta>
      {study.focus && <Focus>{study.focus}</Focus>}
      <Description>{study.description}</Description>
      {study.technologies?.length > 0 && (
        <Stack>
          {study.technologies.slice(0, 6).map((t) => (
            <Pill key={t}>{t}</Pill>
          ))}
          {study.technologies.length > 6 && (
            <Pill>+{study.technologies.length - 6}</Pill>
          )}
        </Stack>
      )}
      <Footer>
        <span>Read case study</span>
        <span className="">→</span>
      </Footer>
    </Body>
  </Card>
);

/* A section (collection) card linking to a group landing page */
export const SectionCard = ({ group, count, to }) => (
  <Card section to={to}>
    <AccentBar />
    <Body>
      <Eyebrow>
        {group.eyebrow}
        <SectionTag>Section</SectionTag>
      </Eyebrow>
      <Title>{group.title}</Title>
      <Description>{group.description}</Description>
      <Footer>
        <span>
          {count} case {count === 1 ? "study" : "studies"}
        </span>
        <span className="arrow">→</span>
      </Footer>
    </Body>
  </Card>
);

export default CaseStudyCard;
