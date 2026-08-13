import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import marked from "marked";
import {
  caseStudyData,
  caseStudyGroups,
  caseStudyPath,
} from "../CaseStudiesData";
import { StyledHr } from "../../../Layout/Hr/styledHr";
import ListenButton from "../../../Components/Article/ListenButton";
import CaseStudyCard from "../CaseStudyCard";

/* ------------------------------------------------------------------
   Case Study section (group) landing page. Renders a group's intro as
   long-form markdown (matching the blog reader typography on the dark
   theme) above a grid of that group's case study cards. Mirrors the
   detail page's hero/article language for visual consistency.
------------------------------------------------------------------ */

const Page = styled.div`
  background: #0f1216;
  min-height: 100vh;
  overflow-x: clip;
`;

const HeroWrap = styled.section`
  position: relative;
  width: 100%;
  padding: 128px 24px 32px;
  overflow: hidden;
  isolation: isolate;

  @media (max-width: 768px) {
    padding: 100px 18px 24px;
  }
`;

const HeroGlow = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    55% 50% at 50% 0%,
    rgba(32, 106, 93, 0.15),
    transparent 70%
  );
  pointer-events: none;
  z-index: 0;
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 820px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: "Lato", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6b7479;
  text-decoration: none;
  margin-bottom: 28px;
  transition: color 0.18s ease;

  &:hover {
    color: #5bb39e;
    text-decoration: none;
  }
`;

const Eyebrow = styled.div`
  font-family: "Lato", sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-family: charter, Georgia, Cambria, "Times New Roman", Times, serif;
  font-weight: 700;
  font-size: 42px;
  line-height: 1.12;
  letter-spacing: -0.02em;
  color: #f4f6f8;
  margin: 0 0 18px;

  @media (max-width: 768px) {
    font-size: 34px;
  }
`;

const Focus = styled.p`
  font-family: "Lato", sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0 0 22px;
`;

const ListenRow = styled.div`
  margin-top: 4px;
`;

const DividerWrap = styled.div`
  max-width: 820px;
  margin: 0 auto;
  padding: 24px 24px 0;

  @media (max-width: 768px) {
    padding: 16px 18px 0;
  }
`;

const Article = styled.article`
  max-width: 820px;
  margin: 0 auto;
  padding: 8px 24px 40px;

  @media (max-width: 768px) {
    padding: 8px 18px 32px;
  }
`;

const ExpandButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 10px 18px;
  border-radius: 999px;
  border: 1px solid rgba(91, 179, 158, 0.35);
  background: rgba(91, 179, 158, 0.08);
  color: #5bb39e;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: rgba(91, 179, 158, 0.16);
  }
`;

/* Long-form body — mirrors the blog reader typography on the dark theme */
const ArticleBody = styled.div`
  font-family: charter, Georgia, Cambria, "Times New Roman", Times, serif;
  font-size: 21px;
  line-height: 1.8;
  color: #f4f6f8;

  @media (max-width: 768px) {
    font-size: 19px;
  }

  h2 {
    font-family: "Lato", sans-serif;
    font-size: 28px;
    font-weight: 700;
    line-height: 1.3;
    letter-spacing: -0.01em;
    color: #f4f6f8;
    margin: 48px 0 24px;
  }

  h3 {
    font-family: "Lato", sans-serif;
    font-size: 21px;
    font-weight: 700;
    line-height: 1.4;
    color: #f4f6f8;
    margin: 36px 0 16px;
  }

  p {
    margin: 0 0 32px;
  }

  ul,
  ol {
    margin: 0 0 32px;
    padding-left: 28px;
  }

  li {
    margin-bottom: 10px;
  }

  strong {
    color: #f4f6f8;
    font-weight: 700;
  }

  a {
    color: #5bb39e;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  blockquote {
    margin: 0 0 32px;
    padding: 4px 0 4px 20px;
    border-left: 3px solid #5bb39e;
    color: #a3acb2;
    font-style: italic;
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    margin: 40px 0;
  }
`;

const StudiesHeading = styled.h2`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 24px 0;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6b7479;

  @media (max-width: 720px) {
    padding: 8px 18px 0;
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

const NotFound = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 180px 24px 160px;
  text-align: center;
  font-family: "Lato", sans-serif;
  color: #a3acb2;

  h1 {
    font-size: 28px;
    color: #f4f6f8;
    margin: 0 0 12px;
  }
  a {
    color: #5bb39e;
    font-weight: 600;
    text-decoration: none;
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const CaseStudyGroup = () => {
  const { slug } = useParams();
  const group = caseStudyGroups.find((g) => g.slug === slug);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setExpanded(false);
  }, [slug]);

  if (!group) {
    return (
      <Page>
        <NotFound>
          <h1>Section not found</h1>
          <p>
            That section doesn't exist.{" "}
            <Link to="/case-studies">View all case studies →</Link>
          </p>
        </NotFound>
      </Page>
    );
  }

  const studies = caseStudyData.filter((c) => c.group === slug);

  // Split the intro into a short lead (before the first "##" heading) and
  // the rest, so the landing shows a scannable lead + cards with the full
  // overview available behind a toggle.
  const intro = group.intro || "";
  const splitAt = intro.indexOf("\n## ");
  const lead = splitAt >= 0 ? intro.slice(0, splitAt).trim() : intro;
  const rest = splitAt >= 0 ? intro.slice(splitAt).trim() : "";

  return (
    <Page>
      <HeroWrap>
        <HeroGlow />
        <HeroInner>
          <BackLink to="/case-studies">← All case studies</BackLink>
          <Eyebrow>{group.eyebrow}</Eyebrow>
          <Title>{group.title}</Title>
          {group.description && <Focus>{group.description}</Focus>}
          {group.intro && (
            <ListenRow>
              <ListenButton text={group.intro} />
            </ListenRow>
          )}
        </HeroInner>
      </HeroWrap>

      {intro && (
        <>
          <DividerWrap>
            <StyledHr Primary />
          </DividerWrap>
          <Article>
            <ArticleBody dangerouslySetInnerHTML={{ __html: marked(lead) }} />
            {rest && expanded && (
              <ArticleBody dangerouslySetInnerHTML={{ __html: marked(rest) }} />
            )}
            {rest && (
              <ExpandButton
                onClick={() => setExpanded((v) => !v)}
                aria-expanded={expanded}
              >
                {expanded ? "Show less ▴" : "Read the full overview ▾"}
              </ExpandButton>
            )}
          </Article>
        </>
      )}

      {studies.length > 0 && (
        <>
          <StudiesHeading>Case studies in this section</StudiesHeading>
          <Grid>
            {studies.map((study) => (
              <CaseStudyCard
                key={study.id}
                study={study}
                to={caseStudyPath(study)}
              />
            ))}
          </Grid>
        </>
      )}
    </Page>
  );
};

export default CaseStudyGroup;
