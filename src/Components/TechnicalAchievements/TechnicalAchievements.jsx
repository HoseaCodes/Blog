import React from "react";
import styled from "styled-components";
import { FiShield, FiZap, FiLayers } from "react-icons/fi";

const ACHIEVEMENTS = [
  {
    icon: <FiShield />,
    metric: "2M+",
    metricLabel: "Daily Requests",
    title: "High-Scale Authentication",
    description:
      "Architected and implemented distributed auth systems handling millions of concurrent users with 99.99% uptime.",
  },
  {
    icon: <FiZap />,
    metric: "40%",
    metricLabel: "Latency Reduction",
    title: "System Performance",
    description:
      "Optimized microservices architecture and implemented OpenTelemetry observability, significantly improving response times.",
  },
  {
    icon: <FiLayers />,
    metric: "Enterprise",
    metricLabel: "Scale",
    title: "Infrastructure Modernization",
    description:
      "Led migration from monolithic to microservices architecture, enabling better scalability and development velocity.",
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
  background: radial-gradient(
    60% 50% at 50% 100%,
    rgba(32, 106, 93, 0.1),
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

const Card = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  transition: border-color 0.25s ease, transform 0.25s ease,
    background 0.25s ease;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      80% 40% at 50% 0%,
      rgba(91, 179, 158, 0.06),
      transparent 70%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: rgba(91, 179, 158, 0.22);
    transform: translateY(-3px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.035) 0%,
      rgba(255, 255, 255, 0.015) 100%
    );
  }
  &:hover::before {
    opacity: 1;
  }

  @media (max-width: 720px) {
    padding: 26px;
    gap: 20px;
  }
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(91, 179, 158, 0.08);
  border: 1px solid rgba(91, 179, 158, 0.18);
  color: #5bb39e;
  font-size: 18px;
  flex-shrink: 0;
`;

const MetricBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Metric = styled.span`
  font-family: "Lato", sans-serif;
  font-weight: 800;
  font-size: clamp(40px, 5vw, 56px);
  line-height: 1;
  letter-spacing: -0.03em;
  background: linear-gradient(180deg, #f4f6f8 0%, #9bd4c4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const MetricLabel = styled.span`
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6b7479;
`;

const Divider = styled.span`
  width: 32px;
  height: 1px;
  background: rgba(91, 179, 158, 0.3);
`;

const CardTitle = styled.h3`
  font-family: "Lato", sans-serif;
  font-weight: 600;
  font-size: 17px;
  line-height: 1.3;
  letter-spacing: -0.005em;
  color: #f4f6f8;
  margin: 0;
`;

const CardDesc = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const TechnicalAchievements = () => {
  return (
    <Section>
      <BgAccent />
      <Shell>
        <Header>
          <Kicker>Impact</Kicker>
          <Heading>Built for scale.</Heading>
          <Tagline>
            What I've shipped in production — measurable outcomes, not
            line items.
          </Tagline>
        </Header>

        <Grid>
          {ACHIEVEMENTS.map((a) => (
            <Card key={a.title}>
              <IconWrap>{a.icon}</IconWrap>
              <MetricBlock>
                <Metric>{a.metric}</Metric>
                <MetricLabel>{a.metricLabel}</MetricLabel>
              </MetricBlock>
              <Divider />
              <div>
                <CardTitle>{a.title}</CardTitle>
                <CardDesc style={{ marginTop: 10 }}>{a.description}</CardDesc>
              </div>
            </Card>
          ))}
        </Grid>
      </Shell>
    </Section>
  );
};

export default TechnicalAchievements;
