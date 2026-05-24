import React, { useState, useContext, useEffect } from "react";
import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import {
  FiUsers,
  FiGlobe,
  FiCpu,
  FiCode,
  FiBookOpen,
  FiBox,
  FiBriefcase,
  FiArrowRight,
  FiArrowUpRight,
  FiCalendar,
  FiClock,
  FiMail,
  FiAward,
  FiTarget,
  FiBarChart2,
} from "react-icons/fi";
import MinimalResumeCTA from "../../Components/CTA/CareerCompose/MinimalResumeCTA.jsx";
import StateFarm from "../../Components/Banner/StateFarm.jsx";
import CaseStudyBanner from "../../Components/Banner/CaseStudyBanner.jsx";

/* ------------------------------------------------------------------
   Constants
------------------------------------------------------------------ */

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop";

const ENTERPRISE_CATEGORIES = {
  all: {
    label: "All Insights",
    icon: FiGlobe,
    subFilters: ["all", "featured", "trending", "recent"],
  },
  engineering: {
    label: "Engineering",
    icon: FiCode,
    subFilters: [
      "all",
      "architecture",
      "distributed-systems",
      "performance",
      "security",
      "devops",
    ],
  },
  leadership: {
    label: "Leadership",
    icon: FiUsers,
    subFilters: [
      "all",
      "management",
      "team-building",
      "strategy",
      "mentoring",
      "growth",
    ],
  },
  enterprise: {
    label: "Enterprise",
    icon: FiBox,
    subFilters: [
      "all",
      "scalability",
      "cloud",
      "microservices",
      "automation",
      "integration",
    ],
  },
  innovation: {
    label: "AI & Innovation",
    icon: FiCpu,
    subFilters: [
      "all",
      "machine-learning",
      "artificial-intelligence",
      "emerging-tech",
      "research",
    ],
  },
  career: {
    label: "Career",
    icon: FiBriefcase,
    subFilters: [
      "all",
      "skills",
      "interviews",
      "networking",
      "personal-brand",
      "transitions",
    ],
  },
};

const SUB_FILTER_LABELS = {
  all: "All",
  featured: "Featured",
  trending: "Trending",
  recent: "Recent",
  architecture: "Architecture",
  "distributed-systems": "Distributed Systems",
  performance: "Performance",
  security: "Security",
  devops: "DevOps",
  management: "Management",
  "team-building": "Team Building",
  strategy: "Strategy",
  mentoring: "Mentoring",
  growth: "Growth",
  scalability: "Scalability",
  cloud: "Cloud",
  microservices: "Microservices",
  automation: "Automation",
  integration: "Integration",
  "machine-learning": "ML",
  "artificial-intelligence": "AI",
  "emerging-tech": "Emerging Tech",
  research: "Research",
  skills: "Skills",
  interviews: "Interviews",
  networking: "Networking",
  "personal-brand": "Personal Brand",
  transitions: "Transitions",
};

const CATEGORY_DB_TO_UI = {
  "distributed-systems": "engineering",
  "identity-auth": "engineering",
  leadership: "leadership",
  "enterprise-architecture": "enterprise",
  devops: "enterprise",
  "ai-ml": "innovation",
  "career-growth": "career",
};

const PROFESSIONAL_TOPICS = [
  "Distributed Systems Architecture",
  "Engineering Leadership Excellence",
  "Enterprise AI Implementation",
  "Cloud Migration Strategies",
  "Team Scaling Best Practices",
];

const FALLBACK_EXPERTISE = [
  { number: "01", name: "Distributed Systems & Scalability" },
  { number: "02", name: "Identity & Authentication Platforms" },
  { number: "03", name: "Engineering Leadership & Team Building" },
  { number: "04", name: "Enterprise Architecture & Design Patterns" },
  { number: "05", name: "DevOps & Site Reliability Engineering" },
  { number: "06", name: "AI/ML Engineering & Production Systems" },
];

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

const Page = styled.div`
  background: #0f1216;
  min-height: 100vh;
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.section`
  position: relative;
  padding: 120px 24px;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: 720px) {
    padding: 80px 18px;
  }
`;

const TightSection = styled(Section)`
  padding: 64px 24px;

  @media (max-width: 720px) {
    padding: 48px 18px;
  }
`;

const InsightsBand = styled(TightSection)`
  background: #14191e;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding: 88px 24px;

  @media (max-width: 720px) {
    padding: 64px 18px;
  }
`;

const Kicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
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
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 52px);
  line-height: 1.08;
  letter-spacing: -0.022em;
  color: #f4f6f8;
  margin: 0 0 14px;

  em {
    font-style: normal;
    color: #5bb39e;
  }
`;

const Tagline = styled.p`
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.6;
  color: #a3acb2;
  max-width: 580px;
  margin: 0 auto;
`;

/* ---- Hero ---- */

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      55% 50% at 50% 0%,
      rgba(32, 106, 93, 0.16),
      transparent 70%
    ),
    linear-gradient(180deg, #0f1216 0%, #0f1216 100%);
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

const HeroShell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 64px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  align-items: flex-start;

  @media (max-width: 900px) {
    align-items: center;
  }
`;

const HeroTitle = styled(motion.h1)`
  font-weight: 800;
  font-size: clamp(40px, 6vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.028em;
  color: #f4f6f8;
  margin: 0;

  em {
    font-style: normal;
    color: #5bb39e;
  }
`;

const HeroExcerpt = styled(motion.p)`
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;
  max-width: 540px;
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(91, 179, 158, 0.1);
  border: 1px solid rgba(91, 179, 158, 0.28);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5bb39e;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #5bb39e;
    box-shadow: 0 0 10px rgba(91, 179, 158, 0.7);
  }
`;

const HeroActions = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
`;

const PrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 10px;
  background: #206a5d;
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(32, 106, 93, 0.28);
  transition: background 0.18s ease, transform 0.12s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: #267a6b;
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(32, 106, 93, 0.4);
  }
`;

const GhostBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: background 0.18s ease, transform 0.12s ease,
    border-color 0.18s ease, color 0.18s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.22);
  }
`;

const HeroVisual = styled(motion.div)`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  max-width: 540px;
  margin-left: auto;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 50%,
      rgba(15, 18, 22, 0.55) 100%
    );
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  @media (max-width: 900px) {
    margin-left: 0;
  }
`;

/* ---- Featured editorial block ---- */

const FeaturedShell = styled(Container)`
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const cardBase = css`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  cursor: pointer;
  transition: border-color 0.22s ease, transform 0.22s ease,
    background 0.22s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.25);
    transform: translateY(-3px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.035) 0%,
      rgba(255, 255, 255, 0.012) 100%
    );
  }
`;

const MainCard = styled(motion.article)`
  ${cardBase}

  @media (max-width: 1024px) {
    grid-column: 1 / -1;
  }
`;

const MiddleCard = styled(motion.article)`
  ${cardBase}
`;

const MiddleColumn = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 20px;

  @media (max-width: 720px) {
    grid-template-rows: auto;
  }
`;

const FeaturedImage = styled.div`
  width: 100%;
  aspect-ratio: ${({ ratio }) => ratio || "16 / 10"};
  border-radius: 10px;
  overflow: hidden;
  background: #14191e;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
  }

  ${MainCard}:hover img,
  ${MiddleCard}:hover img {
    transform: scale(1.03);
  }
`;

const CardCategory = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #5bb39e;
`;

const CardTitle = styled.h3`
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.2;
  color: #f4f6f8;
  margin: 0;
  font-size: ${({ size }) => size || "20px"};

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardExcerpt = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardAuthor = styled.span`
  font-size: 12px;
  color: #6b7479;
  letter-spacing: 0.01em;
  margin-top: auto;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const LatestHeader = styled.h3`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #6b7479;
  margin: 0 0 4px;
`;

const LatestItem = styled(motion.article)`
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;

  &:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  .title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.35;
    color: #f4f6f8;
    margin: 0 0 6px;
    transition: color 0.15s ease;
  }
  .author {
    font-size: 12px;
    color: #6b7479;
  }

  &:hover .title {
    color: #5bb39e;
  }
`;

const NewsletterCard = styled(motion.div)`
  margin-top: 8px;
  padding: 20px;
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(91, 179, 158, 0.08) 0%,
    rgba(91, 179, 158, 0.02) 100%
  );
  border: 1px solid rgba(91, 179, 158, 0.2);
  display: flex;
  flex-direction: column;
  gap: 12px;

  p {
    font-size: 13px;
    line-height: 1.55;
    color: #c5cbcf;
    margin: 0;
    strong {
      color: #f4f6f8;
    }
  }
`;

const InlineMiniBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  padding: 8px 14px;
  border-radius: 8px;
  background: #206a5d;
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: background 0.18s ease, transform 0.12s ease;

  &:hover {
    background: #267a6b;
    transform: translateY(-1px);
  }
`;

/* ---- Expertise block ---- */

const ExpertiseShell = styled(Container)`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 56px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
`;

const ExpertiseLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ExpertiseLogo = styled.h2`
  font-weight: 800;
  font-size: clamp(28px, 3.4vw, 40px);
  line-height: 1.04;
  letter-spacing: -0.022em;
  color: #f4f6f8;
  margin: 0;
`;

const ExpertiseSub = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;
`;

const ExpertiseDesc = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;
  max-width: 480px;
`;

const ExpertiseRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExpertiseRightHeader = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6b7479;
  margin-bottom: 10px;
`;

const ExpertiseRow = styled.a`
  display: grid;
  grid-template-columns: 36px 1fr 18px;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 14px;
  color: #d2d8da;
  text-decoration: none;
  transition: color 0.18s ease;

  &:last-child {
    border-bottom: 0;
  }
  .num {
    font-size: 12px;
    color: #6b7479;
    letter-spacing: 0.08em;
  }
  .arrow {
    color: #4d5559;
    transition: color 0.18s ease, transform 0.18s ease;
  }
  &:hover {
    color: #ffffff;
    text-decoration: none;
  }
  &:hover .arrow {
    color: #5bb39e;
    transform: translate(2px, -2px);
  }
`;

/* ---- Filter + grid ---- */

const FilterShell = styled.div`
  max-width: 1200px;
  margin: 0 auto 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FilterTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  border-radius: 999px;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.02);
  color: #a3acb2;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: all 0.18s ease;

  svg {
    color: inherit;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #f4f6f8;
    border-color: rgba(255, 255, 255, 0.18);
  }
  ${({ active }) =>
    active &&
    css`
      background: rgba(91, 179, 158, 0.12);
      color: #f4f6f8;
      border-color: rgba(91, 179, 158, 0.4);
      svg {
        color: #5bb39e;
      }
    `}
`;

const SubFilters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const SubFilterChip = styled.button`
  padding: 6px 12px;
  border-radius: 999px;
  background: transparent;
  color: #6b7479;
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: #d2d8da;
    border-color: rgba(255, 255, 255, 0.18);
  }
  ${({ active }) =>
    active &&
    css`
      color: #5bb39e;
      background: rgba(91, 179, 158, 0.08);
      border-color: rgba(91, 179, 158, 0.3);
    `}
`;

const ContentShell = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 48px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const Articles = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
`;

const ArticleCard = styled(motion.article)`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 22px;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.015);
  cursor: pointer;
  transition: border-color 0.22s ease, transform 0.22s ease,
    background 0.22s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.25);
    background: rgba(255, 255, 255, 0.03);
    transform: translateY(-2px);
  }
  &:hover .arrow {
    color: #5bb39e;
    transform: translateX(3px);
  }

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const ArticleImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  overflow: hidden;
  background: #14191e url(${({ bg }) => bg}) center / cover no-repeat;
`;

const ArticleBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`;

const ArticleCategoryRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5bb39e;

  svg {
    color: inherit;
  }
`;

const ArticleTitle = styled.h3`
  font-size: 19px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: #f4f6f8;
  margin: 0;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArticleExcerpt = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ArticleTagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const ArticleTag = styled.span`
  font-size: 11px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  color: #c5cbcf;
`;

const ArticleMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 6px;
  font-size: 12px;
  color: #6b7479;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .arrow {
    margin-left: auto;
    color: #4d5559;
    font-weight: 600;
    transition: color 0.18s ease, transform 0.18s ease;
  }
`;

/* ---- Pagination ---- */

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 28px;
`;

const PageBtn = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: ${({ active }) =>
    active ? "rgba(91, 179, 158, 0.12)" : "rgba(255, 255, 255, 0.02)"};
  color: ${({ active }) => (active ? "#5bb39e" : "#a3acb2")};
  border: 1px solid
    ${({ active }) =>
      active ? "rgba(91, 179, 158, 0.4)" : "rgba(255, 255, 255, 0.08)"};
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    color: #f4f6f8;
    border-color: rgba(255, 255, 255, 0.18);
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.div`
  margin-left: 12px;
  font-size: 12px;
  color: #6b7479;
`;

/* ---- Sidebar ---- */

const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SidebarCard = styled(motion.div)`
  padding: 22px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const SidebarTitle = styled.h3`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #6b7479;
  margin: 0;
`;

const SidebarBody = styled.p`
  font-size: 13px;
  line-height: 1.55;
  color: #c5cbcf;
  margin: 0;
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NewsletterInput = styled.input`
  padding: 11px 14px;
  border-radius: 8px;
  background: rgba(15, 18, 22, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &::placeholder {
    color: #6b7479;
  }
  &:focus {
    border-color: rgba(91, 179, 158, 0.4);
    box-shadow: 0 0 0 3px rgba(91, 179, 158, 0.15);
  }
`;

const SubscribeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 16px;
  border-radius: 8px;
  background: #206a5d;
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  transition: background 0.18s ease;

  &:hover {
    background: #267a6b;
  }
`;

const TopicList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TopicChip = styled.button`
  text-align: left;
  padding: 9px 12px;
  border-radius: 8px;
  background: transparent;
  color: #d2d8da;
  border: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    background: rgba(91, 179, 158, 0.06);
    border-color: rgba(91, 179, 158, 0.25);
    color: #ffffff;
  }
`;

const AchievementList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AchievementItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;

  svg {
    color: #5bb39e;
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const AchievementInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  .t {
    font-size: 13px;
    font-weight: 600;
    color: #f4f6f8;
    line-height: 1.3;
  }
  .d {
    font-size: 12px;
    color: #a3acb2;
    line-height: 1.4;
  }
`;

const EmptyState = styled.div`
  padding: 40px 24px;
  text-align: center;
  font-size: 14px;
  color: #6b7479;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 12px;
`;

/* ---- Skeleton (loading state) ---- */

const shimmer = keyframes`
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
`;

const SkeletonBox = styled.div`
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.06) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.6s ease-in-out infinite;
  border-radius: ${({ radius }) => radius || "8px"};
  width: ${({ w }) => w || "100%"};
  height: ${({ h }) => h || "16px"};
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const SkeletonHero = styled.div`
  position: relative;
  padding: 120px 24px 64px;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  gap: 64px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 80px 18px 40px;
  }
`;

const SkeletonHeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const SkeletonGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 64px 24px 120px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 22px;
  padding: 20px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.015);
  margin-bottom: 18px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const BlogSkeleton = () => (
  <>
    <SkeletonHero>
      <SkeletonHeroLeft>
        <SkeletonBox w="140px" h="22px" radius="999px" />
        <SkeletonBox w="90%" h="54px" />
        <SkeletonBox w="80%" h="54px" />
        <SkeletonBox w="70%" h="16px" />
        <SkeletonBox w="60%" h="16px" />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <SkeletonBox w="140px" h="42px" radius="10px" />
          <SkeletonBox w="120px" h="42px" radius="10px" />
        </div>
      </SkeletonHeroLeft>
      <SkeletonBox w="100%" h="320px" radius="16px" />
    </SkeletonHero>
    <SkeletonGrid>
      <div>
        {[0, 1, 2, 3].map((i) => (
          <SkeletonRow key={i}>
            <SkeletonBox w="100%" h="180px" radius="10px" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SkeletonBox w="100px" h="14px" radius="999px" />
              <SkeletonBox w="90%" h="22px" />
              <SkeletonBox w="80%" h="22px" />
              <SkeletonBox w="100%" h="14px" />
              <SkeletonBox w="90%" h="14px" />
            </div>
          </SkeletonRow>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <SkeletonBox w="100%" h="180px" radius="14px" />
        <SkeletonBox w="100%" h="180px" radius="14px" />
        <SkeletonBox w="100%" h="180px" radius="14px" />
      </div>
    </SkeletonGrid>
  </>
);

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

function EnterpriseTechGuide() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSubFilter, setActiveSubFilter] = useState("all");
  const [email, setEmail] = useState("");
  const [mostLikedArticle, setMostLikedArticle] = useState(null);
  const [hbrArticles, setHbrArticles] = useState({
    main: null,
    middle1: null,
    middle2: null,
    latest: [],
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  const state = useContext(GlobalState);
  const [articles] = state?.articlesAPI?.articles || [[]];

  // Initial data load — most-liked + 3-column featured derivation
  useEffect(() => {
    const fetchMostLikedArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/articles");
        if (response.data.articles && response.data.articles.length > 0) {
          const allArticles = response.data.articles;
          const sorted = [...allArticles].sort(
            (a, b) => (b.likes || 0) - (a.likes || 0)
          );
          setMostLikedArticle(sorted[0]);

          const categoryCount = {};
          const categoryArticles = {};
          allArticles.forEach((article) => {
            const cat = article.categories?.[0] || "general";
            categoryCount[cat] = (categoryCount[cat] || 0) + 1;
            if (!categoryArticles[cat]) categoryArticles[cat] = [];
            categoryArticles[cat].push(article);
          });

          const sortedCategories = Object.entries(categoryCount)
            .sort((a, b) => b[1] - a[1])
            .map(([category]) => category);

          const mostUsedCategory = sortedCategories[0];
          const secondMostUsedCategory = sortedCategories[1];
          const thirdMostUsedCategory = sortedCategories[2];

          const mainCategoryArticles = (categoryArticles[mostUsedCategory] || [])
            .filter((a) => a._id !== sorted[0]?._id)
            .sort((a, b) => (b.likes || 0) - (a.likes || 0));
          const main = mainCategoryArticles[0];

          const middle1 = (categoryArticles[secondMostUsedCategory] || []).sort(
            (a, b) => (b.likes || 0) - (a.likes || 0)
          )[0];

          const middle2 = (categoryArticles[thirdMostUsedCategory] || []).sort(
            (a, b) => (b.likes || 0) - (a.likes || 0)
          )[0];

          const usedIds = new Set(
            [sorted[0]?._id, main?._id, middle1?._id, middle2?._id].filter(
              Boolean
            )
          );
          const latestArticles = allArticles
            .filter((a) => !usedIds.has(a._id))
            .sort(
              (a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )
            .slice(0, 3);

          setHbrArticles({ main, middle1, middle2, latest: latestArticles });
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMostLikedArticle();
  }, []);

  // Transform DB articles to UI shape
  const transformedArticles = (articles || []).map((article) => {
    const dbCategory = article.categories?.[0] || "general";
    const uiCategory = CATEGORY_DB_TO_UI[dbCategory] || "engineering";
    return {
      id: article._id,
      _id: article._id,
      title: article.title || "Untitled Article",
      excerpt:
        article.description || article.markdown?.substring(0, 150) || "",
      category: uiCategory,
      subCategory: dbCategory,
      image: article.images?.url || FALLBACK_IMG,
      readTime: article.readTime || "5 min read",
      publishDate: article.createdAt
        ? new Date(article.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "Unknown",
      tags: article.categories || [],
      likes: article.likes || 0,
      views: article.views || 0,
      author: article.postedBy?.name || "Dominique Hosea",
    };
  });

  const filteredArticles = transformedArticles.filter((article) => {
    if (activeFilter === "all") return true;
    if (article.category !== activeFilter) return false;
    if (activeSubFilter === "all") return true;
    return article.subCategory === activeSubFilter;
  });

  const featuredArticleIds = new Set(
    [
      mostLikedArticle?._id,
      hbrArticles.main?._id,
      hbrArticles.middle1?._id,
      hbrArticles.middle2?._id,
      ...(hbrArticles.latest?.map((a) => a._id) || []),
    ].filter(Boolean)
  );

  const deduplicatedArticles = filteredArticles.filter(
    (a) => !featuredArticleIds.has(a._id)
  );
  const sortedArticles = [...deduplicatedArticles].sort(
    (a, b) => (b.likes || 0) - (a.likes || 0)
  );

  const totalPages = Math.ceil(sortedArticles.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentArticles = sortedArticles.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, activeSubFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const articlesSection = document.getElementById("articles-section");
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const getExpertiseCategories = () => {
    try {
      const categoryCount = {};
      const categoryNames = {
        engineering: "Software Engineering & Architecture",
        leadership: "Engineering Leadership & Team Building",
        enterprise: "Enterprise Solutions & Architecture",
        innovation: "Innovation & AI/ML Engineering",
        career: "Career Growth & Development",
      };
      articles.forEach((article) => {
        const cat = article.categories?.[0] || "general";
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      const dynamic = Object.entries(categoryCount)
        .filter(([, count]) => count >= 3)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([category], i) => ({
          number: String(i + 1).padStart(2, "0"),
          name:
            categoryNames[category] ||
            category.charAt(0).toUpperCase() + category.slice(1),
        }));
      if (dynamic.length === 6) return dynamic;
      return FALLBACK_EXPERTISE;
    } catch {
      return FALLBACK_EXPERTISE;
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
    window.open("https://www.linkedin.com/article/newsletter/new/", "_blank");
  };

  if (loading) {
    return (
      <Page>
        <BlogSkeleton />
      </Page>
    );
  }

  return (
    <Page>
      {/* 1. Hero — most-liked article */}
      <Section>
        <HeroBg />
        <HeroGrid />
        <HeroShell>
          <HeroContent>
            {mostLikedArticle ? (
              <>
                <HeroBadge>Most Popular</HeroBadge>
                <HeroTitle
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {mostLikedArticle.title}
                </HeroTitle>
                <HeroExcerpt
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {mostLikedArticle.description || mostLikedArticle.excerpt}
                </HeroExcerpt>
                <HeroActions
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <PrimaryBtn
                    onClick={() =>
                      (window.location.href = `/blog/${mostLikedArticle._id}`)
                    }
                  >
                    <FiBookOpen size={16} />
                    Read article
                  </PrimaryBtn>
                  <GhostBtn onClick={() => (window.location.href = "/project")}>
                    Case studies
                  </GhostBtn>
                </HeroActions>
              </>
            ) : (
              <>
                <HeroBadge>Insights</HeroBadge>
                <HeroTitle
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  Engineering, leadership,
                  <br />
                  and <em>systems thinking</em>.
                </HeroTitle>
                <HeroExcerpt
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Deep technical insights and engineering perspective from
                  building scalable systems in production.
                </HeroExcerpt>
              </>
            )}
          </HeroContent>

          <HeroVisual
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <img
              src={
                mostLikedArticle?.images?.url ||
                mostLikedArticle?.image ||
                "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop"
              }
              alt={mostLikedArticle?.title || "Tech insights"}
            />
          </HeroVisual>
        </HeroShell>
      </Section>

      {/* 2. Case-study banner */}
      <CaseStudyBanner
        logo="/HC.png"
        title="Engineering excellence in action"
        highlightText="HoseaCodes"
        image="/plane.png"
        buttonText="Follow the journey"
        onButtonClick={() =>
          window.open("https://www.linkedin.com/in/dominique-hosea/", "_blank")
        }
      />

      {/* 3. Editorial featured block — main + middles + latest + newsletter */}
      <TightSection>
        <FeaturedShell>
          <MainCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() =>
              hbrArticles.main?._id &&
              (window.location.href = `/blog/${hbrArticles.main._id}`)
            }
          >
            <FeaturedImage ratio="16 / 10">
              <img
                src={
                  hbrArticles.main?.images?.url ||
                  "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop"
                }
                alt={hbrArticles.main?.title || "Featured"}
              />
            </FeaturedImage>
            <CardCategory>
              {hbrArticles.main?.categories?.[0] || "Distributed Systems"}
            </CardCategory>
            <CardTitle size="28px">
              {hbrArticles.main?.title ||
                "How We Scaled Authentication to 36M Daily Requests"}
            </CardTitle>
            <CardExcerpt>
              {hbrArticles.main?.description ||
                hbrArticles.main?.markdown?.substring(0, 160) ||
                "A deep dive into the architectural decisions and engineering challenges behind enterprise-grade identity systems."}
            </CardExcerpt>
            <CardAuthor>
              {hbrArticles.main?.postedBy?.name || "Dominique Hosea"}
            </CardAuthor>
          </MainCard>

          <MiddleColumn>
            {[hbrArticles.middle1, hbrArticles.middle2]
              .filter(Boolean)
              .map((article, idx) => (
                <MiddleCard
                  key={article._id || idx}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05 + idx * 0.05 }}
                  onClick={() =>
                    article._id &&
                    (window.location.href = `/blog/${article._id}`)
                  }
                >
                  <FeaturedImage ratio="16 / 9">
                    <img
                      src={
                        article.images?.url ||
                        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=240&fit=crop"
                      }
                      alt={article.title || "Article"}
                    />
                  </FeaturedImage>
                  <CardCategory>
                    {article.categories?.[0] || "Engineering"}
                  </CardCategory>
                  <CardTitle size="18px">
                    {article.title || "Article"}
                  </CardTitle>
                  <CardAuthor>
                    {article.postedBy?.name || "Dominique Hosea"}
                  </CardAuthor>
                </MiddleCard>
              ))}
          </MiddleColumn>

          <RightColumn>
            <LatestHeader>The Latest</LatestHeader>
            {hbrArticles.latest.map((article, idx) => (
              <LatestItem
                key={article._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                onClick={() =>
                  article._id &&
                  (window.location.href = `/blog/${article._id}`)
                }
              >
                <h4 className="title">{article.title}</h4>
                <span className="author">
                  {article.postedBy?.name || "Dominique Hosea"}
                </span>
              </LatestItem>
            ))}

            <NewsletterCard
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <p>
                Subscribe to <strong>HoseaCodes Executive</strong> for engineering
                insights delivered to your inbox.
              </p>
              <InlineMiniBtn onClick={handleSubscribe}>
                Sign up
                <FiArrowRight size={14} />
              </InlineMiniBtn>
            </NewsletterCard>
          </RightColumn>
        </FeaturedShell>
      </TightSection>

      {/* 4. Expertise / engineering insights by domain */}
      <InsightsBand>
        <ExpertiseShell>
          <ExpertiseLeft>
            <ExpertiseSub>HoseaCodes Insights</ExpertiseSub>
            <ExpertiseLogo>
              On enterprise systems &amp; engineering excellence.
            </ExpertiseLogo>
            <ExpertiseDesc>
              Managed by Dominique Hosea — Senior Software Engineer at State
              Farm. Part of the Enterprise Engineering Excellence Initiative.
            </ExpertiseDesc>
          </ExpertiseLeft>
          <ExpertiseRight>
            <ExpertiseRightHeader>Engineering domains</ExpertiseRightHeader>
            {getExpertiseCategories().map((cat) => (
              <ExpertiseRow key={cat.number} href="#">
                <span className="num">{cat.number}</span>
                <span>{cat.name}</span>
                <FiArrowUpRight className="arrow" size={16} />
              </ExpertiseRow>
            ))}
          </ExpertiseRight>
        </ExpertiseShell>
      </InsightsBand>

      {/* 5–7. Filters + grid + sidebar */}
      <Section>
        <Container style={{ textAlign: "center", marginBottom: 48 }}>
          <Kicker>Latest</Kicker>
          <Heading>
            All <em>insights</em>.
          </Heading>
          <Tagline>
            In-depth technical articles, leadership perspectives, and enterprise
            solutions from the front lines of engineering.
          </Tagline>
        </Container>

        <FilterShell>
          <FilterTabs>
            {Object.entries(ENTERPRISE_CATEGORIES).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <FilterTab
                  key={key}
                  active={activeFilter === key}
                  onClick={() => {
                    setActiveFilter(key);
                    setActiveSubFilter("all");
                  }}
                >
                  <Icon size={14} />
                  {category.label}
                </FilterTab>
              );
            })}
          </FilterTabs>

          {activeFilter !== "all" && (
            <SubFilters>
              {ENTERPRISE_CATEGORIES[activeFilter].subFilters.map((filter) => (
                <SubFilterChip
                  key={filter}
                  active={activeSubFilter === filter}
                  onClick={() => setActiveSubFilter(filter)}
                >
                  {SUB_FILTER_LABELS[filter]}
                </SubFilterChip>
              ))}
            </SubFilters>
          )}
        </FilterShell>

        <ContentShell id="articles-section">
          <div>
            <Articles>
              {currentArticles.length === 0 ? (
                <EmptyState>
                  No articles match this filter yet. Try a different category.
                </EmptyState>
              ) : (
                currentArticles.map((article, index) => {
                  const Icon =
                    ENTERPRISE_CATEGORIES[article.category]?.icon || FiCode;
                  return (
                    <ArticleCard
                      key={article.id || article._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      onClick={() =>
                        article._id &&
                        (window.location.href = `/blog/${article._id}`)
                      }
                    >
                      <ArticleImage bg={article.image} />
                      <ArticleBody>
                        <ArticleCategoryRow>
                          <Icon size={12} />
                          {ENTERPRISE_CATEGORIES[article.category]?.label ||
                            "Engineering"}
                        </ArticleCategoryRow>
                        <ArticleTitle>{article.title}</ArticleTitle>
                        <ArticleExcerpt>
                          {article.excerpt && article.excerpt.length > 160
                            ? article.excerpt.substring(0, 160) + "…"
                            : article.excerpt}
                        </ArticleExcerpt>
                        <ArticleTagRow>
                          {Array.isArray(article.tags) &&
                            article.tags
                              .slice(0, 3)
                              .map((tag) => (
                                <ArticleTag key={tag}>
                                  {typeof tag === "string" ? tag : tag}
                                </ArticleTag>
                              ))}
                        </ArticleTagRow>
                        <ArticleMeta>
                          <span>
                            <FiClock size={11} /> {article.readTime}
                          </span>
                          <span>
                            <FiCalendar size={11} /> {article.publishDate}
                          </span>
                          <span className="arrow">→</span>
                        </ArticleMeta>
                      </ArticleBody>
                    </ArticleCard>
                  );
                })
              )}
            </Articles>

            {totalPages > 1 && (
              <Pagination>
                <PageBtn
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ←
                </PageBtn>
                {getPageNumbers().map((pageNum) => (
                  <PageBtn
                    key={pageNum}
                    active={currentPage === pageNum}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </PageBtn>
                ))}
                <PageBtn
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  →
                </PageBtn>
                <PaginationInfo>
                  Page {currentPage} of {totalPages}
                </PaginationInfo>
              </Pagination>
            )}
          </div>

          <Sidebar>
            <SidebarCard
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <SidebarTitle>Newsletter</SidebarTitle>
              <SidebarBody>
                Weekly notes on engineering, leadership, and the systems behind
                production software.
              </SidebarBody>
              <NewsletterForm onSubmit={handleSubscribe}>
                <NewsletterInput
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <SubscribeBtn type="submit">
                  <FiMail size={14} />
                  Subscribe
                </SubscribeBtn>
              </NewsletterForm>
            </SidebarCard>

            <SidebarCard
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <SidebarTitle>Featured Topics</SidebarTitle>
              <TopicList>
                {PROFESSIONAL_TOPICS.map((topic, index) => (
                  <TopicChip key={index}>{topic}</TopicChip>
                ))}
              </TopicList>
            </SidebarCard>

            <SidebarCard
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SidebarTitle>Achievements</SidebarTitle>
              <AchievementList>
                <AchievementItem>
                  <FiAward size={18} />
                  <AchievementInfo>
                    <span className="t">State Farm Innovation Award</span>
                    <span className="d">Distributed Systems Excellence</span>
                  </AchievementInfo>
                </AchievementItem>
                <AchievementItem>
                  <FiTarget size={18} />
                  <AchievementInfo>
                    <span className="t">Senior Engineer Track</span>
                    <span className="d">Identity & Authentication Platform</span>
                  </AchievementInfo>
                </AchievementItem>
                <AchievementItem>
                  <FiBarChart2 size={18} />
                  <AchievementInfo>
                    <span className="t">Performance Optimization</span>
                    <span className="d">36M+ Daily Requests</span>
                  </AchievementInfo>
                </AchievementItem>
              </AchievementList>
            </SidebarCard>
          </Sidebar>
        </ContentShell>
      </Section>

      {/* 8. Resume CTA + StateFarm banner */}
      <MinimalResumeCTA />
      <StateFarm />
    </Page>
  );
}

export default EnterpriseTechGuide;
