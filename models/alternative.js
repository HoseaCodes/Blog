import mongoose from 'mongoose';

/*
  An alternative is another route to the same skills as its curriculum — the
  paid degree beside the free path, or a second free option.

  These are not a separate "degree comparison": a degree only means something
  next to the curriculum it would replace, so it hangs off `curriculumSlug`
  and renders inside that curriculum's detail panel.
*/
const alternativeSchema = new mongoose.Schema({
  slug: { type: String, trim: true, required: true, unique: true, index: true },
  curriculumSlug: { type: String, trim: true, required: true, index: true },

  name: { type: String, trim: true, required: true },
  provider: { type: String, trim: true, default: '' },
  kind: { type: String, enum: ['free', 'paid'], default: 'paid' },

  // null means "not checked", which the UI renders differently from $0. A
  // guessed tuition figure is worse than an absent one — someone budgets
  // against it.
  costAmount: { type: Number, default: null },
  costUnit: { type: String, trim: true, default: '' },
  costNote: { type: String, trim: true, default: '' },

  credential: { type: String, trim: true, default: '' },
  format: { type: String, trim: true, default: '' },
  link: { type: String, trim: true, default: '' },
  detail: { type: String, default: '' },
  // One line on what this buys and what it costs against the tracked path.
  tradeoff: { type: String, default: '' },

  order: { type: Number, default: 0 },
  archived: { type: Boolean, default: false },
}, { timestamps: true });

alternativeSchema.index({ curriculumSlug: 1, order: 1 });

const Alternatives = mongoose.model('Alternatives', alternativeSchema);

export default Alternatives;
