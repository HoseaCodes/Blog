import React, { useState } from "react";
import styled from "styled-components";
import { LANE_COLORS, MAX_MONTHS, listToText } from "./roadmapUtils";

/* ------------------------------------------------------------------
   Shared modal chrome
------------------------------------------------------------------ */

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(6, 8, 11, 0.72);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 40px 16px;
  overflow-y: auto;
`;

const Panel = styled.div`
  width: min(560px, 100%);
  background: #14181e;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 12px;
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
`;

const Head = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  font-size: 17px;
  font-weight: 700;
`;

const Body = styled.div`
  padding: 18px 20px;
  display: grid;
  gap: 14px;
`;

const Foot = styled.div`
  padding: 14px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;

  .spacer { margin-left: auto; }
`;

const Field = styled.label`
  display: grid;
  gap: 5px;

  > span.lab {
    font-size: 11.5px;
    font-weight: 700;
    color: #a3acb2;
    letter-spacing: 0.02em;
  }
  > span.help { font-size: 11.5px; color: #6b7479; }
  > span.err { font-size: 11.5px; color: #e07a5f; }

  input, textarea, select {
    width: 100%;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    color: #f4f6f8;
    font-family: inherit;
    font-size: 14px;
    padding: 8px 10px;
  }
  textarea { resize: vertical; min-height: 66px; line-height: 1.45; }
  select option { background: #14181e; }
  input:focus, textarea:focus, select:focus {
    outline: 2px solid #5bb39e;
    outline-offset: 1px;
  }
`;

const Pair = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const Btn = styled.button`
  background: ${(p) => (p.$primary ? "#206a5d" : "transparent")};
  border: 1px solid ${(p) => (p.$primary ? "#206a5d" : "rgba(255,255,255,.14)")};
  color: ${(p) => (p.$danger ? "#e07a5f" : "#f4f6f8")};
  border-color: ${(p) => (p.$danger ? "rgba(224,122,95,.4)" : undefined)};
  border-radius: 6px;
  padding: 8px 14px;
  font-family: inherit;
  font-size: 13.5px;
  font-weight: ${(p) => (p.$primary ? 700 : 500)};
  cursor: pointer;

  &:hover { background: ${(p) => (p.$primary ? "#267a6b" : "rgba(255,255,255,.05)")}; }
`;

const Swatches = styled.div`
  display: flex;
  gap: 7px;
  flex-wrap: wrap;

  button {
    width: 26px;
    height: 26px;
    border-radius: 6px;
    border: 2px solid transparent;
    cursor: pointer;
    padding: 0;
  }
  button[aria-pressed="true"] { border-color: #f4f6f8; }
`;

/*
  window.confirm() is unavailable in some embedded views and reads as a jolt in
  others, so destructive actions arm on the first click and fire on the second.
*/
function DeleteButton({ label, onDelete }) {
  const [armed, setArmed] = useState(false);
  return (
    <Btn
      type="button"
      $danger
      onClick={() => {
        if (!armed) {
          setArmed(true);
          setTimeout(() => setArmed(false), 4000);
          return;
        }
        onDelete();
      }}
    >
      {armed ? "Confirm delete" : label}
    </Btn>
  );
}

function Modal({ title, children, onClose, onSubmit, submitLabel, onDelete, deleteLabel }) {
  return (
    <Backdrop
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Panel role="dialog" aria-modal="true" aria-label={title}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Head>{title}</Head>
          <Body>{children}</Body>
          <Foot>
            {onDelete ? <DeleteButton label={deleteLabel || "Delete"} onDelete={onDelete} /> : null}
            <span className="spacer" />
            <Btn type="button" onClick={onClose}>Cancel</Btn>
            <Btn type="submit" $primary>{submitLabel}</Btn>
          </Foot>
        </form>
      </Panel>
    </Backdrop>
  );
}

/* ------------------------------------------------------------------
   Curriculum
------------------------------------------------------------------ */

export function CurriculumForm({ curriculum, nextOrder, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(() => ({
    name: curriculum?.name || "",
    why: curriculum?.why || "",
    shortTermGoal: curriculum?.shortTermGoal || "",
    longTermGoal: curriculum?.longTermGoal || "",
    rating: curriculum?.rating ?? 0,
    startMonth: curriculum?.startMonth ?? 1,
    endMonth: curriculum?.endMonth ?? 12,
    color: curriculum?.color || LANE_COLORS[0],
    order: curriculum?.order ?? nextOrder,
    detail: curriculum?.detail || "",
  }));
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    const next = {};
    if (!String(form.name).trim()) next.name = "Give it a name.";
    // Required here rather than in the schema: this is the field that stops a
    // curriculum being added on a whim, and it is the point of the tracker.
    if (!String(form.why).trim()) next.why = "Record why you want to finish it.";
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave(form);
  };

  return (
    <Modal
      title={curriculum ? "Edit curriculum" : "New curriculum"}
      onClose={onClose}
      onSubmit={submit}
      submitLabel={curriculum ? "Save" : "Add curriculum"}
      onDelete={curriculum ? onDelete : null}
      deleteLabel="Delete curriculum"
    >
      <Field>
        <span className="lab">Name</span>
        <input value={form.name} onChange={set("name")} placeholder="Computer Science" />
        {errors.name ? <span className="err">{errors.name}</span> : null}
      </Field>

      <Field>
        <span className="lab">Why you want to complete it</span>
        <textarea rows={2} value={form.why} onChange={set("why")} />
        <span className="help">Required. The reason you would still be doing this in month nine.</span>
        {errors.why ? <span className="err">{errors.why}</span> : null}
      </Field>

      <Field>
        <span className="lab">Short-term goal</span>
        <textarea rows={2} value={form.shortTermGoal} onChange={set("shortTermGoal")} />
        <span className="help">Optional. What the next stretch gets you.</span>
      </Field>

      <Field>
        <span className="lab">Long-term goal</span>
        <textarea rows={2} value={form.longTermGoal} onChange={set("longTermGoal")} />
        <span className="help">Optional. Where the whole thing leads.</span>
      </Field>

      <Pair>
        <Field>
          <span className="lab">Rating</span>
          <select value={form.rating} onChange={set("rating")}>
            <option value={0}>Unrated</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </Field>
        <Field>
          <span className="lab">Order</span>
          <input type="number" value={form.order} onChange={set("order")} />
        </Field>
      </Pair>

      <Pair>
        <Field>
          <span className="lab">Start month</span>
          <input type="number" min={1} max={MAX_MONTHS} value={form.startMonth} onChange={set("startMonth")} />
        </Field>
        <Field>
          <span className="lab">End month</span>
          <input type="number" min={1} max={MAX_MONTHS} value={form.endMonth} onChange={set("endMonth")} />
        </Field>
      </Pair>

      <Field as="div">
        <span className="lab">Lane colour</span>
        <Swatches>
          {LANE_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              style={{ background: c }}
              aria-pressed={form.color === c}
              aria-label={`Colour ${c}`}
              onClick={() => setForm((f) => ({ ...f, color: c }))}
            />
          ))}
        </Swatches>
      </Field>

      <Field>
        <span className="lab">About</span>
        <textarea rows={4} value={form.detail} onChange={set("detail")} />
        <span className="help">Markdown. What it covers and what you can do after.</span>
      </Field>
    </Modal>
  );
}

/* ------------------------------------------------------------------
   Program
------------------------------------------------------------------ */

export function ProgramForm({ program, curriculum, nextOrder, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(() => ({
    name: program?.name || "",
    code: program?.code || "",
    provider: program?.provider || "",
    startMonth: program?.startMonth ?? curriculum?.startMonth ?? 1,
    endMonth: program?.endMonth ?? (curriculum?.startMonth ?? 1) + 2,
    lengthLabel: program?.lengthLabel || "",
    progress: program?.progress ?? 0,
    link: program?.link || "",
    teaches: listToText(program?.teaches),
    outcome: program?.outcome || "",
    detail: program?.detail || "",
    order: program?.order ?? nextOrder,
  }));
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!String(form.name).trim()) {
      setErrors({ name: "Give it a name." });
      return;
    }
    onSave(form);
  };

  return (
    <Modal
      title={program ? "Edit program" : `New program in ${curriculum?.name || "curriculum"}`}
      onClose={onClose}
      onSubmit={submit}
      submitLabel={program ? "Save" : "Add program"}
      onDelete={program ? onDelete : null}
      deleteLabel="Delete program"
    >
      <Field>
        <span className="lab">Name</span>
        <input value={form.name} onChange={set("name")} placeholder="Operating Systems" />
        {errors.name ? <span className="err">{errors.name}</span> : null}
      </Field>

      <Pair>
        <Field>
          <span className="lab">Course code</span>
          <input value={form.code} onChange={set("code")} placeholder="6.824" />
        </Field>
        <Field>
          <span className="lab">Provider</span>
          <input value={form.provider} onChange={set("provider")} placeholder="MIT" />
        </Field>
      </Pair>

      <Pair>
        <Field>
          <span className="lab">Start month</span>
          <input type="number" min={1} max={MAX_MONTHS} value={form.startMonth} onChange={set("startMonth")} />
        </Field>
        <Field>
          <span className="lab">End month</span>
          <input type="number" min={1} max={MAX_MONTHS} value={form.endMonth} onChange={set("endMonth")} />
        </Field>
      </Pair>

      <Pair>
        <Field>
          <span className="lab">Length</span>
          <input value={form.lengthLabel} onChange={set("lengthLabel")} placeholder="~12 wks" />
        </Field>
        <Field>
          <span className="lab">Progress %</span>
          <input type="number" min={0} max={100} value={form.progress} onChange={set("progress")} />
        </Field>
      </Pair>

      <Field>
        <span className="lab">Link</span>
        <input type="url" value={form.link} onChange={set("link")} placeholder="https://" />
      </Field>

      <Field>
        <span className="lab">Teaches</span>
        <input value={form.teaches} onChange={set("teaches")} placeholder="Processes, Scheduling, Concurrency" />
        <span className="help">Comma separated.</span>
      </Field>

      <Field>
        <span className="lab">You come out with</span>
        <input value={form.outcome} onChange={set("outcome")} placeholder="A working shell and scheduler" />
      </Field>

      <Field>
        <span className="lab">What it is</span>
        <textarea rows={4} value={form.detail} onChange={set("detail")} />
        <span className="help">Markdown.</span>
      </Field>

      <Field>
        <span className="lab">Order</span>
        <input type="number" value={form.order} onChange={set("order")} />
      </Field>
    </Modal>
  );
}

/* ------------------------------------------------------------------
   Alternative
------------------------------------------------------------------ */

export function AlternativeForm({ alternative, curriculum, nextOrder, onSave, onDelete, onClose }) {
  const [form, setForm] = useState(() => ({
    name: alternative?.name || "",
    kind: alternative?.kind || "paid",
    provider: alternative?.provider || "",
    credential: alternative?.credential || "",
    format: alternative?.format || "",
    costAmount: alternative?.costAmount ?? "",
    costUnit: alternative?.costUnit || "",
    costNote: alternative?.costNote || "",
    tradeoff: alternative?.tradeoff || "",
    link: alternative?.link || "",
    order: alternative?.order ?? nextOrder,
  }));
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = () => {
    if (!String(form.name).trim()) {
      setErrors({ name: "Give it a name." });
      return;
    }
    onSave(form);
  };

  return (
    <Modal
      title={alternative ? "Edit alternative" : `New alternative to ${curriculum?.name || "curriculum"}`}
      onClose={onClose}
      onSubmit={submit}
      submitLabel={alternative ? "Save" : "Add alternative"}
      onDelete={alternative ? onDelete : null}
      deleteLabel="Delete alternative"
    >
      <Field>
        <span className="lab">Name</span>
        <input value={form.name} onChange={set("name")} placeholder="Georgia Tech OMSCS" />
        {errors.name ? <span className="err">{errors.name}</span> : null}
      </Field>

      <Pair>
        <Field>
          <span className="lab">Free or paid</span>
          <select value={form.kind} onChange={set("kind")}>
            <option value="paid">Paid</option>
            <option value="free">Free</option>
          </select>
        </Field>
        <Field>
          <span className="lab">Provider</span>
          <input value={form.provider} onChange={set("provider")} placeholder="Georgia Tech" />
        </Field>
      </Pair>

      <Pair>
        <Field>
          <span className="lab">Credential</span>
          <input value={form.credential} onChange={set("credential")} placeholder="M.S." />
        </Field>
        <Field>
          <span className="lab">Format</span>
          <input value={form.format} onChange={set("format")} placeholder="Online" />
        </Field>
      </Pair>

      <Pair>
        <Field>
          <span className="lab">Cost amount</span>
          <input type="number" min={0} value={form.costAmount} onChange={set("costAmount")} />
          <span className="help">Leave blank if you have not checked it.</span>
        </Field>
        <Field>
          <span className="lab">Cost unit</span>
          <input value={form.costUnit} onChange={set("costUnit")} placeholder="per year / total" />
        </Field>
      </Pair>

      <Field>
        <span className="lab">Cost note</span>
        <input value={form.costNote} onChange={set("costNote")} placeholder="2026–27 tuition, before housing" />
      </Field>

      <Field>
        <span className="lab">Tradeoff</span>
        <textarea rows={3} value={form.tradeoff} onChange={set("tradeoff")} />
        <span className="help">One line: what this buys you, and what it costs, against the tracked path.</span>
      </Field>

      <Field>
        <span className="lab">Link</span>
        <input type="url" value={form.link} onChange={set("link")} placeholder="https://" />
      </Field>

      <Field>
        <span className="lab">Order</span>
        <input type="number" value={form.order} onChange={set("order")} />
      </Field>
    </Modal>
  );
}
