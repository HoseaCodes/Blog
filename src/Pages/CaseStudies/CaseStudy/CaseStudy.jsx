import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import marked from "marked";
import {
  caseStudyData,
  findGroup,
  findCaseStudy,
  caseStudyPath,
  groupPath,
} from "../CaseStudiesData";
import { StyledHr } from "../../../Layout/Hr/styledHr";
import ListenButton from "../../../Components/Article/ListenButton";

/* ------------------------------------------------------------------
   Case Study detail page. Long-form body is stored as markdown on the
   case study record and rendered with `marked`, styled to match the
   blog reader (serif, 21px, line-height 1.8) on the app's dark theme.
   Lookup is by id (not array index) against the single source of truth.
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

const ListenRow = styled.div`
  margin-top: 24px;
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
  padding: 8px 24px 96px;

  @media (max-width: 768px) {
    padding: 8px 18px 72px;
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

  code {
    font-family: Menlo, Monaco, "Courier New", monospace;
    font-size: 0.85em;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    padding: 1px 6px;
  }

  pre {
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 18px 20px;
    overflow-x: auto;
    margin: 0 0 32px;

    code {
      background: none;
      border: none;
      padding: 0;
    }
  }

  hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    margin: 40px 0;
  }
`;

const StudyNav = styled.nav`
  max-width: 820px;
  margin: 0 auto;
  padding: 0 24px 96px;
  display: flex;
  justify-content: space-between;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 0 18px 72px;
  }
`;

const NavLink = styled(Link)`
  flex: 1;
  max-width: 48%;
  padding: 18px 20px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);
  text-decoration: none;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.28);
    background: rgba(255, 255, 255, 0.04);
    text-decoration: none;
  }

  &.next {
    text-align: right;
    margin-left: auto;
  }

  .label {
    display: block;
    font-family: "Lato", sans-serif;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #5bb39e;
    margin-bottom: 6px;
  }
  .name {
    font-family: "Lato", sans-serif;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.35;
    color: #f4f6f8;
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

const CaseStudy = () => {
  const params = useParams();
  // Resolves both nested (/case-studies/:group/:study) and standalone
  // (/case-studies/:slug) routes; :study/:slug may be a slug or numeric id.
  const study = params.study
    ? findCaseStudy(params.study, params.group)
    : findCaseStudy(params.slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params.group, params.study, params.slug]);

  if (!study) {
    return (
      <Page>
        <NotFound>
          <h1>Case study not found</h1>
          <p>
            That case study doesn't exist. <Link to="/case-studies">View all case studies →</Link>
          </p>
        </NotFound>
      </Page>
    );
  }

  // Back-link and prev/next are scoped to the study's section when it
  // belongs to one; otherwise they operate over the standalone studies.
  const group = study.group ? findGroup(study.group) : null;
  const backTo = group ? groupPath(group) : "/case-studies";
  const backLabel = group
    ? `← ${group.eyebrow} case studies`
    : "← All case studies";

  const peers = study.group
    ? caseStudyData.filter((c) => c.group === study.group)
    : caseStudyData.filter((c) => !c.group);
  const peerIndex = peers.findIndex((c) => c.id === study.id);
  const prev = peerIndex > 0 ? peers[peerIndex - 1] : null;
  const next =
    peerIndex >= 0 && peerIndex < peers.length - 1
      ? peers[peerIndex + 1]
      : null;

  return (
    <Page>
      <HeroWrap>
        <HeroGlow />
        <HeroInner>
          <BackLink to={backTo}>{backLabel}</BackLink>
          <Eyebrow>{study.eyebrow}</Eyebrow>
          <Title>{study.title}</Title>
          <Focus>{study.focus}</Focus>
          <Stack>
            {study.technologies.map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
          </Stack>
          <ListenRow>
            <ListenButton text={study.content} />
          </ListenRow>
        </HeroInner>
      </HeroWrap>

      <DividerWrap>
        <StyledHr Primary />
      </DividerWrap>

      <Article>
        <ArticleBody
          dangerouslySetInnerHTML={{ __html: marked(study.content || "") }}
        />
      </Article>

      {(prev || next) && (
        <StudyNav>
          {prev && (
            <NavLink className="prev" to={caseStudyPath(prev)}>
              <span className="label">← Previous</span>
              <span className="name">{prev.title}</span>
            </NavLink>
          )}
          {next && (
            <NavLink className="next" to={caseStudyPath(next)}>
              <span className="label">Next →</span>
              <span className="name">{next.title}</span>
            </NavLink>
          )}
        </StudyNav>
      )}
    </Page>
  );
};

export default CaseStudy;
