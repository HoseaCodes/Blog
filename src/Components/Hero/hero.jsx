import React from "react";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import Scramble from "../Scramble/Scramble";

const WIREFRAME_BG =
  "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/wireframe-min.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

const shimmer = keyframes`
  0%, 100% { opacity: 0.55; }
  50%      { opacity: 0.85; }
`;

const Section = styled.section`
  position: relative;
  width: 100%;
  min-height: 92vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: #0f1216;
  isolation: isolate;
`;

const BgImage = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${WIREFRAME_BG});
  background-size: cover;
  background-position: center;
  filter: grayscale(0.6) contrast(1.05);
  opacity: 0.32;
  z-index: 0;
`;

const BgGradient = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 50% at 50% 35%, rgba(32, 106, 93, 0.18), transparent 70%),
    linear-gradient(180deg, rgba(15, 18, 22, 0.5) 0%, rgba(15, 18, 22, 0.85) 60%, #0f1216 100%);
  z-index: 1;
`;

const BgGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 50%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, #000 50%, transparent 100%);
  z-index: 2;
  animation: ${shimmer} 8s ease-in-out infinite;
`;

const Content = styled.div`
  position: relative;
  z-index: 3;
  width: 100%;
  max-width: 1080px;
  padding: 96px 24px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;

  @media (max-width: 640px) {
    padding: 72px 20px 64px;
    gap: 18px;
  }
`;

const Kicker = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #9bd4c4;
  padding: 7px 14px;
  border: 1px solid rgba(32, 106, 93, 0.45);
  border-radius: 999px;
  background: rgba(32, 106, 93, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #34d39a;
    box-shadow: 0 0 10px #34d39a;
  }
`;

const Heading = styled(motion.h1)`
  font-family: "Lato", sans-serif;
  font-weight: 800;
  font-size: clamp(44px, 8vw, 88px);
  line-height: 1.02;
  letter-spacing: -0.025em;
  color: #f4f6f8;
  margin: 0;

  span {
    background: linear-gradient(180deg, #ffffff 0%, #c9d3d6 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  em {
    font-style: normal;
    color: #5bb39e;
  }
`;

const Tagline = styled(motion.p)`
  font-family: "Lato", sans-serif;
  font-size: clamp(16px, 1.6vw, 19px);
  font-weight: 400;
  line-height: 1.55;
  color: #a3acb2;
  max-width: 640px;
  margin: 0;
  letter-spacing: -0.005em;
`;

const RoleChipWrap = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  letter-spacing: 0.08em;
  color: #d2d8da;

  .label {
    color: #6b7479;
    font-weight: 500;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.16em;
  }

  && .header-career {
    color: #f4f6f8 !important;
    font-weight: 600 !important;
    letter-spacing: 0.1em !important;
    text-transform: uppercase !important;
    font-size: 13px !important;
    line-height: 1 !important;
    margin: 0 !important;
    display: inline-block !important;
    text-align: left !important;
    font-family: "Lato", sans-serif !important;
  }
`;

const CTARow = styled(motion.div)`
  display: flex;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: 480px) {
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
  padding: 13px 22px;
  border-radius: 10px;
  background: #206a5d;
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.08) inset, 0 8px 24px rgba(32, 106, 93, 0.3);
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: #267a6b;
    color: #ffffff;
    text-decoration: none;
    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.1) inset, 0 12px 28px rgba(32, 106, 93, 0.42);
  }

  &::after {
    content: "→";
    font-size: 15px;
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
  padding: 13px 22px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: transform 0.18s ease, background 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
    text-decoration: none;
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

const ScrollHint = styled(motion.div)`
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #4d5559;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;

  .line {
    width: 1px;
    height: 32px;
    background: linear-gradient(to bottom, transparent, #4d5559);
  }
`;

const Hero = ({ username }) => {
  const firstName = username?.firstName || "Dominique";
  const lastName = username?.lastName || "Hosea";

  return (
    <Section id="top">
      <BgImage />
      <BgGradient />
      <BgGrid />

      <Content>
        <Kicker
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Backend · Systems · Founder
        </Kicker>

        <Heading variants={fadeUp} initial="hidden" animate="visible" custom={1}>
          <span>
            {firstName} {lastName}.
          </span>
          <br />
          Building <em>scalable systems</em> that ship.
        </Heading>

        <Tagline variants={fadeUp} initial="hidden" animate="visible" custom={2}>
          Backend engineer and builder focused on AI-driven products, distributed
          systems, and the kind of infrastructure that lets small teams move like
          large ones.
        </Tagline>

        <RoleChipWrap
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <span className="label">Currently</span>
          <Scramble />
        </RoleChipWrap>

        <CTARow variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <PrimaryCTA href="#projects">View work</PrimaryCTA>
          <GhostCTA href="#contact">Get in touch</GhostCTA>
        </CTARow>
      </Content>

      <ScrollHint
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        Scroll
        <span className="line" />
      </ScrollHint>
    </Section>
  );
};

export default Hero;
