import React from "react";
import styled from "styled-components";
import {
  FaReact,
  FaNodeJs,
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaPython,
  FaGitlab,
  FaAws,
  FaDocker,
  FaJava,
  FaTools,
  FaLayerGroup,
  FaNetworkWired,
} from "react-icons/fa";
import {
  SiMongodb,
  SiPostgresql,
  SiTerraform,
  SiSpringboot,
  SiKubernetes,
  SiTypescript,
  SiPrometheus,
  SiSplunk,
  SiAmazoncloudwatch,
  SiAwslambda,
  SiAmazondynamodb,
  SiAmazonec2,
  SiAmazons3,
  SiGithubactions,
} from "react-icons/si";
import { TbBrandReactNative } from "react-icons/tb";
import {
  MdArchitecture,
  MdMonitorHeart,
  MdSecurity,
} from "react-icons/md";
import { VscGraph, VscServerProcess } from "react-icons/vsc";
import { GrStatusGoodSmall, GrOptimize } from "react-icons/gr";
import { BiGitBranch, BiCodeBlock } from "react-icons/bi";

/* ------------------------------------------------------------------
   Data
------------------------------------------------------------------ */

const CATEGORIES = [
  {
    label: "Languages",
    items: [
      { name: "Python", icon: <FaPython />, color: "#3776AB" },
      { name: "TypeScript", icon: <SiTypescript />, color: "#3178C6" },
      { name: "JavaScript", icon: <FaJs />, color: "#F7DF1E" },
      { name: "Java", icon: <FaJava />, color: "#007396" },
      { name: "HTML5", icon: <FaHtml5 />, color: "#E34F26" },
      { name: "CSS3", icon: <FaCss3Alt />, color: "#1572B6" },
    ],
  },
  {
    label: "Frameworks",
    items: [
      { name: "React", icon: <FaReact />, color: "#61DAFB" },
      { name: "Node.js", icon: <FaNodeJs />, color: "#539E43" },
      { name: "Spring Boot", icon: <SiSpringboot />, color: "#6DB33F" },
      { name: "React Native", icon: <TbBrandReactNative />, color: "#61DAFB" },
    ],
  },
  {
    label: "Cloud & Infrastructure",
    items: [
      { name: "AWS", icon: <FaAws />, color: "#FF9900" },
      { name: "Lambda", icon: <SiAwslambda />, color: "#FF9900" },
      { name: "DynamoDB", icon: <SiAmazondynamodb />, color: "#4053D6" },
      { name: "EC2", icon: <SiAmazonec2 />, color: "#FF9900" },
      { name: "S3", icon: <SiAmazons3 />, color: "#569A31" },
      { name: "Terraform", icon: <SiTerraform />, color: "#5C4EE5" },
      { name: "Kubernetes", icon: <SiKubernetes />, color: "#326CE5" },
      { name: "Docker", icon: <FaDocker />, color: "#2496ED" },
    ],
  },
  {
    label: "Data",
    items: [
      { name: "MongoDB", icon: <SiMongodb />, color: "#47A248" },
      { name: "PostgreSQL", icon: <SiPostgresql />, color: "#4f8fbf" },
    ],
  },
  {
    label: "Observability & CI/CD",
    items: [
      { name: "Prometheus", icon: <SiPrometheus />, color: "#E6522C" },
      { name: "Splunk", icon: <SiSplunk />, color: "#FF525B" },
      { name: "CloudWatch", icon: <SiAmazoncloudwatch />, color: "#FF9900" },
      { name: "Tracing", icon: <VscGraph />, color: "#9d8bff" },
      { name: "GitHub Actions", icon: <SiGithubactions />, color: "#2088FF" },
      { name: "GitLab CI", icon: <FaGitlab />, color: "#FC6D26" },
      { name: "IaC", icon: <BiCodeBlock />, color: "#8aa3bf" },
    ],
  },
  {
    label: "SRE & Systems",
    items: [
      { name: "Microservices", icon: <FaLayerGroup />, color: "#00BFA5" },
      { name: "Distributed Systems", icon: <FaNetworkWired />, color: "#5fa3ff" },
      { name: "Architecture", icon: <MdArchitecture />, color: "#FF85b3" },
      { name: "Reliability", icon: <GrStatusGoodSmall />, color: "#56e289" },
      { name: "Incident Mgmt", icon: <MdMonitorHeart />, color: "#F76060" },
      { name: "System Tuning", icon: <GrOptimize />, color: "#5a9eff" },
      { name: "Automation", icon: <FaTools />, color: "#9d8bff" },
      { name: "Serverless", icon: <VscServerProcess />, color: "#FD7A75" },
      { name: "Security", icon: <MdSecurity />, color: "#79d987" },
      { name: "Git", icon: <BiGitBranch />, color: "#F05032" },
    ],
  },
];

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

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

const BgGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: radial-gradient(
    ellipse 70% 60% at 50% 50%,
    #000 40%,
    transparent 100%
  );
  -webkit-mask-image: radial-gradient(
    ellipse 70% 60% at 50% 50%,
    #000 40%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 0;
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 64px;

  @media (max-width: 720px) {
    margin-bottom: 48px;
  }
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
  font-family: "Lato", sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 52px);
  line-height: 1.08;
  letter-spacing: -0.022em;
  color: #f4f6f8;
  margin: 0 0 14px;
`;

const Tagline = styled.p`
  font-family: "Lato", sans-serif;
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.55;
  color: #a3acb2;
  max-width: 560px;
  margin: 0 auto;
`;

const Categories = styled.div`
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (max-width: 720px) {
    gap: 36px;
  }
`;

const Category = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 32px;
  align-items: start;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const CategoryLabel = styled.div`
  font-family: "Lato", sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6b7479;
  padding-top: 14px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -8px;
    width: 24px;
    height: 1px;
    background: rgba(91, 179, 158, 0.4);
  }

  @media (max-width: 720px) {
    padding-top: 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  }
`;

const Card = styled.div`
  --tech-color: ${({ color }) => color};
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.02);
  border-radius: 10px;
  transition: border-color 0.2s ease, background 0.2s ease,
    transform 0.18s ease;
  cursor: default;

  &:hover {
    border-color: color-mix(in srgb, var(--tech-color) 35%, transparent);
    background: rgba(255, 255, 255, 0.035);
    transform: translateY(-1px);
  }

  &:hover .icon {
    color: var(--tech-color);
    filter: drop-shadow(0 0 6px color-mix(in srgb, var(--tech-color) 60%, transparent));
  }
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: #c5cbcf;
  transition: color 0.2s ease, filter 0.2s ease;
  flex-shrink: 0;

  svg {
    display: block;
  }
`;

const Label = styled.span`
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #d2d8da;
  letter-spacing: 0.005em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const Tech = () => {
  return (
    <Section id="tech">
      <BgGrid />
      <Shell>
        <Header>
          <Kicker>Stack</Kicker>
          <Heading>Tools I reach for.</Heading>
          <Tagline>
            A working set across languages, cloud infrastructure, and the
            reliability practices that hold systems together in production.
          </Tagline>
        </Header>

        <Categories>
          {CATEGORIES.map((cat) => (
            <Category key={cat.label}>
              <CategoryLabel>{cat.label}</CategoryLabel>
              <Grid>
                {cat.items.map((item) => (
                  <Card key={item.name} color={item.color}>
                    <IconWrap className="icon">{item.icon}</IconWrap>
                    <Label>{item.name}</Label>
                  </Card>
                ))}
              </Grid>
            </Category>
          ))}
        </Categories>
      </Shell>
    </Section>
  );
};

export default Tech;
