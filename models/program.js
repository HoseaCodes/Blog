import mongoose from 'mongoose';

/*
  A program is one course or block inside a curriculum — the bars the Gantt
  draws within a swimlane. `curriculumSlug` points at models/curriculum.js by
  slug rather than ObjectId so the seed script is a single pass with no
  insert-then-patch step.

  `status` is not stored: it is derived from `progress` (0 / 1-99 / 100) in the
  client, for the same reason curriculum progress is derived.
*/
const programSchema = new mongoose.Schema({

  // Whose roadmap this is. Storm-Gate's /me is the source of truth for email
  // (utils/auth.js), so the controller stamps it from req.user.email and scopes
  // every query by it: two admins never see each other's tracks.
  ownerEmail: { type: String, trim: true, lowercase: true, required: true, index: true },

  slug: { type: String, trim: true, required: true, index: true },
  curriculumSlug: { type: String, trim: true, required: true, index: true },

  name: { type: String, trim: true, required: true },
  // Course code as its own field so it can be set in monospace: 6.042J,
  // 15-445, 6.824 are how these courses are actually referred to.
  code: { type: String, trim: true, default: '' },
  provider: { type: String, trim: true, default: '' },

  startMonth: { type: Number, min: 1, max: 36, default: 1 },
  endMonth: { type: Number, min: 1, max: 36, default: 1 },
  lengthLabel: { type: String, trim: true, default: '' },

  progress: { type: Number, min: 0, max: 100, default: 0 },
  startedAt: { type: Date, default: null },
  completedAt: { type: Date, default: null },

  link: { type: String, trim: true, default: '' },
  detail: { type: String, default: '' },
  teaches: { type: [String], default: [] },
  outcome: { type: String, trim: true, default: '' },
  notes: { type: String, default: '' },

  order: { type: Number, default: 0 },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

programSchema.index({ ownerEmail: 1, slug: 1 }, { unique: true });
programSchema.index({ ownerEmail: 1, curriculumSlug: 1, order: 1 });

const Programs = mongoose.model('Programs', programSchema);

export default Programs;
