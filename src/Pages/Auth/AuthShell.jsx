import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import styled, { keyframes } from "styled-components";
import { FiAlertCircle, FiCheckCircle, FiArrowLeft } from "react-icons/fi";

const LOGO =
  "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/newLogo.png";

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.35); opacity: 0.6; }
`;

/* ------------------------------------------------------------------
   Page-level container + ambient background
------------------------------------------------------------------ */

export const AuthPage = styled.div`
  position: relative;
  min-height: 100vh;
  background: #0f1216;
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      55% 50% at 50% 0%,
      rgba(32, 106, 93, 0.16),
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(
      ellipse 70% 60% at 50% 30%,
      #000 30%,
      transparent 100%
    );
    -webkit-mask-image: radial-gradient(
      ellipse 70% 60% at 50% 30%,
      #000 30%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 480px) {
    padding: 32px 16px;
  }
`;

export const AuthCard = styled(motion.div)`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
  padding: 40px;
  border-radius: 20px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  gap: 22px;

  @media (max-width: 480px) {
    padding: 28px 22px;
    border-radius: 16px;
  }
`;

/* ------------------------------------------------------------------
   Brand block
------------------------------------------------------------------ */

const BrandLink = styled(Link)`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  margin-bottom: 4px;

  img {
    height: 32px;
    width: auto;
    display: block;
  }
  &:hover {
    text-decoration: none;
  }
`;

const BrandName = styled.span`
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f4f6f8;
`;

export const AuthBrand = () => (
  <BrandLink to="/" aria-label="HoseaCodes home">
    <img src={LOGO} alt="HoseaCodes" />
    <BrandName>Hosea Codes</BrandName>
  </BrandLink>
);

/* ------------------------------------------------------------------
   Title / subtitle
------------------------------------------------------------------ */

export const AuthHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const AuthKicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;
  align-self: flex-start;
`;

export const AuthTitle = styled.h1`
  margin: 0;
  font-weight: 800;
  font-size: clamp(26px, 3.4vw, 32px);
  line-height: 1.12;
  letter-spacing: -0.022em;
  color: #f4f6f8;
`;

export const AuthSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
  color: #a3acb2;
`;

/* ------------------------------------------------------------------
   Form
------------------------------------------------------------------ */

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #6b7479;
  }

  small {
    font-size: 11px;
    color: #6b7479;
    margin-top: 2px;
  }
`;

const inputBase = `
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(15, 18, 22, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease,
    background 0.18s ease;

  &::placeholder {
    color: #6b7479;
  }
  &:focus {
    border-color: rgba(91, 179, 158, 0.45);
    box-shadow: 0 0 0 3px rgba(91, 179, 158, 0.15);
    background: rgba(15, 18, 22, 0.8);
  }
`;

export const Input = styled.input`
  ${inputBase}
`;

export const CheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #a3acb2;
  cursor: pointer;
  user-select: none;

  input[type="checkbox"] {
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 4px;
    background: rgba(15, 18, 22, 0.65);
    border: 1px solid rgba(255, 255, 255, 0.18);
    cursor: pointer;
    position: relative;
    transition: all 0.15s ease;

    &:checked {
      background: #206a5d;
      border-color: #5bb39e;
    }
    &:checked::after {
      content: "✓";
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 11px;
      line-height: 1;
    }
  }
`;

export const SubmitBtn = styled.button`
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
  letter-spacing: 0.01em;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  box-shadow: 0 8px 22px rgba(32, 106, 93, 0.28);
  transition: background 0.18s ease, transform 0.12s ease,
    box-shadow 0.18s ease, opacity 0.15s ease;
  margin-top: 4px;
  width: 100%;

  &:hover:not(:disabled) {
    background: #267a6b;
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(32, 106, 93, 0.4);
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

/* ------------------------------------------------------------------
   Banner (error / success / info)
------------------------------------------------------------------ */

const BannerBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.45;

  ${({ tone }) =>
    tone === "error"
      ? `
        background: rgba(248, 113, 113, 0.08);
        border: 1px solid rgba(248, 113, 113, 0.25);
        color: #f8b4b4;
      `
      : tone === "success"
      ? `
        background: rgba(91, 179, 158, 0.08);
        border: 1px solid rgba(91, 179, 158, 0.3);
        color: #9bd4c4;
      `
      : `
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: #d2d8da;
      `}

  svg {
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

export const Banner = ({ tone = "info", children }) => {
  const Icon = tone === "error" ? FiAlertCircle : FiCheckCircle;
  return (
    <BannerBox tone={tone}>
      <Icon size={14} />
      <span>{children}</span>
    </BannerBox>
  );
};

/* ------------------------------------------------------------------
   Footer links
------------------------------------------------------------------ */

export const AuthFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6px 10px;
  margin-top: 2px;
  padding-top: 18px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
  color: #a3acb2;

  a {
    color: #5bb39e;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.15s ease;
  }
  a:hover {
    color: #9bd4c4;
    text-decoration: none;
  }
  .sep {
    color: #4d5559;
  }
`;

export const BackHomeLink = styled(Link)`
  position: absolute;
  top: 24px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #6b7479;
  text-decoration: none;
  z-index: 2;
  transition: color 0.15s ease;

  &:hover {
    color: #d2d8da;
    text-decoration: none;
  }
  @media (max-width: 720px) {
    top: 16px;
    left: 16px;
  }
`;

/* ------------------------------------------------------------------
   Reusable helpers exported with the file
------------------------------------------------------------------ */

export { FiArrowLeft, pulse };

/* ------------------------------------------------------------------
   Shell layout component
------------------------------------------------------------------ */

const AuthShell = ({ children }) => {
  return (
    <AuthPage>
      <BackHomeLink to="/">
        <FiArrowLeft size={12} />
        Back to site
      </BackHomeLink>
      <AuthCard
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <AuthBrand />
        {children}
      </AuthCard>
    </AuthPage>
  );
};

export default AuthShell;
