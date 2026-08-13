import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import {
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
  FaYoutube,
  FaCodepen,
} from "react-icons/fa";
import {
  FiMail,
  FiMapPin,
  FiArrowRight,
  FiArrowUpRight,
  FiClock,
} from "react-icons/fi";
import { useNotification } from "../../GlobalState";

const EMAIL = "mr.dhosea@gmail.com";
const GETFORM_ENDPOINT = "https://getform.io/f/7efda21f-ca67-48f6-8a1e-723776d4ae3b";

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/dominique-hosea/",
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

const FAQS = [
  {
    q: "What kind of work are you available for?",
    a: "Backend engineering and infrastructure work — distributed systems, AI products, serverless on AWS. Open to consulting, advisory, and select full-time roles.",
  },
  {
    q: "What's your typical response time?",
    a: "I read everything within 24-48 hours. If it's time-sensitive, lead with that in the subject line.",
  },
  {
    q: "Do you take freelance / contract work?",
    a: "Selectively. Best fit is backend / API / cloud infrastructure — happy to talk if it sounds like a match.",
  },
];

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
  max-width: 1120px;
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

const Heading = styled.h1`
  font-weight: 800;
  font-size: clamp(40px, 6vw, 68px);
  line-height: 1.04;
  letter-spacing: -0.028em;
  color: #f4f6f8;
  margin: 0 0 14px;

  em {
    font-style: normal;
    color: #5bb39e;
  }
`;

const Tagline = styled.p`
  font-size: clamp(15px, 1.4vw, 18px);
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

const HeroInner = styled(Container)`
  position: relative;
  z-index: 1;
  text-align: center;
`;

const AvailabilityPill = styled(motion.div)`
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
  margin-bottom: 18px;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #5bb39e;
    box-shadow: 0 0 10px rgba(91, 179, 158, 0.7);
    animation: pulse 2.4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.35); opacity: 0.6; }
  }
`;

/* ---- Body: form + details ---- */

const BodyShell = styled(Container)`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 56px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`;

const FormCard = styled(motion.div)`
  padding: 32px;
  border-radius: 18px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.008) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 18px;

  @media (max-width: 720px) {
    padding: 24px;
  }
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  .label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: #5bb39e;
  }
  h3 {
    font-size: 22px;
    font-weight: 700;
    color: #f4f6f8;
    margin: 0;
    letter-spacing: -0.012em;
  }
  p {
    font-size: 14px;
    line-height: 1.55;
    color: #a3acb2;
    margin: 0;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.div`
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
`;

const inputStyles = `
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(15, 18, 22, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;

  &::placeholder {
    color: #6b7479;
  }
  &:focus {
    border-color: rgba(91, 179, 158, 0.45);
    box-shadow: 0 0 0 3px rgba(91, 179, 158, 0.15);
    background: rgba(15, 18, 22, 0.8);
  }
`;

const Input = styled.input`
  ${inputStyles}
`;

const Textarea = styled.textarea`
  ${inputStyles}
  min-height: 140px;
  resize: vertical;
  font-family: "Lato", sans-serif;
`;

const SubmitBtn = styled.button`
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
    box-shadow 0.18s ease;
  margin-top: 4px;

  &:hover:not(:disabled) {
    background: #267a6b;
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(32, 106, 93, 0.4);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ---- Details column ---- */

const DetailsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DetailCard = styled(motion.div)`
  padding: 22px 24px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: border-color 0.18s ease, background 0.18s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.22);
    background: rgba(255, 255, 255, 0.035);
  }

  .icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(91, 179, 158, 0.1);
    border: 1px solid rgba(91, 179, 158, 0.22);
    color: #5bb39e;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  .label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6b7479;
  }
  .value {
    font-size: 15px;
    font-weight: 500;
    color: #f4f6f8;
    word-break: break-word;
  }
  .value a {
    color: inherit;
    text-decoration: none;
    transition: color 0.15s ease;
  }
  .value a:hover {
    color: #5bb39e;
    text-decoration: none;
  }
`;

const SocialBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 4px;
`;

const SocialLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #6b7479;
  padding-left: 4px;
`;

const SocialRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SocialBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-size: 13px;
  font-weight: 500;
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

/* ---- FAQ ---- */

const FaqShell = styled(Container)`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 56px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const FaqLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FaqHeading = styled.h2`
  font-weight: 800;
  font-size: clamp(28px, 3.6vw, 40px);
  line-height: 1.08;
  letter-spacing: -0.022em;
  color: #f4f6f8;
  margin: 0;

  em {
    font-style: normal;
    color: #5bb39e;
  }
`;

const FaqRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FaqItem = styled.details`
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 18px 4px;

  summary {
    list-style: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    font-size: 15px;
    font-weight: 600;
    color: #f4f6f8;
    letter-spacing: -0.005em;

    &::-webkit-details-marker {
      display: none;
    }
    &::after {
      content: "+";
      color: #5bb39e;
      font-size: 18px;
      font-weight: 400;
      transition: transform 0.2s ease;
    }
  }

  &[open] summary::after {
    transform: rotate(45deg);
  }

  p {
    margin: 12px 0 0;
    font-size: 14px;
    line-height: 1.6;
    color: #a3acb2;
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const Contact = () => {
  const dispatch = useNotification();
  const form = useRef(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    setSubmitting(true);
    dispatch({
      type: "SUCCESS",
      message: "Processing Your Request… Please Wait",
      title: "Successful Request",
    });
    // Let the native form submit to getform.io.
  };

  return (
    <Page>
      {/* 1. Hero */}
      <Section style={{ paddingBottom: 64 }}>
        <HeroBg />
        <HeroGrid />
        <HeroInner>
          <AvailabilityPill
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Available for select work
          </AvailabilityPill>
          <Heading>
            Let's <em>build</em> something.
          </Heading>
          <Tagline>
            Backend systems, AI products, infrastructure work. Drop a line
            below or email directly — I read everything within 24–48 hours.
          </Tagline>
        </HeroInner>
      </Section>

      {/* 2. Form + details */}
      <Section style={{ paddingTop: 0, paddingBottom: 64 }}>
        <BodyShell>
          <FormCard
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FormHeader>
              <span className="label">Send a message</span>
              <h3>Tell me about your project.</h3>
              <p>
                What you're building, what you need, and any timing constraints.
                I'll get back to you with thoughts.
              </p>
            </FormHeader>

            <Form
              ref={form}
              action={GETFORM_ENDPOINT}
              method="POST"
              onSubmit={handleSubmit}
            >
              <Field>
                <label htmlFor="contact-name">Name</label>
                <Input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                />
              </Field>
              <Field>
                <label htmlFor="contact-email">Email</label>
                <Input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  required
                />
              </Field>
              <Field>
                <label htmlFor="contact-message">Message</label>
                <Textarea
                  id="contact-message"
                  name="message"
                  placeholder="What are you working on?"
                  required
                />
              </Field>
              <SubmitBtn type="submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send message"}
                <FiArrowRight size={14} />
              </SubmitBtn>
            </Form>
          </FormCard>

          <div>
            <DetailsList>
              <DetailCard
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              >
                <span className="icon">
                  <FiMail size={16} />
                </span>
                <div className="body">
                  <span className="label">Email</span>
                  <span className="value">
                    <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                  </span>
                </div>
              </DetailCard>

              <DetailCard
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <span className="icon">
                  <FiMapPin size={16} />
                </span>
                <div className="body">
                  <span className="label">Based in</span>
                  <span className="value">Houston, TX · open to remote</span>
                </div>
              </DetailCard>

              <DetailCard
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <span className="icon">
                  <FiClock size={16} />
                </span>
                <div className="body">
                  <span className="label">Response time</span>
                  <span className="value">24–48 hours, typically faster</span>
                </div>
              </DetailCard>
            </DetailsList>

            <SocialBlock>
              <SocialLabel>Or find me on</SocialLabel>
              <SocialRow>
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
              </SocialRow>
            </SocialBlock>
          </div>
        </BodyShell>
      </Section>

      {/* 3. FAQ */}
      <Section style={{ paddingTop: 64, paddingBottom: 120 }}>
        <FaqShell>
          <FaqLeft>
            <Kicker>FAQ</Kicker>
            <FaqHeading>
              Quick <em>answers</em>.
            </FaqHeading>
          </FaqLeft>
          <FaqRight>
            {FAQS.map((f) => (
              <FaqItem key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </FaqItem>
            ))}
          </FaqRight>
        </FaqShell>
      </Section>
    </Page>
  );
};

export default Contact;
