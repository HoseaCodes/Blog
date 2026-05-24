import React from "react";
import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";

const PORTRAIT =
  "/hosea.jpg";
const RESUME =
  "https://d2nrcsymqn25pk.cloudfront.net/Assets/PDFs/Resume2020.pdf";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const pulseDot = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.4); opacity: 0.55; }
`;

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
  background: radial-gradient(
    50% 40% at 50% 0%,
    rgba(32, 106, 93, 0.12),
    transparent 70%
  );
  z-index: 0;
  pointer-events: none;
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(260px, 360px) 1fr;
  gap: 64px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
    justify-items: center;
    text-align: center;
  }
`;

const PortraitFrame = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  max-width: 360px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 40%,
      rgba(15, 18, 22, 0.55) 100%
    );
    pointer-events: none;
  }
`;

const Portrait = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: grayscale(0.18) contrast(1.04);
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 640px;

  @media (max-width: 900px) {
    align-items: center;
  }
`;

const Kicker = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;

  &::before {
    content: "";
    width: 24px;
    height: 1px;
    background: #5bb39e;
  }
`;

const Heading = styled(motion.h2)`
  font-family: "Lato", sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 52px);
  line-height: 1.08;
  letter-spacing: -0.022em;
  color: #f4f6f8;
  margin: 0;

  em {
    font-style: normal;
    color: #5bb39e;
  }
`;

const Bio = styled(motion.p)`
  font-family: "Lato", sans-serif;
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.65;
  color: #a3acb2;
  margin: 0;
`;

const Timeline = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 4px;
  width: 100%;

  @media (max-width: 900px) {
    max-width: 480px;
  }
`;

const Role = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  transition: border-color 0.18s ease, background 0.18s ease;
  text-align: left;

  &:hover {
    border-color: rgba(91, 179, 158, 0.25);
    background: rgba(91, 179, 158, 0.04);
  }
`;

const RoleDot = styled.span`
  flex-shrink: 0;
  margin-top: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ current }) => (current ? "#5bb39e" : "#4d5559")};
  box-shadow: ${({ current }) =>
    current ? "0 0 12px rgba(91, 179, 158, 0.6)" : "none"};
  animation: ${({ current }) =>
    current ? css`${pulseDot} 2.4s ease-in-out infinite` : "none"};
`;

const RoleBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;

  .label {
    font-family: "Lato", sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: ${({ current }) => (current ? "#5bb39e" : "#6b7479")};
  }

  .title {
    font-family: "Lato", sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #f4f6f8;
    letter-spacing: -0.005em;
    margin-top: 4px;
  }

  .meta {
    font-family: "Lato", sans-serif;
    font-size: 13px;
    color: #6b7479;
    margin-top: 2px;
    letter-spacing: 0.01em;
  }
`;

const Tags = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;

  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const Tag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 5px 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.02);
  font-family: "Lato", sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: #d2d8da;
`;

const CTARow = styled(motion.div)`
  display: flex;
  gap: 12px;
  margin-top: 12px;
  flex-wrap: wrap;

  @media (max-width: 900px) {
    justify-content: center;
  }
  @media (max-width: 420px) {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }
`;

const PrimaryCTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  background: #206a5d;
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 22px rgba(32, 106, 93, 0.28);
  transition: background 0.18s ease, transform 0.12s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: #267a6b;
    color: #ffffff;
    text-decoration: none;
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(32, 106, 93, 0.4);
  }

  &::after {
    content: "→";
    font-size: 14px;
    transition: transform 0.18s ease;
  }
  &:hover::after {
    transform: translateX(3px);
  }
`;

const GhostCTA = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: background 0.18s ease, transform 0.12s ease,
    border-color 0.18s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    text-decoration: none;
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.22);
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const ROLES = [
  {
    label: "Currently",
    title: "Software Engineer · State Farm",
    meta: "Dallas, TX · 2021 → Present",
    current: true,
  },
  {
    label: "Previously",
    title: "Lead Backend Engineer · Aimly",
    meta: "Austin, TX · Serverless AWS / Node",
    current: false,
  },
];

const STACK = [
  "Node.js",
  "TypeScript",
  "Python",
  "AWS Lambda",
  "DynamoDB",
  "React",
  "MongoDB",
  "CI / CD",
];

const PersonalBrand = () => {
  return (
    <Section id="aboutme">
      <BgGlow />
      <Shell>
        <PortraitFrame
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          <Portrait src={PORTRAIT} alt="Dominique Hosea" />
        </PortraitFrame>

        <Content>
          <Kicker
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            About
          </Kicker>

          <Heading
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            Engineer shipping <em>enterprise-grade</em> systems since 2021.
          </Heading>

          <Bio
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            Full-stack engineer with a backend focus — building maintainable
            distributed systems, serverless AWS infrastructure, and the kind of
            internal tooling that lets product teams ship faster. Comfortable
            across MERN, Python, TypeScript, and the cloud architecture that
            holds it all together.
          </Bio>

          <Timeline
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            {ROLES.map((r) => (
              <Role key={r.title}>
                <RoleDot current={r.current ? 1 : 0} />
                <RoleBody current={r.current ? 1 : 0}>
                  <span className="label">{r.label}</span>
                  <span className="title">{r.title}</span>
                  <span className="meta">{r.meta}</span>
                </RoleBody>
              </Role>
            ))}
          </Timeline>

          <Tags
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={5}
          >
            {STACK.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </Tags>

          <CTARow
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={6}
          >
            <PrimaryCTA href="/about">Read full story</PrimaryCTA>
            <GhostCTA href={RESUME} target="_blank" rel="noopener noreferrer">
              Download resume
            </GhostCTA>
          </CTARow>
        </Content>
      </Shell>
    </Section>
  );
};

export default PersonalBrand;
