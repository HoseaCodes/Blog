import React from "react";
import styled from "styled-components";
import {
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FiArrowUp, FiArrowUpRight, FiMail } from "react-icons/fi";

const EMAIL = "mr.dhosea@gmail.com";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dominique-hosea",
    icon: <FaLinkedinIn />,
  },
  {
    label: "GitHub",
    href: "https://github.com/HoseaCodes",
    icon: <FaGithub />,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/DominiqueRHosea",
    icon: <FaTwitter />,
  },
  {
    label: "Portfolio",
    href: "https://www.dominiquehosea.com",
    icon: <FaExternalLinkAlt />,
  },
];

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

const Section = styled.section`
  position: relative;
  width: 100%;
  background: #0f1216;
  padding: 140px 24px 96px;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: 720px) {
    padding: 96px 18px 64px;
  }
`;

const BgGlow = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      55% 60% at 50% 30%,
      rgba(32, 106, 93, 0.16),
      transparent 70%
    );
  pointer-events: none;
  z-index: 0;
`;

const BgGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(
    ellipse 60% 70% at 50% 40%,
    #000 30%,
    transparent 100%
  );
  -webkit-mask-image: radial-gradient(
    ellipse 60% 70% at 50% 40%,
    #000 30%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 0;
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 28px;
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
  font-size: clamp(36px, 5.5vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.028em;
  color: #f4f6f8;
  margin: 0;
`;

const Tagline = styled.p`
  font-family: "Lato", sans-serif;
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.6;
  color: #a3acb2;
  max-width: 540px;
  margin: 0;
`;

const PrimaryCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
  margin-top: 12px;
  padding: 28px;
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    rgba(91, 179, 158, 0.06) 0%,
    rgba(91, 179, 158, 0.02) 100%
  );
  border: 1px solid rgba(91, 179, 158, 0.18);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(91, 179, 158, 0.04) inset;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;

  @media (max-width: 480px) {
    padding: 22px;
    gap: 14px;
  }
`;

const EmailRow = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(15, 18, 22, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-family: "Lato", sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #f4f6f8;
  text-decoration: none;
  letter-spacing: -0.005em;
  transition: border-color 0.2s ease, background 0.2s ease;

  svg {
    color: #5bb39e;
    font-size: 15px;
    flex-shrink: 0;
  }

  &:hover {
    border-color: rgba(91, 179, 158, 0.4);
    background: rgba(15, 18, 22, 0.7);
    color: #ffffff;
    text-decoration: none;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 9px 14px;
  }
`;

const SendButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 24px;
  border-radius: 10px;
  background: #206a5d;
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 26px rgba(32, 106, 93, 0.35);
  transition: background 0.18s ease, transform 0.12s ease,
    box-shadow 0.18s ease;

  &::after {
    content: "→";
    font-size: 14px;
    transition: transform 0.18s ease;
  }

  &:hover {
    background: #267a6b;
    color: #ffffff;
    text-decoration: none;
    transform: translateY(-1px);
    box-shadow: 0 12px 30px rgba(32, 106, 93, 0.45);
  }
  &:hover::after {
    transform: translateX(3px);
  }
`;

const Socials = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

const SocialBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: background 0.18s ease, border-color 0.18s ease,
    transform 0.12s ease, color 0.18s ease;

  svg {
    font-size: 14px;
    color: #a3acb2;
    transition: color 0.18s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    border-color: rgba(91, 179, 158, 0.3);
    transform: translateY(-1px);
    text-decoration: none;
  }
  &:hover svg {
    color: #5bb39e;
  }
`;

const BackToTop = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 14px;
  border-radius: 8px;
  background: transparent;
  color: #6b7479;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  border: 1px solid transparent;
  transition: color 0.18s ease, border-color 0.18s ease;
  margin-top: 32px;

  svg {
    font-size: 12px;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: #d2d8da;
    border-color: rgba(255, 255, 255, 0.08);
    text-decoration: none;
  }
  &:hover svg {
    transform: translateY(-2px);
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const ContactCTA = () => {
  return (
    <Section id="contact">
      <BgGlow />
      <BgGrid />
      <Shell>
        <Kicker>Contact</Kicker>

        <Heading>Let's build something.</Heading>

        <Tagline>
          Available for select engagements — backend systems, AI products,
          and infrastructure work. Drop a line and let's talk.
        </Tagline>

        <PrimaryCard>
          <EmailRow href={`mailto:${EMAIL}`}>
            <FiMail />
            {EMAIL}
          </EmailRow>
          <SendButton href={`mailto:${EMAIL}?subject=Hello%20Dominique`}>
            Send a message
          </SendButton>
        </PrimaryCard>

        <Socials>
          {SOCIALS.map((s) => (
            <SocialBtn
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
            >
              {s.icon}
              {s.label}
            </SocialBtn>
          ))}
        </Socials>

        <BackToTop href="#top">
          <FiArrowUp />
          Back to top
        </BackToTop>
      </Shell>
    </Section>
  );
};

export default ContactCTA;
