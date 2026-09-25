import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import marked from "marked";
import DOMPurify from "dompurify";
import {
  programsOf,
  alternativesOf,
  curriculumProgress,
  statusOf,
  clamp,
  num,
  formatCost,
} from "./roadmapUtils";

/*
  Same markdown pipeline as src/Components/Article/EditorCore.jsx: marked v3's
  DEFAULT export is the function. Do not "modernize" this to `{ marked }` —
  that is the v4+ shape and this repo pins v3.
*/
const renderMarkdown = (text) => ({
  __html: DOMPurify.sanitize(marked(String(text || ""))),
});

const Panel = styled.aside`
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.022);
  overflow: hidden;
`;

const Head = styled.div`
  padding: 16px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  gap: 12px;
  align-items: flex-start;

  .grow { flex: 1; min-width: 0; }
  .eyebrow {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7479;
    font-weight: 700;
  }
  h3 {
    font-size: 19px;
    font-weight: 700;
    margin: 3px 0 0;
    line-height: 1.25;
    color: #f4f6f8;
  }
  .sub { font-size: 12px; color: #6b7479; margin-top: 4px; }
  .swatch { width: 11px; height: 11px; border-radius: 3px; margin-top: 7px; flex: none; }
`;

const Body = styled.div`
  padding: 16px 18px;
  display: grid;
  gap: 16px;
  max-height: min(70vh, 860px);
  overflow-y: auto;
`;

const Empty = styled.div`
  padding: 26px 18px;
  color: #6b7479;
  font-size: 13.5px;
  line-height: 1.6;
`;

const Block = styled.div`
  display: grid;
  gap: 5px;

  > .k {
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7479;
    font-weight: 700;
  }
  > .v { font-size: 13.5px; color: #f4f6f8; white-space: pre-wrap; line-height: 1.55; }
  > .v.empty { color: #4d5559; font-style: italic; }
`;

const Prose = styled.div`
  font-size: 13.5px;
  line-height: 1.6;
  color: #cbd2d8;

  p { margin: 0 0 9px; }
  ul, ol { margin: 0 0 9px; padding-left: 18px; }
  li { margin-bottom: 4px; }
  strong { color: #f4f6f8; }
  em { color: #a3acb2; }
  a { color: #5bb39e; }
  > :last-child { margin-bottom: 0; }
`;

const Meter = styled.div`
  height: 7px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;

  > i { display: block; height: 100%; border-radius: 99px; }
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  span {
    font-size: 11.5px;
    padding: 3px 9px;
    border-radius: 99px;
    background: rgba(255, 255, 255, 0.05);
    color: #a3acb2;
  }
`;

const ProgramList = styled.div`
  display: grid;
  gap: 8px;

  button {
    display: grid;
    gap: 7px;
    width: 100%;
    text-align: left;
    background: rgba(255, 255, 255, 0.025);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 8px;
    padding: 10px 12px;
    color: inherit;
    font-family: inherit;
    cursor: pointer;
  }
  button:hover { border-color: rgba(91, 179, 158, 0.35); }

  .top { display: flex; gap: 10px; align-items: baseline; justify-content: space-between; }
  .nm { font-size: 13.5px; font-weight: 600; color: #f4f6f8; }
  .pct { font-size: 12px; color: #6b7479; font-variant-numeric: tabular-nums; }
  .sub { font-size: 11.5px; color: #6b7479; }
`;

const AltCard = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 12px 13px;
  display: grid;
  gap: 8px;

  .top { display: flex; align-items: baseline; gap: 9px; flex-wrap: wrap; }
  .kind {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 99px;
    color: ${(p) => (p.$free ? "#5bb39e" : "#e0a05f")};
    background: ${(p) => (p.$free ? "rgba(91,179,158,.13)" : "rgba(224,160,95,.13)")};
  }
  .nm { font-size: 14px; font-weight: 700; color: #f4f6f8; }
  .sub { font-size: 11.5px; color: #6b7479; }
  .cost { font-size: 15px; font-weight: 700; color: #f4f6f8; font-variant-numeric: tabular-nums; }
  .cost small { font-size: 11.5px; font-weight: 400; color: #6b7479; }
  .unchecked { font-size: 12px; font-style: italic; color: #6b7479; }
  .trade { font-size: 12.5px; color: #a3acb2; line-height: 1.55; }
  a { color: #5bb39e; font-size: 12.5px; font-weight: 600; text-decoration: none; }
  a:hover { text-decoration: underline; }
`;

const Btn = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  color: #f4f6f8;
  font-family: inherit;
  font-size: 12.5px;
  padding: 6px 11px;
  cursor: pointer;
  &:hover { background: rgba(255, 255, 255, 0.05); }
`;

const Slider = styled.input`
  width: 100%;
  accent-color: #5bb39e;
  margin-top: 4px;
`;

function Kv({ label, value, empty }) {
  const has = value !== null && value !== undefined && String(value).trim() !== "";
  return (
    <Block>
      <div className="k">{label}</div>
      <div className={has ? "v" : "v empty"}>{has ? value : empty || "Not set"}</div>
    </Block>
  );
}

/* ------------------------------------------------------------------
   Program detail
------------------------------------------------------------------ */

function ProgramDetail({ program, curriculum, onBack, onEdit, onProgress }) {
  const [local, setLocal] = useState(clamp(num(program.progress, 0), 0, 100));
  const timer = useRef(null);

  // Re-sync when a different program is opened, or the server value changes.
  useEffect(() => {
    setLocal(clamp(num(program.progress, 0), 0, 100));
  }, [program.slug, program.progress]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const color = curriculum?.color || "#5bb39e";

  const handleSlide = (e) => {
    const value = Number(e.target.value);
    setLocal(value);
    // Coalesce a drag into one request per pause rather than one per event.
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onProgress(program, value), 400);
  };

  return (
    <Panel>
      <Head>
        <div className="grow">
          <div className="eyebrow">{curriculum?.name || "Program"}</div>
          <h3>{program.name}</h3>
          {program.code || program.provider ? (
            <div className="sub">{[program.code, program.provider].filter(Boolean).join(" · ")}</div>
          ) : null}
        </div>
        <Btn type="button" onClick={() => onEdit(program)}>Edit</Btn>
      </Head>

      <Body>
        <Block>
          <div className="k">Progress · {statusOf(local)}</div>
          <Meter><i style={{ width: `${local}%`, background: color }} /></Meter>
          <Slider
            type="range"
            min={0}
            max={100}
            step={5}
            value={local}
            onChange={handleSlide}
            aria-label={`Progress for ${program.name}`}
          />
          <div className="v" style={{ fontSize: 12, color: "#6b7479" }}>{local}%</div>
        </Block>

        {program.lengthLabel ? <Kv label="Length" value={program.lengthLabel} /> : null}

        {program.detail ? (
          <Block>
            <div className="k">What it is</div>
            <Prose dangerouslySetInnerHTML={renderMarkdown(program.detail)} />
          </Block>
        ) : null}

        {Array.isArray(program.teaches) && program.teaches.length ? (
          <Block>
            <div className="k">Teaches</div>
            <Chips>
              {program.teaches.map((t) => <span key={t}>{t}</span>)}
            </Chips>
          </Block>
        ) : null}

        {program.outcome ? <Kv label="You come out with" value={program.outcome} /> : null}

        {program.link ? (
          <Block>
            <div className="k">Course</div>
            <div>
              <a
                href={program.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#5bb39e", fontSize: 12.5, fontWeight: 600 }}
              >
                {program.link.replace(/^https?:\/\//, "").replace(/\/$/, "")} →
              </a>
            </div>
          </Block>
        ) : null}

        <div>
          <Btn type="button" onClick={onBack}>← Back to {curriculum?.name || "curriculum"}</Btn>
        </div>
      </Body>
    </Panel>
  );
}

/* ------------------------------------------------------------------
   Curriculum detail
------------------------------------------------------------------ */

function CurriculumDetail({
  curriculum, programs, alternatives, onEdit, onOpenProgram,
  onAddProgram, onAddAlternative, onEditAlternative,
}) {
  const list = programsOf(programs, curriculum.slug);
  const alts = alternativesOf(alternatives, curriculum.slug);
  const pct = curriculumProgress(programs, curriculum.slug);
  const color = curriculum.color || "#5bb39e";

  return (
    <Panel>
      <Head>
        <span className="swatch" style={{ background: color }} />
        <div className="grow">
          <div className="eyebrow">Curriculum</div>
          <h3>{curriculum.name}</h3>
          <div className="sub">
            {curriculum.rating ? `Rated ${curriculum.rating} of 5` : "Unrated"}
            {" · "}
            {`M${curriculum.startMonth}–M${curriculum.endMonth}`}
          </div>
        </div>
        <Btn type="button" onClick={() => onEdit(curriculum)}>Edit</Btn>
      </Head>

      <Body>
        <Kv label="Why" value={curriculum.why} empty="Not recorded yet — the field worth filling in first." />
        <Kv label="Short-term goal" value={curriculum.shortTermGoal} />
        <Kv label="Long-term goal" value={curriculum.longTermGoal} />

        {pct !== null ? (
          <Block>
            <div className="k">
              Progress · average of {list.length} program{list.length === 1 ? "" : "s"}
            </div>
            <Meter><i style={{ width: `${pct}%`, background: color }} /></Meter>
            <div className="v" style={{ fontSize: 12, color: "#6b7479" }}>
              {pct}% · {statusOf(pct)}
            </div>
          </Block>
        ) : null}

        {curriculum.detail ? (
          <Block>
            <div className="k">About</div>
            <Prose dangerouslySetInnerHTML={renderMarkdown(curriculum.detail)} />
          </Block>
        ) : null}

        <Block>
          <div className="k">Programs</div>
          {list.length ? (
            <ProgramList>
              {list.map((p) => {
                const ppct = clamp(num(p.progress, 0), 0, 100);
                return (
                  <button key={p.slug} type="button" onClick={() => onOpenProgram(p)}>
                    <div className="top">
                      <span className="nm">{p.name}</span>
                      <span className="pct">{ppct}%</span>
                    </div>
                    <Meter><i style={{ width: `${ppct}%`, background: color }} /></Meter>
                    {p.code || p.lengthLabel ? (
                      <div className="sub">{[p.code, p.lengthLabel].filter(Boolean).join(" · ")}</div>
                    ) : null}
                  </button>
                );
              })}
            </ProgramList>
          ) : (
            <div className="v empty">No programs yet.</div>
          )}
          <div style={{ marginTop: 8 }}>
            <Btn type="button" onClick={() => onAddProgram(curriculum)}>+ Add program</Btn>
          </div>
        </Block>

        <Block>
          <div className="k">Alternative routes</div>
          {alts.length ? (
            <div style={{ display: "grid", gap: 10 }}>
              {alts.map((a) => {
                const cost = formatCost(a);
                return (
                  <AltCard key={a.slug} $free={a.kind === "free"}>
                    <div className="top">
                      <span className="kind">{a.kind === "free" ? "Free" : "Paid"}</span>
                      <span className="nm">{a.name}</span>
                      <span style={{ marginLeft: "auto" }}>
                        <Btn type="button" onClick={() => onEditAlternative(a)}>Edit</Btn>
                      </span>
                    </div>
                    {a.provider || a.credential || a.format ? (
                      <div className="sub">
                        {[a.provider, a.credential, a.format].filter(Boolean).join(" · ")}
                      </div>
                    ) : null}
                    {cost ? (
                      <div className="cost">
                        {cost} {a.costUnit ? <small>{a.costUnit}</small> : null}
                      </div>
                    ) : (
                      <div className="unchecked">Cost not recorded — check the link</div>
                    )}
                    {a.costNote ? <div className="sub">{a.costNote}</div> : null}
                    {a.tradeoff ? <div className="trade">{a.tradeoff}</div> : null}
                    {a.link ? (
                      <div>
                        <a href={a.link} target="_blank" rel="noopener noreferrer">Open →</a>
                      </div>
                    ) : null}
                  </AltCard>
                );
              })}
            </div>
          ) : (
            <div className="v empty">
              No alternatives recorded. Add the paid route you would take instead, so the
              comparison sits next to the plan.
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <Btn type="button" onClick={() => onAddAlternative(curriculum)}>+ Add alternative</Btn>
          </div>
        </Block>
      </Body>
    </Panel>
  );
}

/* ------------------------------------------------------------------
   Switch
------------------------------------------------------------------ */

export default function RoadmapDetail(props) {
  const { selection, curricula, programs } = props;

  if (!selection) {
    return (
      <Panel>
        <Empty>
          Select a curriculum or a program to see its details, its goals, and the free or
          paid alternatives that reach the same skills.
        </Empty>
      </Panel>
    );
  }

  if (selection.kind === "program") {
    const program = programs.find((p) => p.slug === selection.slug);
    if (!program) return <Panel><Empty>That program is no longer here.</Empty></Panel>;
    const curriculum = curricula.find((c) => c.slug === program.curriculumSlug);
    return (
      <ProgramDetail
        program={program}
        curriculum={curriculum}
        onBack={() => props.onSelect({ kind: "curriculum", slug: program.curriculumSlug })}
        onEdit={props.onEditProgram}
        onProgress={props.onProgress}
      />
    );
  }

  const curriculum = curricula.find((c) => c.slug === selection.slug);
  if (!curriculum) return <Panel><Empty>That curriculum is no longer here.</Empty></Panel>;

  return (
    <CurriculumDetail
      curriculum={curriculum}
      programs={programs}
      alternatives={props.alternatives}
      onEdit={props.onEditCurriculum}
      onOpenProgram={(p) => props.onSelect({ kind: "program", slug: p.slug })}
      onAddProgram={props.onAddProgram}
      onAddAlternative={props.onAddAlternative}
      onEditAlternative={props.onEditAlternative}
    />
  );
}
