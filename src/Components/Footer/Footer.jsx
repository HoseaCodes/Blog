import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  FaGithub,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaCodepen,
} from "react-icons/fa";
import { FiMapPin, FiMail, FiArrowUpRight } from "react-icons/fi";

const LOGO =
  "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/logo-min.png";
const RESUME =
  "https://d2nrcsymqn25pk.cloudfront.net/Assets/PDFs/Resume2020.pdf";

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/HoseaCodes",
    icon: <FaGithub />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dominique-hosea/",
    icon: <FaLinkedinIn />,
  },
  {
    label: "Twitter",
    href: "https://twitter.com/DominiqueRHosea",
    icon: <FaTwitter />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCW0iZYA3zE03qlVJqVE_ajQ",
    icon: <FaYoutube />,
  },
  {
    label: "CodePen",
    href: "https://codepen.io/hosead6168",
    icon: <FaCodepen />,
  },
];

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

const FooterRoot = styled.footer`
  position: relative;
  width: 100%;
  background: #0a0c0f;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 80px 24px 32px;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: 720px) {
    padding: 56px 18px 28px;
  }
`;

const BgAccent = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    50% 60% at 50% 0%,
    rgba(32, 106, 93, 0.08),
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

const TopGrid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr;
  gap: 40px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  @media (max-width: 540px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 320px;
`;

const BrandTop = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;

  img {
    height: 32px;
    width: auto;
  }

  &:hover {
    text-decoration: none;
  }
`;

const BrandName = styled.span`
  font-family: "Lato", sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f4f6f8;
`;

const BrandTagline = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;

  a,
  span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: "Lato", sans-serif;
    font-size: 13px;
    color: #a3acb2;
    text-decoration: none;
    letter-spacing: 0.01em;
    transition: color 0.15s ease;
  }
  a:hover {
    color: #ffffff;
    text-decoration: none;
  }
  svg {
    color: #5bb39e;
    font-size: 13px;
    flex-shrink: 0;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ColumnTitle = styled.h5`
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6b7479;
  margin: 0 0 4px;
`;

const ColumnList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColumnLink = styled(Link)`
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #d2d8da;
  text-decoration: none;
  letter-spacing: -0.005em;
  transition: color 0.15s ease;

  &:hover {
    color: #ffffff;
    text-decoration: none;
  }
`;

const ColumnExternal = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #d2d8da;
  text-decoration: none;
  letter-spacing: -0.005em;
  transition: color 0.15s ease;

  svg {
    font-size: 12px;
    color: #6b7479;
    transition: color 0.15s ease, transform 0.18s ease;
  }

  &:hover {
    color: #ffffff;
    text-decoration: none;
  }
  &:hover svg {
    color: #5bb39e;
    transform: translate(2px, -2px);
  }
`;

const Divider = styled.div`
  margin: 56px 0 24px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.08) 20%,
    rgba(255, 255, 255, 0.08) 80%,
    transparent 100%
  );

  @media (max-width: 720px) {
    margin: 40px 0 20px;
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 18px;
  }
`;

const Copy = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 12px;
  color: #6b7479;
  margin: 0;
  letter-spacing: 0.01em;
`;

const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SocialIcon = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: #a3acb2;
  font-size: 14px;
  background: transparent;
  border: 1px solid transparent;
  transition: background 0.18s ease, border-color 0.18s ease,
    color 0.18s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(91, 179, 158, 0.25);
    text-decoration: none;
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const Footer = () => {
  const year = new Date().getFullYear();
  const location = useLocation();
  const currentPath = location.pathname;

  // Hide on blog reader / gamecorner — but NOT on /admin/blog/* admin routes.
  const isBlogReader = /^\/blog\/[^/]+/.test(currentPath);
  const isGameCorner = currentPath.includes("/gamecorner");
  if (isBlogReader || isGameCorner) {
    return null;
  }

  return (
    <FooterRoot>
      <BgAccent />
      <Shell>
        <TopGrid>
          <Brand>
            <BrandTop to="/">
              <img src={LOGO} alt="HoseaCodes" />
              <BrandName>Hosea Codes</BrandName>
            </BrandTop>
            <BrandTagline>
              Backend engineer and builder shipping distributed systems,
              AI products, and the infrastructure that lets small teams move
              like large ones.
            </BrandTagline>
            <ContactList>
              <span>
                <FiMapPin />
                Houston, TX
              </span>
              <a href="mailto:mr.dhosea@gmail.com">
                <FiMail />
                mr.dhosea@gmail.com
              </a>
            </ContactList>
          </Brand>

          <Column>
            <ColumnTitle>Explore</ColumnTitle>
            <ColumnList>
              <li>
                <ColumnLink to="/">Home</ColumnLink>
              </li>
              <li>
                <ColumnLink to="/project">Projects</ColumnLink>
              </li>
              <li>
                <ColumnLink to="/blog">Blog</ColumnLink>
              </li>
              <li>
                <ColumnLink to="/about">About</ColumnLink>
              </li>
              <li>
                <ColumnLink to="/contact">Contact</ColumnLink>
              </li>
            </ColumnList>
          </Column>

          <Column>
            <ColumnTitle>Connect</ColumnTitle>
            <ColumnList>
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <ColumnExternal
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.label}
                    <FiArrowUpRight />
                  </ColumnExternal>
                </li>
              ))}
            </ColumnList>
          </Column>

          <Column>
            <ColumnTitle>Work</ColumnTitle>
            <ColumnList>
              <li>
                <ColumnExternal
                  href={RESUME}
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Resume2020.pdf"
                >
                  Resume (PDF)
                  <FiArrowUpRight />
                </ColumnExternal>
              </li>
              <li>
                <ColumnExternal
                  href="https://www.dominiquehosea.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Backend portfolio
                  <FiArrowUpRight />
                </ColumnExternal>
              </li>
              <li>
                <ColumnExternal
                  href="https://github.com/HoseaCodes"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source code
                  <FiArrowUpRight />
                </ColumnExternal>
              </li>
            </ColumnList>
          </Column>

          <Column>
            <ColumnTitle>Free tools</ColumnTitle>
            <ColumnList>
              <li>
                <ColumnExternal
                  href="https://freelancer.ambitiousconcept.com/invoice-generator"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Invoice generator
                  <FiArrowUpRight />
                </ColumnExternal>
              </li>
            </ColumnList>
          </Column>
        </TopGrid>

        <Divider />

        <BottomRow>
          <Copy>© {year} Hosea Codes. All rights reserved.</Copy>
          <SocialRow>
            {SOCIALS.map((s) => (
              <SocialIcon
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
              >
                {s.icon}
              </SocialIcon>
            ))}
          </SocialRow>
        </BottomRow>
      </Shell>
    </FooterRoot>
  );
};

export default Footer;
