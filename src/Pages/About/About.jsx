import React from "react";
import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";
import { FiMail, FiArrowUpRight, FiArrowRight } from "react-icons/fi";

const PORTRAIT =
  "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/nique-min.jpg";
const RESUME =
  "https://d2nrcsymqn25pk.cloudfront.net/Assets/PDFs/Resume2020.pdf";

const TIMELINE = [
  {
    year: "2023",
    title: "Software Engineer II — Architecture & SRE",
    body:
      "Exposed to architecture, SRE foundations, and cloud development in AWS. Built serverless applications with Lambda, CloudWatch, VPCs, ECS, S3, SNS, and IAM. Worked with Terraform, CI/CD pipelines, chaos engineering, failovers, and circuit breakers.",
  },
  {
    year: "2022",
    title: "Promoted to Software Engineer II — State Farm",
    body:
      "Promoted shortly after my first year. Took on Java projects across data manipulation, logging, internal application proxies, and email services. Advanced my backend skills toward full-stack.",
  },
  {
    year: "2021",
    title: "First role — Full-Stack Java Engineer, State Farm",
    body:
      "Secured my first position in March 2021. Worked in full agile, mining technical business features and building REST microservices with Java Spring Boot + Maven.",
  },
  {
    year: "2020",
    title: "General Assembly — MERN bootcamp",
    body:
      "Enrolled as a full-stack engineering student. Turned MIS knowledge into real-world apps. Built full-stack projects in Node.js, Express, MongoDB, OAuth, React, Python, JavaScript, and Django.",
  },
  {
    year: "2017",
    title: "M.S. in Management Information Systems",
    body:
      "Pursued a deeper understanding of MIS — relational databases, SQL, C#/C++, and business processes — to bridge engineering and operations.",
  },
  {
    year: "2014",
    title: "Operations Manager — J.B. Hunt",
    body:
      "After a B.B.A. in Management with a supply-chain focus, joined J.B. Hunt as an Operations Manager. Identified underlying problems, analyzed solutions, and shipped resolutions at scale.",
  },
  {
    year: "2010",
    title: "First exposure to code — Java & C++ electives",
    body:
      "Junior year I took Java and C++ as electives. The curiosity stuck — I just didn't know yet how I'd get back to it.",
  },
];

const PILLARS = [
  {
    title: "Systems thinking",
    body:
      "Most product problems are system problems in disguise. I look for the architectural shape before I optimize the code.",
  },
  {
    title: "Ship and observe",
    body:
      "Code earns its place once it's running in production with telemetry on it. Plans without instrumentation are just opinions.",
  },
  {
    title: "Teach forward",
    body:
      "Knowledge compounds the moment you write it down. Mentoring, documentation, and the blog are part of the job, not extras.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%      { transform: scale(1.35); opacity: 0.6; }
`;

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

const Page = styled.div`
  background: #0f1216;
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  min-height: 100vh;
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

const Container = styled.div`
  max-width: 1080px;
  margin: 0 auto;
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
  background: radial-gradient(
    55% 50% at 50% 0%,
    rgba(32, 106, 93, 0.16),
    transparent 70%
  );
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
`;

const HeroShell = styled(Container)`
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(220px, 320px) 1fr;
  gap: 56px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 36px;
    text-align: center;
    justify-items: center;
  }
`;

const PortraitFrame = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: 320px;
  aspect-ratio: 4 / 5;
  border-radius: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.03) inset;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 45%,
      rgba(15, 18, 22, 0.55) 100%
    );
    pointer-events: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    filter: grayscale(0.18) contrast(1.04);
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
  font-size: clamp(40px, 6vw, 68px);
  line-height: 1.04;
  letter-spacing: -0.028em;
  color: #f4f6f8;
  margin: 0;

  em {
    font-style: normal;
    color: #5bb39e;
  }
`;

const HeroIntro = styled(motion.p)`
  font-size: clamp(15px, 1.5vw, 18px);
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;
  max-width: 560px;
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

const PrimaryBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 10px;
  background: #206a5d;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-decoration: none;
  box-shadow: 0 8px 22px rgba(32, 106, 93, 0.28);
  transition: background 0.18s ease, transform 0.12s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: #267a6b;
    color: #fff;
    text-decoration: none;
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(32, 106, 93, 0.4);
  }
`;

const GhostBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.12);
  text-decoration: none;
  transition: background 0.18s ease, transform 0.12s ease,
    border-color 0.18s ease, color 0.18s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    text-decoration: none;
    transform: translateY(-1px);
    border-color: rgba(255, 255, 255, 0.22);
  }
`;

/* ---- Story ---- */

const StoryShell = styled(Container)`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 56px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const StoryLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6b7479;
  padding-top: 12px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -10px;
    width: 24px;
    height: 1px;
    background: rgba(91, 179, 158, 0.4);
  }
`;

const StoryBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 680px;

  p {
    font-size: clamp(15px, 1.3vw, 17px);
    line-height: 1.65;
    color: #c5cbcf;
    margin: 0;

    em {
      font-style: normal;
      color: #f4f6f8;
      font-weight: 600;
    }
  }
`;

/* ---- Quote ---- */

const QuoteWrap = styled(Container)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 760px;
`;

const QuoteMark = styled.div`
  font-family: Georgia, serif;
  font-size: 84px;
  line-height: 1;
  color: #5bb39e;
  opacity: 0.45;
  margin-bottom: -32px;
`;

const QuoteText = styled.blockquote`
  font-family: Georgia, "Times New Roman", serif;
  font-style: italic;
  font-size: clamp(22px, 2.6vw, 32px);
  line-height: 1.4;
  color: #f4f6f8;
  margin: 0;
  letter-spacing: -0.005em;
`;

const QuoteAttribution = styled.div`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;
  margin-top: 8px;
`;

/* ---- Timeline ---- */

const TimelineShell = styled(Container)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TimelineHeader = styled.div`
  text-align: center;
  margin-bottom: 56px;

  @media (max-width: 720px) {
    margin-bottom: 36px;
  }
`;

const TimelineList = styled.ol`
  list-style: none;
  margin: 0 auto;
  padding: 0;
  position: relative;
  max-width: 800px;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 100px;
    width: 1px;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(91, 179, 158, 0.4) 8%,
      rgba(91, 179, 158, 0.2) 92%,
      transparent 100%
    );

    @media (max-width: 720px) {
      left: 14px;
    }
  }
`;

const TimelineItem = styled(motion.li)`
  position: relative;
  display: grid;
  grid-template-columns: 80px 40px 1fr;
  align-items: start;
  gap: 0;
  padding: 18px 0;

  @media (max-width: 720px) {
    grid-template-columns: 38px 1fr;
    padding: 14px 0;
  }
`;

const TimelineYear = styled.span`
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.01em;
  color: #5bb39e;
  align-self: flex-start;
  padding-top: 2px;

  @media (max-width: 720px) {
    display: none;
  }
`;

const TimelineYearMobile = styled.span`
  display: none;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: -0.01em;
  color: #5bb39e;

  @media (max-width: 720px) {
    display: inline-block;
    margin-bottom: 4px;
  }
`;

const TimelineDot = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ current }) => (current ? "#5bb39e" : "#1e2a31")};
    border: 2px solid ${({ current }) => (current ? "#5bb39e" : "#3b4a52")};
    box-shadow: ${({ current }) =>
      current ? "0 0 12px rgba(91, 179, 158, 0.55)" : "none"};
    z-index: 1;
    ${({ current }) =>
      current &&
      css`
        animation: ${pulse} 2.4s ease-in-out infinite;
      `}
  }
`;

const TimelineBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 14px;
  padding-bottom: 4px;
`;

const TimelineTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.005em;
  line-height: 1.35;
  color: #f4f6f8;
  margin: 0;
`;

const TimelineDesc = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #a3acb2;
  margin: 0;
`;

/* ---- Pillars ---- */

const PillarShell = styled(Container)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Pillar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 28px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.008) 100%
  );
  transition: border-color 0.22s ease, transform 0.22s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.22);
    transform: translateY(-3px);
  }

  .num {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #5bb39e;
  }
  h3 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.012em;
    color: #f4f6f8;
    margin: 0;
  }
  p {
    font-size: 14px;
    line-height: 1.6;
    color: #a3acb2;
    margin: 0;
  }
`;

/* ---- Contact CTA ---- */

const ContactShell = styled(Container)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 640px;
`;

const ContactCard = styled.div`
  width: 100%;
  margin-top: 12px;
  padding: 28px;
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    rgba(91, 179, 158, 0.07) 0%,
    rgba(91, 179, 158, 0.02) 100%
  );
  border: 1px solid rgba(91, 179, 158, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const EmailPill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(15, 18, 22, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 14px;
  font-weight: 500;
  color: #f4f6f8;
  text-decoration: none;
  transition: border-color 0.18s ease, background 0.18s ease;

  svg {
    color: #5bb39e;
  }

  &:hover {
    color: #fff;
    text-decoration: none;
    background: rgba(15, 18, 22, 0.7);
    border-color: rgba(91, 179, 158, 0.4);
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const About = () => {
  return (
    <Page>
      {/* 1. Hero */}
      <Section>
        <HeroBg />
        <HeroGrid />
        <HeroShell>
          <PortraitFrame
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <img src={PORTRAIT} alt="Dominique Hosea" />
          </PortraitFrame>

          <HeroContent>
            <HeroBadge>About</HeroBadge>
            <HeroTitle
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              I build <em>systems</em>
              <br />
              for a living.
            </HeroTitle>
            <HeroIntro
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              Hi, I'm Dominique Hosea — a senior software engineer working on
              distributed systems, AI products, and the kind of infrastructure
              that lets small teams move like large ones.
            </HeroIntro>
            <HeroActions
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <PrimaryBtn href="#contact">
                Get in touch
                <FiArrowRight size={14} />
              </PrimaryBtn>
              <GhostBtn href={RESUME} target="_blank" rel="noopener noreferrer">
                Resume
                <FiArrowUpRight size={14} />
              </GhostBtn>
            </HeroActions>
          </HeroContent>
        </HeroShell>
      </Section>

      {/* 2. Story */}
      <Section style={{ paddingTop: 0 }}>
        <StoryShell>
          <StoryLabel>The story</StoryLabel>
          <StoryBody>
            <p>
              I came to engineering sideways. In college I picked up Java and
              C++ as electives because they looked interesting — but I
              followed the more conventional path first, finishing a B.B.A.
              in Management with a supply-chain focus and taking an{" "}
              <em>Operations Manager</em> role at J.B. Hunt in 2014.
            </p>
            <p>
              The pattern in operations was the same as in software:{" "}
              <em>identify underlying problems</em>, analyze possible
              solutions, ship resolutions. I went back for an M.S. in
              Management Information Systems in 2017 to formalize the
              connection — relational databases, SQL, C#/C++, and how
              technology fits real business processes.
            </p>
            <p>
              In 2020 I enrolled in General Assembly's immersive full-stack
              program — MERN, Python, Django, OAuth, SPA architecture — and
              landed at <em>State Farm</em> as a full-stack Java engineer in
              March 2021. Promoted to Software Engineer II within the year,
              and since then I've moved into architecture and SRE: serverless
              on AWS, Lambda + DynamoDB, Terraform, chaos engineering,
              observability with OpenTelemetry.
            </p>
            <p>
              Alongside the day job I've been the{" "}
              <em>Lead Backend Engineer</em> at Aimly (Austin) building a
              digital fundraising platform — API design, serverless data
              layer, payment integration. And I write about all of it on the
              blog.
            </p>
          </StoryBody>
        </StoryShell>
      </Section>

      {/* 3. Quote */}
      <Section style={{ paddingTop: 64, paddingBottom: 64 }}>
        <QuoteWrap>
          <QuoteMark>&ldquo;</QuoteMark>
          <QuoteText>
            What you think, you become. What you feel, you attract. What you
            imagine, you create.
          </QuoteText>
          <QuoteAttribution>— Buddha</QuoteAttribution>
        </QuoteWrap>
      </Section>

      {/* 4. Timeline */}
      <Section style={{ paddingTop: 64 }}>
        <TimelineShell>
          <TimelineHeader>
            <Kicker>Timeline</Kicker>
            <Heading>
              How I got <em>here</em>.
            </Heading>
            <Tagline>
              The roles, degrees, and inflection points that shaped how I
              think about software today.
            </Tagline>
          </TimelineHeader>

          <TimelineList>
            {TIMELINE.map((entry, idx) => (
              <TimelineItem
                key={entry.year}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={idx}
              >
                <TimelineYear>{entry.year}</TimelineYear>
                <TimelineDot current={idx === 0 ? 1 : 0} />
                <TimelineBody>
                  <TimelineYearMobile>{entry.year}</TimelineYearMobile>
                  <TimelineTitle>{entry.title}</TimelineTitle>
                  <TimelineDesc>{entry.body}</TimelineDesc>
                </TimelineBody>
              </TimelineItem>
            ))}
          </TimelineList>
        </TimelineShell>
      </Section>

      {/* 5. Pillars / how I work */}
      <Section style={{ paddingTop: 64 }}>
        <Container style={{ textAlign: "center", marginBottom: 48 }}>
          <Kicker>How I work</Kicker>
          <Heading>
            Three things I <em>actually</em> believe.
          </Heading>
        </Container>
        <PillarShell>
          {PILLARS.map((p, i) => (
            <Pillar key={p.title}>
              <span className="num">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </Pillar>
          ))}
        </PillarShell>
      </Section>

      {/* 6. Contact CTA */}
      <Section id="contact" style={{ paddingTop: 64, paddingBottom: 120 }}>
        <ContactShell>
          <Kicker>Contact</Kicker>
          <Heading>Let's build something.</Heading>
          <Tagline>
            Available for select engagements — backend systems, AI products,
            and infrastructure work.
          </Tagline>
          <ContactCard>
            <EmailPill href="mailto:mr.dhosea@gmail.com">
              <FiMail size={14} />
              mr.dhosea@gmail.com
            </EmailPill>
            <PrimaryBtn href="mailto:mr.dhosea@gmail.com?subject=Hello%20Dominique">
              Send a message
              <FiArrowRight size={14} />
            </PrimaryBtn>
          </ContactCard>
        </ContactShell>
      </Section>
    </Page>
  );
};

export default About;
