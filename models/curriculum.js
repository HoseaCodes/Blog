import mongoose from 'mongoose';

/*
  A curriculum is one track you commit to — "Game Development", "Computer
  Science" — and the unit the /admin/roadmap Gantt draws as a swimlane.

  Ported from the Curriculum Ledger artifact, which is why the field names
  match its collections one for one: the seed script maps documents across
  without translation.

  Progress is deliberately NOT stored here. It is derived from the programs
  under this curriculum (controllers/roadmap.js), so a lane total can never
  drift away from the modules it rolls up.
*/
const curriculumSchema = new mongoose.Schema({
  // Hand-assignable stable id. Mirrors projectId in models/project.js so
  // scripts/seedRoadmap.mjs can upsert idempotently on a value we control.
  slug: { type: String, trim: true, required: true, unique: true, index: true },

  name: { type: String, trim: true, required: true },

  // The reason you want to finish it. Required in the UI rather than the
  // schema: an existing record predating the field must still save.
  why: { type: String, trim: true, default: '' },

  // Near horizon and destination. Kept separate from `why` because they change
  // on different cadences — the goal moves, the reason usually doesn't.
  shortTermGoal: { type: String, trim: true, default: '' },
  longTermGoal: { type: String, trim: true, default: '' },

  // 0 means unrated, which is distinct from a deliberate 1.
  rating: { type: Number, min: 0, max: 5, default: 0 },

  detail: { type: String, default: '' },

  // 1-based inclusive offsets from month 1 of the plan, not absolute dates:
  // the plan is "N months from whenever I start", so a slipped start would
  // otherwise mean rewriting every record.
  startMonth: { type: Number, min: 1, max: 36, default: 1 },
  endMonth: { type: Number, min: 1, max: 36, default: 12 },

  color: { type: String, trim: true, default: '#4f6bed' },
  order: { type: Number, default: 0 },

  // Mirrors the Articles/Projects pattern. Neither flag is a privacy control
  // here — every /api/roadmap route is auth + admin — `archived` just hides a
  // track you have abandoned without discarding the research in it.
  draft: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

const Curriculums = mongoose.model('Curriculums', curriculumSchema);

export default Curriculums;
