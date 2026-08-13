import React, { useState } from 'react';
import styled from 'styled-components';
import { ubuntuTheme } from '../styled/tokens';
import { generateQuiz, isLive, TOPICS } from './aiQuizClient';

const COUNTS = [3, 5, 10];

const Wrap = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: ${ubuntuTheme.bg.coolGrey};
  color: ${ubuntuTheme.text.grey};
  font-family: ${ubuntuTheme.font.base};
  font-size: 0.875rem;
  overflow: hidden;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  background: ${ubuntuTheme.bg.windowTitle};
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
`;

const Title = styled.div`
  font-weight: 600;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Bolt = styled.span`
  display: inline-block;
  font-size: 1.05rem;
  line-height: 1;
  filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.4));
`;

const ModePill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${(p) => (p.$live ? '#16a34a' : 'rgba(255,255,255,0.1)')};
  color: ${(p) => (p.$live ? '#fff' : 'rgba(255,255,255,0.7)')};
  border: 1px solid ${(p) => (p.$live ? '#16a34a' : 'rgba(255,255,255,0.15)')};
`;

const NpmLink = styled.a`
  margin-left: auto;
  color: rgba(255, 255, 255, 0.55);
  font-size: 0.75rem;
  text-decoration: none;
  &:hover { color: ${ubuntuTheme.bg.orange}; }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 20px;
`;

const Card = styled.div`
  background: ${ubuntuTheme.bg.windowTitle};
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  padding: 20px;
  max-width: 640px;
  margin: 0 auto;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.7;
  margin: 14px 0 6px;
`;

const Select = styled.select`
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px 10px;
  font: inherit;
  cursor: pointer;
  outline: 0;
  &:focus { border-color: ${ubuntuTheme.bg.orange}; }
`;

const PrimaryBtn = styled.button`
  background: ${ubuntuTheme.bg.orange};
  color: #fff;
  border: 0;
  border-radius: 4px;
  padding: 10px 22px;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  margin-top: 18px;
  &:hover { filter: brightness(1.1); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const GhostBtn = styled.button`
  background: transparent;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 8px 16px;
  font: inherit;
  cursor: pointer;
  margin-top: 12px;
  &:hover { border-color: ${ubuntuTheme.bg.orange}; color: #fff; }
`;

const QuestionMeta = styled.div`
  font-size: 0.75rem;
  opacity: 0.6;
  margin-bottom: 8px;
`;

const Question = styled.div`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 16px;
  line-height: 1.4;
`;

const Choices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Choice = styled.button`
  text-align: left;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 10px 14px;
  font: inherit;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s;
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    border-color: ${ubuntuTheme.bg.orange};
  }
  &:disabled { cursor: default; }

  ${(p) => p.$state === 'correct' && `
    background: rgba(22, 163, 74, 0.18);
    border-color: #16a34a;
  `}
  ${(p) => p.$state === 'wrong' && `
    background: rgba(220, 38, 38, 0.18);
    border-color: #dc2626;
  `}
  ${(p) => p.$state === 'reveal' && `
    background: rgba(22, 163, 74, 0.10);
    border-color: rgba(22, 163, 74, 0.4);
  `}
`;

const Feedback = styled.div`
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  background: ${(p) => (p.$correct ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.12)')};
  border-left: 3px solid ${(p) => (p.$correct ? '#16a34a' : '#dc2626')};
`;

const FooterRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 18px;
`;

const ErrorBanner = styled.div`
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 4px;
  background: rgba(220, 38, 38, 0.12);
  border-left: 3px solid #dc2626;
  font-size: 0.85rem;
`;

const ScoreBig = styled.div`
  font-size: 2.4rem;
  font-weight: 700;
  text-align: center;
  margin: 12px 0;
  color: ${ubuntuTheme.bg.orange};
`;

const ScoreLine = styled.div`
  text-align: center;
  opacity: 0.8;
  font-size: 0.95rem;
`;

export function AiQuiz() {
  const [phase, setPhase] = useState('idle');
  const [topic, setTopic] = useState('any');
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const live = isLive();

  const start = async () => {
    setError(null);
    setPhase('loading');
    try {
      const { questions: qs } = await generateQuiz({ topic, n: count });
      if (!qs.length) throw new Error('No questions returned');
      setQuestions(qs);
      setIdx(0);
      setPicked(null);
      setScore(0);
      setPhase('playing');
    } catch (e) {
      setError(e?.message || 'Failed to load quiz');
      setPhase('idle');
    }
  };

  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === questions[idx].answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx + 1 >= questions.length) {
      setPhase('done');
      return;
    }
    setIdx(idx + 1);
    setPicked(null);
  };

  const reset = () => {
    setPhase('idle');
    setPicked(null);
    setIdx(0);
    setScore(0);
  };

  const current = questions[idx];

  return (
    <Wrap>
      <TopBar>
        <Title>
          <Bolt role="img" aria-label="lightning">⚡</Bolt> AI Quiz
        </Title>
        <ModePill $live={live}>{live ? 'Live AI' : 'Demo questions'}</ModePill>
        <NpmLink
          href="https://www.npmjs.com/package/ai-quiz"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by ai-quiz ↗
        </NpmLink>
      </TopBar>

      <Body>
        {phase === 'idle' && (
          <Card>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: 4 }}>
              Quick knowledge check
            </div>
            <div style={{ opacity: 0.7, fontSize: '0.85rem' }}>
              Pick a topic and how many questions you want.
            </div>

            <Label htmlFor="topic">Topic</Label>
            <Select id="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
              {TOPICS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </Select>

            <Label htmlFor="count">Questions</Label>
            <Select id="count" value={count} onChange={(e) => setCount(Number(e.target.value))}>
              {COUNTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>

            <PrimaryBtn onClick={start}>Start quiz</PrimaryBtn>
            {error && <ErrorBanner>{error}</ErrorBanner>}
          </Card>
        )}

        {phase === 'loading' && (
          <Card>
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              Building your quiz…
            </div>
          </Card>
        )}

        {phase === 'playing' && current && (
          <Card>
            <QuestionMeta>
              Question {idx + 1} of {questions.length} · Score {score}
            </QuestionMeta>
            <Question>{current.q}</Question>
            <Choices>
              {current.choices.map((c, i) => {
                let state;
                if (picked !== null) {
                  if (i === current.answer) state = picked === i ? 'correct' : 'reveal';
                  else if (i === picked) state = 'wrong';
                }
                return (
                  <Choice
                    key={i}
                    $state={state}
                    disabled={picked !== null}
                    onClick={() => pick(i)}
                  >
                    {c}
                  </Choice>
                );
              })}
            </Choices>

            {picked !== null && (
              <>
                <Feedback $correct={picked === current.answer}>
                  {picked === current.answer ? 'Correct.' : 'Not quite.'} {current.why}
                </Feedback>
                <FooterRow>
                  <span style={{ opacity: 0.6, fontSize: '0.8rem' }}>
                    {idx + 1 === questions.length ? 'Last one!' : ''}
                  </span>
                  <PrimaryBtn onClick={next} style={{ marginTop: 0 }}>
                    {idx + 1 === questions.length ? 'See score' : 'Next →'}
                  </PrimaryBtn>
                </FooterRow>
              </>
            )}
          </Card>
        )}

        {phase === 'done' && (
          <Card>
            <div style={{ textAlign: 'center', opacity: 0.7, fontSize: '0.9rem' }}>
              You scored
            </div>
            <ScoreBig>
              {score} / {questions.length}
            </ScoreBig>
            <ScoreLine>
              {score === questions.length
                ? 'Perfect run.'
                : score >= Math.ceil(questions.length * 0.7)
                ? 'Solid.'
                : score >= Math.ceil(questions.length * 0.4)
                ? 'Room to grow.'
                : 'Try a smaller topic next.'}
            </ScoreLine>
            <div style={{ textAlign: 'center' }}>
              <PrimaryBtn onClick={reset}>Try again</PrimaryBtn>
            </div>
          </Card>
        )}
      </Body>
    </Wrap>
  );
}

export default AiQuiz;

export const displayAiQuiz = () => <AiQuiz />;
