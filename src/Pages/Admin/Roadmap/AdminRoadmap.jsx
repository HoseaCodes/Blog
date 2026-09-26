import React, { useContext, useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { GlobalState } from "../../../GlobalState";
import { apiLocal } from "../../../lib/stormGate";
import RoadmapDetail from "./RoadmapDetail";
import { CurriculumForm, ProgramForm, AlternativeForm } from "./RoadmapForms";
import {
  LANE_COLORS,
  axisMonths,
  barSpan,
  monthLabel,
  anchorInputValue,
  programsOf,
  alternativesOf,
  curriculumProgress,
  sortCurricula,
  clamp,
  num,
  textToList,
} from "./roadmapUtils";

/* ------------------------------------------------------------------
   Styled components — matches the AdminOverview palette
------------------------------------------------------------------ */

const Page = styled.section`
  background: #0f1216;
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  min-height: 100vh;
  padding-block: 0 80px;
`;

const Container = styled.div`
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 24px;

  @media (max-width: 720px) { padding: 0 18px; }
`;

const Bar = styled.header`
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-block: 26px 18px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px 20px;
  align-items: flex-end;

  h1 { font-size: 26px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
  .sub { font-size: 13px; color: #6b7479; margin-top: 4px; }
  .tools { margin-left: auto; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }

  label.f {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    color: #a3acb2;
  }
  input, select {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #f4f6f8;
    font-family: inherit;
    font-size: 13px;
    padding: 6px 9px;
  }
  select option { background: #14181e; }
`;

const AddBtn = styled.button`
  background: #206a5d;
  border: 1px solid #206a5d;
  border-radius: 6px;
  color: #f4f6f8;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 700;
  padding: 8px 14px;
  cursor: pointer;
  &:hover { background: #267a6b; }
`;

const SecHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
  margin: 34px 0 12px;

  h2 {
    font-size: 11.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.11em;
    color: #a3acb2;
    margin: 0;
  }
  .hint { font-size: 12.5px; color: #6b7479; }
`;

const Notice = styled.div`
  margin-top: 18px;
  border: 1px solid rgba(224, 122, 95, 0.35);
  background: rgba(224, 122, 95, 0.08);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 13px;
  color: #e0a897;
`;

/* ---------- goals strip ---------- */

const Goals = styled.div`
  display: grid;
  gap: 1px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  overflow: hidden;
`;

const GoalRow = styled.div`
  display: grid;
  grid-template-columns: minmax(190px, 1.1fr) minmax(0, 1.4fr) minmax(0, 1.4fr);
  background: #0f1216;

  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;

const GoalCell = styled.div`
  padding: 12px 15px;
  min-width: 0;

  .k {
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7479;
    font-weight: 700;
  }
  .name { display: flex; align-items: center; gap: 9px; flex-wrap: wrap; }
  .swatch { width: 10px; height: 10px; border-radius: 3px; flex: none; }
  .nm { font-size: 15px; font-weight: 700; }
  .why { font-size: 12.5px; color: #a3acb2; margin-top: 4px; }
  .why.empty { color: #4d5559; font-style: italic; }
`;

const GoalEdit = styled.div`
  font-size: 13.5px;
  margin-top: 4px;
  white-space: pre-wrap;
  line-height: 1.5;
  cursor: text;
  border-radius: 5px;
  padding: 3px 6px;
  margin-inline: -6px;
  color: ${(p) => (p.$empty ? "#4d5559" : "#f4f6f8")};
  font-style: ${(p) => (p.$empty ? "italic" : "normal")};

  &:hover { background: rgba(255, 255, 255, 0.04); }
  &:focus-visible { outline: 2px solid #5bb39e; }
`;

const GoalTextarea = styled.textarea`
  width: 100%;
  margin-top: 4px;
  min-height: 62px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(91, 179, 158, 0.4);
  border-radius: 6px;
  color: #f4f6f8;
  font-family: inherit;
  font-size: 13.5px;
  line-height: 1.5;
  padding: 7px 9px;
  resize: vertical;
  &:focus { outline: 2px solid #5bb39e; outline-offset: 1px; }
`;

/* ---------- rating pips ---------- */

const Pips = styled.span`
  display: inline-flex;
  gap: 4px;
  align-items: center;

  button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 1px solid transparent;
    background: ${"rgba(255,255,255,.12)"};
    padding: 0;
    cursor: pointer;
  }
  button.on { background: #d9a44a; }
  button:hover { border-color: #d9a44a; }
  .na { font-size: 11px; color: #4d5559; font-style: italic; margin-left: 3px; }
`;

/* ---------- chart ---------- */

const Cols = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 20px;
  align-items: start;

  @media (min-width: 1120px) { grid-template-columns: minmax(0, 1fr) 380px; }
`;

const Chart = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.015);
  overflow: hidden;
  --label-col: clamp(170px, 21vw, 260px);
  --bar-row: 1;

  @media (max-width: 860px) {
    --label-col: 0px;
    --bar-row: 2;
  }
`;

// One grid PER ROW rather than one grid for the whole chart: identical tracks
// plus an identical container width align the columns anyway, and expanding a
// lane never means recomputing grid-row indices for everything below it.
const Row = styled.div`
  display: grid;
  grid-template-columns: var(--label-col) repeat(${(p) => p.$cols}, minmax(0, 1fr));
  align-items: stretch;
`;

const Axis = styled(Row)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.02);

  .lab {
    padding: 9px 15px;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #6b7479;
    font-weight: 700;
    @media (max-width: 860px) { display: none; }
  }
  .mo {
    padding: 7px 2px;
    text-align: center;
    border-left: 1px solid rgba(255, 255, 255, 0.05);
  }
  .m { font-size: 11px; font-weight: 700; color: #a3acb2; font-variant-numeric: tabular-nums; }
  .d { font-size: 9.5px; color: #4d5559; font-variant-numeric: tabular-nums; }
`;

const Lane = styled.div`
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  &:last-child { border-bottom: 0; }
`;

const LaneLabel = styled.div`
  grid-column: 1;
  grid-row: var(--bar-row);
  padding: 13px 15px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;

  @media (max-width: 860px) {
    grid-column: 1 / -1;
    grid-row: 1;
    padding: 12px 14px 5px;
  }

  .title { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .swatch { width: 10px; height: 10px; border-radius: 3px; flex: none; }
  .nm {
    background: none;
    border: 0;
    padding: 0;
    color: #f4f6f8;
    font-family: inherit;
    font-size: 15.5px;
    font-weight: 700;
    text-align: left;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .nm:hover { color: #5bb39e; }
  .why {
    font-size: 12px;
    color: #a3acb2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 11.5px; color: #6b7479; }
  .disclose {
    background: none;
    border: 0;
    padding: 0;
    color: #6b7479;
    font-family: inherit;
    font-size: 11.5px;
    cursor: pointer;
  }
  .disclose:hover { color: #f4f6f8; }
  .pct { font-variant-numeric: tabular-nums; }
`;

const Cell = styled.div`
  grid-row: var(--bar-row);
  border-left: 1px solid rgba(255, 255, 255, 0.04);
  min-height: 12px;
`;

const BarBtn = styled.button`
  grid-row: var(--bar-row);
  align-self: center;
  position: relative;
  overflow: hidden;
  border: 0;
  border-radius: 5px;
  margin: 7px 3px;
  padding: 0;
  z-index: 1;
  cursor: pointer;
  display: block;
  width: auto;
  height: ${(p) => (p.$small ? "20px" : "31px")};
  background: ${(p) => `${p.$color}22`};
  box-shadow: inset 0 0 0 1px ${(p) => `${p.$color}66`};

  &:hover { box-shadow: inset 0 0 0 1px ${(p) => p.$color}, 0 0 0 1px rgba(255, 255, 255, 0.25); }

  > i {
    position: absolute;
    inset: 0 auto 0 0;
    background: ${(p) => `${p.$color}3d`};
  }
  > span {
    position: relative;
    display: block;
    padding: 0 9px;
    font-size: 11.5px;
    font-weight: 700;
    line-height: ${(p) => (p.$small ? "20px" : "31px")};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${(p) => p.$color};
  }
`;

const ProgLabel = styled(LaneLabel)`
  padding: 4px 15px 4px 32px;
  gap: 1px;

  @media (max-width: 860px) { padding: 6px 14px 2px 26px; }

  .p-nm { font-size: 13px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .p-sub { font-size: 11px; color: #4d5559; }
`;

const AddProgRow = styled.div`
  grid-column: 1 / -1;
  padding: 7px 15px 12px 32px;

  button {
    background: none;
    border: 1px dashed rgba(255, 255, 255, 0.14);
    border-radius: 6px;
    color: #6b7479;
    font-family: inherit;
    font-size: 12.5px;
    padding: 5px 11px;
    cursor: pointer;
  }
  button:hover { color: #f4f6f8; border-color: rgba(91, 179, 158, 0.4); }
`;

const EmptyChart = styled.div`
  padding: 30px 18px;
  color: #6b7479;
  font-size: 13.5px;
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const AdminRoadmap = () => {
  const state = useContext(GlobalState);
  const api = state.roadmapAPI;

  const [curricula] = api.curricula;
  const [programs] = api.programs;
  const [alternatives] = api.alternatives;
  const [settings] = api.settings;
  const [loading] = api.loading;
  const [apiError] = api.error;
  const { refresh } = api;

  const [sort, setSort] = useState(() => {
    try { return localStorage.getItem("roadmap.sort") || "rating"; } catch (e) { return "rating"; }
  });
  const [expanded, setExpanded] = useState({});
  const [selection, setSelection] = useState(null);
  const [editing, setEditing] = useState(null); // {goal:{slug,field}} while a cell is open
  const [dialog, setDialog] = useState(null);
  const [error, setError] = useState(null);

  const cols = useMemo(() => axisMonths(curricula, programs), [curricula, programs]);
  const ordered = useMemo(() => sortCurricula(curricula, sort), [curricula, sort]);

  const run = useCallback(
    async (fn) => {
      try {
        setError(null);
        await fn();
        refresh();
      } catch (err) {
        setError(err.response?.data?.msg || err.message);
      }
    },
    [refresh]
  );

  /* ---------- writes ---------- */

  const saveCurriculum = (slug, form) =>
    run(async () => {
      const body = { ...form, teaches: undefined };
      if (slug) await apiLocal.put(`/api/roadmap/curricula/${slug}`, body);
      else await apiLocal.post("/api/roadmap/curricula", body);
      setDialog(null);
    });

  const deleteCurriculum = (slug) =>
    run(async () => {
      await apiLocal.delete(`/api/roadmap/curricula/${slug}`);
      setDialog(null);
      setSelection(null);
    });

  const saveProgram = (slug, curriculumSlug, form) =>
    run(async () => {
      const body = { ...form, curriculumSlug, teaches: textToList(form.teaches) };
      if (slug) await apiLocal.put(`/api/roadmap/programs/${slug}`, body);
      else await apiLocal.post("/api/roadmap/programs", body);
      setExpanded((e) => ({ ...e, [curriculumSlug]: true }));
      setDialog(null);
    });

  const deleteProgram = (program) =>
    run(async () => {
      await apiLocal.delete(`/api/roadmap/programs/${program.slug}`);
      setDialog(null);
      setSelection({ kind: "curriculum", slug: program.curriculumSlug });
    });

  const saveAlternative = (slug, curriculumSlug, form) =>
    run(async () => {
      const body = { ...form, curriculumSlug };
      if (slug) await apiLocal.put(`/api/roadmap/alternatives/${slug}`, body);
      else await apiLocal.post("/api/roadmap/alternatives", body);
      setDialog(null);
    });

  const deleteAlternative = (slug) =>
    run(async () => {
      await apiLocal.delete(`/api/roadmap/alternatives/${slug}`);
      setDialog(null);
    });

  const setProgress = (program, value) =>
    run(async () => {
      await apiLocal.patch(`/api/roadmap/programs/${program.slug}/progress`, { progress: value });
    });

  const setRating = (curriculum, value) =>
    run(async () => {
      // Clicking the pip you already sit on clears the rating.
      const next = num(curriculum.rating, 0) === value ? 0 : value;
      await apiLocal.patch(`/api/roadmap/curricula/${curriculum.slug}`, { rating: next });
    });

  const saveGoal = (curriculum, field, value) => {
    setEditing(null);
    if (String(curriculum[field] || "") === value) return;
    run(async () => {
      await apiLocal.patch(`/api/roadmap/curricula/${curriculum.slug}`, { [field]: value });
    });
  };

  const setAnchor = (value) =>
    run(async () => {
      await apiLocal.put("/api/roadmap/settings", { anchor: value });
    });

  /* ---------- pieces ---------- */

  const renderPips = (curriculum) => (
    <Pips role="group" aria-label={curriculum.rating ? `Rated ${curriculum.rating} of 5` : "Not rated"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={n <= num(curriculum.rating, 0) ? "on" : ""}
          aria-label={`Rate ${n} of 5`}
          onClick={() => setRating(curriculum, n)}
        />
      ))}
      {!curriculum.rating ? <span className="na">unrated</span> : null}
    </Pips>
  );

  const renderGoalCell = (curriculum, field, label) => {
    const open = editing && editing.slug === curriculum.slug && editing.field === field;
    const value = curriculum[field] || "";

    if (open) {
      return (
        <GoalCell>
          <div className="k">{label}</div>
          <GoalTextarea
            autoFocus
            defaultValue={value}
            aria-label={`${label} for ${curriculum.name}`}
            onBlur={(e) => saveGoal(curriculum, field, e.target.value.trim())}
            onKeyDown={(e) => {
              if (e.key === "Escape") { e.preventDefault(); setEditing(null); }
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); e.target.blur(); }
            }}
          />
        </GoalCell>
      );
    }

    return (
      <GoalCell>
        <div className="k">{label}</div>
        <GoalEdit
          $empty={!value}
          tabIndex={0}
          role="button"
          aria-label={`Edit ${label} for ${curriculum.name}`}
          onClick={() => setEditing({ slug: curriculum.slug, field })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setEditing({ slug: curriculum.slug, field });
            }
          }}
        >
          {value || `Add a ${label.toLowerCase()}`}
        </GoalEdit>
      </GoalCell>
    );
  };

  const nextCurriculumOrder =
    curricula.reduce((m, c) => Math.max(m, num(c.order, 0)), 0) + 10;

  /* ---------- render ---------- */

  return (
    <Page>
      <Container>
        <Bar>
          <div>
            <h1>Roadmap</h1>
            <div className="sub">
              {loading
                ? "Loading…"
                : curricula.length
                ? `${curricula.length} curricul${curricula.length === 1 ? "um" : "a"} · ${programs.length} program${programs.length === 1 ? "" : "s"}`
                : "Empty — add your first curriculum"}
            </div>
          </div>
          <div className="tools">
            <label className="f">
              Start
              <input
                type="month"
                value={anchorInputValue(settings)}
                onChange={(e) => setAnchor(e.target.value)}
                aria-label="Month the plan starts"
              />
            </label>
            <label className="f">
              Sort
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  try { localStorage.setItem("roadmap.sort", e.target.value); } catch (err) { /* private mode */ }
                }}
              >
                <option value="rating">By rating</option>
                <option value="order">Manual order</option>
                <option value="name">By name</option>
              </select>
            </label>
            <AddBtn type="button" onClick={() => setDialog({ type: "curriculum" })}>
              Add curriculum
            </AddBtn>
          </div>
        </Bar>

        {error || apiError ? <Notice>{error || apiError}</Notice> : null}

        <SecHead>
          <h2>Goals</h2>
          <span className="hint">What each track is for. Click a goal to edit it.</span>
        </SecHead>

        <Goals>
          {ordered.length ? (
            ordered.map((c) => (
              <GoalRow key={c.slug}>
                <GoalCell>
                  <div className="name">
                    <span className="swatch" style={{ background: c.color || LANE_COLORS[0] }} />
                    <span className="nm">{c.name}</span>
                    {renderPips(c)}
                  </div>
                  <div className={c.why ? "why" : "why empty"}>
                    {c.why || "No reason recorded yet"}
                  </div>
                </GoalCell>
                {renderGoalCell(c, "shortTermGoal", "Short term")}
                {renderGoalCell(c, "longTermGoal", "Long term")}
              </GoalRow>
            ))
          ) : (
            <GoalRow>
              <GoalCell style={{ color: "#6b7479" }}>
                {loading ? "Loading…" : "No curricula yet. Add one to start the roadmap."}
              </GoalCell>
            </GoalRow>
          )}
        </Goals>

        <SecHead>
          <h2>Timeline</h2>
          <span className="hint">Click a curriculum name for details, a bar for the program.</span>
        </SecHead>

        <Cols>
          <Chart>
            <Axis $cols={cols}>
              <div className="lab">Curriculum</div>
              {Array.from({ length: cols }, (_, i) => (
                <div className="mo" key={i}>
                  <div className="m">M{i + 1}</div>
                  <div className="d">{monthLabel(i, settings)}</div>
                </div>
              ))}
            </Axis>

            {!ordered.length ? (
              <EmptyChart>
                {loading
                  ? "Loading…"
                  : "Nothing on the timeline yet. Add a curriculum and it appears here as a lane."}
              </EmptyChart>
            ) : (
              ordered.map((c) => {
                const list = programsOf(programs, c.slug);
                const pct = curriculumProgress(programs, c.slug);
                const open = !!expanded[c.slug];
                const color = c.color || LANE_COLORS[0];

                return (
                  <Lane key={c.slug}>
                    <Row $cols={cols}>
                      <LaneLabel>
                        <div className="title">
                          <span className="swatch" style={{ background: color }} />
                          <button
                            className="nm"
                            type="button"
                            onClick={() => setSelection({ kind: "curriculum", slug: c.slug })}
                          >
                            {c.name}
                          </button>
                        </div>
                        {c.why ? <div className="why">{c.why}</div> : null}
                        <div className="meta">
                          {renderPips(c)}
                          {list.length ? (
                            <button
                              className="disclose"
                              type="button"
                              aria-expanded={open}
                              onClick={() => setExpanded((e) => ({ ...e, [c.slug]: !e[c.slug] }))}
                            >
                              {open ? "▾" : "▸"} {list.length} program{list.length === 1 ? "" : "s"}
                            </button>
                          ) : (
                            <span>no programs yet</span>
                          )}
                          {pct !== null ? <span className="pct">{pct}%</span> : null}
                        </div>
                      </LaneLabel>

                      {Array.from({ length: cols }, (_, i) => <Cell key={i} />)}

                      <BarBtn
                        type="button"
                        $color={color}
                        style={{ gridColumn: barSpan(c.startMonth, c.endMonth, cols) }}
                        title={c.name}
                        onClick={() => setSelection({ kind: "curriculum", slug: c.slug })}
                      >
                        <i style={{ width: `${pct === null ? 0 : pct}%` }} />
                        <span>{c.name}{pct === null ? "" : ` · ${pct}%`}</span>
                      </BarBtn>
                    </Row>

                    {open
                      ? list.map((p) => {
                          const ppct = clamp(num(p.progress, 0), 0, 100);
                          return (
                            <Row $cols={cols} key={p.slug}>
                              <ProgLabel as="div">
                                <div className="p-nm">{p.name}</div>
                                <div className="p-sub">
                                  {[p.code, p.provider, p.lengthLabel].filter(Boolean).join(" · ")}
                                </div>
                              </ProgLabel>
                              {Array.from({ length: cols }, (_, i) => <Cell key={i} />)}
                              <BarBtn
                                type="button"
                                $small
                                $color={color}
                                style={{ gridColumn: barSpan(p.startMonth, p.endMonth, cols) }}
                                title={p.name}
                                onClick={() => setSelection({ kind: "program", slug: p.slug })}
                              >
                                <i style={{ width: `${ppct}%` }} />
                                <span>{p.name}</span>
                              </BarBtn>
                            </Row>
                          );
                        })
                      : null}

                    {open ? (
                      <Row $cols={cols}>
                        <AddProgRow>
                          <button
                            type="button"
                            onClick={() => setDialog({ type: "program", curriculum: c })}
                          >
                            + Add program
                          </button>
                        </AddProgRow>
                      </Row>
                    ) : null}
                  </Lane>
                );
              })
            )}
          </Chart>

          <RoadmapDetail
            selection={selection}
            curricula={curricula}
            programs={programs}
            alternatives={alternatives}
            onSelect={setSelection}
            onProgress={setProgress}
            onEditCurriculum={(c) => setDialog({ type: "curriculum", curriculum: c })}
            onEditProgram={(p) =>
              setDialog({
                type: "program",
                program: p,
                curriculum: curricula.find((c) => c.slug === p.curriculumSlug),
              })
            }
            onAddProgram={(c) => setDialog({ type: "program", curriculum: c })}
            onAddAlternative={(c) => setDialog({ type: "alternative", curriculum: c })}
            onEditAlternative={(a) =>
              setDialog({
                type: "alternative",
                alternative: a,
                curriculum: curricula.find((c) => c.slug === a.curriculumSlug),
              })
            }
          />
        </Cols>
      </Container>

      {dialog?.type === "curriculum" ? (
        <CurriculumForm
          curriculum={dialog.curriculum}
          nextOrder={nextCurriculumOrder}
          onClose={() => setDialog(null)}
          onSave={(form) => saveCurriculum(dialog.curriculum?.slug, form)}
          onDelete={() => deleteCurriculum(dialog.curriculum.slug)}
        />
      ) : null}

      {dialog?.type === "program" ? (
        <ProgramForm
          program={dialog.program}
          curriculum={dialog.curriculum}
          nextOrder={programsOf(programs, dialog.curriculum?.slug).reduce((m, p) => Math.max(m, num(p.order, 0)), 0) + 10}
          onClose={() => setDialog(null)}
          onSave={(form) => saveProgram(dialog.program?.slug, dialog.curriculum.slug, form)}
          onDelete={() => deleteProgram(dialog.program)}
        />
      ) : null}

      {dialog?.type === "alternative" ? (
        <AlternativeForm
          alternative={dialog.alternative}
          curriculum={dialog.curriculum}
          nextOrder={alternativesOf(alternatives, dialog.curriculum?.slug).reduce((m, a) => Math.max(m, num(a.order, 0)), 0) + 10}
          onClose={() => setDialog(null)}
          onSave={(form) => saveAlternative(dialog.alternative?.slug, dialog.curriculum.slug, form)}
          onDelete={() => deleteAlternative(dialog.alternative.slug)}
        />
      ) : null}
    </Page>
  );
};

export default AdminRoadmap;
