import React from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

/* ------------------------------------------------------------------
   404 page for unmatched routes. Rendered as the catch-all inside the
   app's <Switch>, so it sits in the body between the nav and footer.
   Styled to match the dark theme used across the site.
------------------------------------------------------------------ */

const Wrap = styled.section`
  background: #0f1216;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 24px;
  text-align: center;
`;

const Inner = styled.div`
  max-width: 560px;
`;

const Code = styled.div`
  font-family: "Lato", sans-serif;
  font-weight: 800;
  font-size: clamp(64px, 12vw, 120px);
  line-height: 1;
  letter-spacing: -0.04em;
  background: linear-gradient(180deg, #5bb39e 0%, #206a5d 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: #5bb39e;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-family: "Lato", sans-serif;
  font-weight: 700;
  font-size: clamp(24px, 3.5vw, 34px);
  letter-spacing: -0.02em;
  color: #f4f6f8;
  margin: 0 0 14px;
`;

const Message = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0 0 8px;

  .path {
    color: #c5cbcf;
    font-family: Menlo, Monaco, "Courier New", monospace;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 6px;
    padding: 2px 8px;
    word-break: break-all;
  }
`;

const Actions = styled.div`
  margin-top: 32px;
  display: inline-flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 11px 22px;
  border-radius: 10px;
  background: #206a5d;
  border: 1px solid #206a5d;
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: #267a6b;
    text-decoration: none;
  }
`;

const GhostLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 11px 22px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #c5cbcf;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.4);
    color: #5bb39e;
    text-decoration: none;
  }
`;

const NotFound = () => {
  const location = useLocation();

  return (
    <Wrap>
      <Inner>
        <Code>404</Code>
        <Title>We couldn't find that page</Title>
        <Message>
          Nothing lives at <span className="path">{location.pathname}</span>.
        </Message>
        <Message>It may have moved, or the link might be wrong.</Message>
        <Actions>
          <PrimaryLink to="/">Go home</PrimaryLink>
          <GhostLink to="/project">View projects</GhostLink>
          <GhostLink to="/case-studies">Case studies</GhostLink>
        </Actions>
      </Inner>
    </Wrap>
  );
};

export default NotFound;
