import mongoose from 'mongoose';

/*
  Projects — migrated out of src/Pages/Projects/ProjectsData.jsx.

  The old hardcoded setup split a project across three files: the long-form
  record lived in ProjectsData.jsx, while the card copy (eyebrow, stack pills,
  links) was duplicated into a local SHOWCASE constant in BOTH Projects.jsx and
  projectHighlight.jsx. Adding a project therefore meant editing three files.

  This schema holds both halves so a project is one document:
    - card fields   -> the /project grid and the home-page highlight
    - detail fields -> the /project/:id page

  Most fields are optional on purpose. The two migrated entries don't carry the
  same keys (Social Ring has `frontEnd`/`prototype`/`typography`; Aimly has
  `backEnd`/`apiManagement`), and requiring them would reject valid records.
  The loosely-shaped legacy fields use Mixed so the migration round-trips
  exactly rather than being coerced.
*/

const projectSchema = new mongoose.Schema({
    // Stable public identifier — drives /project/:id. Kept numeric so the
    // existing URLs (/project/1, /project/2) survive the migration.
    projectId: {
        type: Number,
        required: true,
        unique: true,
        index: true,
    },
    // Canonical public identifier — /project/:slug. Unique so two projects
    // can't silently collide on the same URL.
    slug: {
        type: String,
        trim: true,
        unique: true,
        index: true,
    },
    // Controls grid order. Falls back to projectId when unset.
    order: {
        type: Number,
    },

    /* ---------- identity ---------- */
    name: { type: String, trim: true },
    title: { type: String, trim: true },
    headline: { type: String, trim: true },
    role: { type: String, trim: true },
    context: { type: String, trim: true },
    date: { type: String, trim: true },

    /* ---------- card / showcase presentation ---------- */
    // Previously the SHOWCASE constants. `cardTitle` is separate from `title`
    // because the card uses marketing copy ("Custom borders for social profile
    // pictures.") while the detail hero uses the product name ("SOCIAL RING").
    eyebrow: { type: String, trim: true },
    cardTitle: { type: String, trim: true },
    // Each surface carried its own role string before the migration:
    //   role          -> detail hero      (" Software Developer Lead")
    //   cardRole      -> /project grid    ("Software Lead")
    //   highlightRole -> home-page row    ("Software Lead · Swift / SwiftUI")
    // Kept distinct so the copy renders exactly as it did. Consumers fall back
    // to `role` when the specific variant is unset.
    cardRole: { type: String, trim: true },
    highlightRole: { type: String, trim: true },
    description: { type: String, trim: true },
    timeframe: { type: String, trim: true },
    type: { type: String, trim: true },
    stack: { type: [String], default: [] },
    image: { type: String, trim: true },
    // Grid footer labels on /project.
    externals: {
        type: [{
            label: String,
            href: String,
        }],
        default: [],
    },
    // Home-page highlight links. `internal` routes via <Link>, everything else
    // renders as a target=_blank anchor.
    links: {
        type: [{
            label: String,
            href: String,
            internal: Boolean,
            external: Boolean,
            primary: Boolean,
        }],
        default: [],
    },

    /* ---------- detail page ---------- */
    headerImg: { type: String, trim: true },
    img: { type: String, trim: true },
    appLogo: { type: String, trim: true },
    backgroundColor: { type: String, trim: true },
    secondaryBackgroundColor: { type: String, trim: true },
    textColor: { type: String, trim: true },
    technology: { type: String, trim: true },
    frontEnd: { type: Boolean },
    backEnd: { type: Boolean },
    background: { type: String },
    objectives: { type: String },
    subHeading: { type: String },
    goal: { type: String },
    version: { type: String },
    // NOT `prototype` — mongoose silently refuses to register a schema path
    // with that name (it collides with Object.prototype) and drops the value
    // with no warning. Consumers alias it back: `prototypeUrl: prototype`.
    prototypeUrl: { type: String },
    design: { type: String },
    designImg: { type: String },
    userFlows: { type: String },
    apiManagement: { type: String },
    mainFunctions: { type: [String], default: [] },

    // Shapes vary between entries (`app` is a string on one record and an array
    // on the old CaseStudy schema; `source`/`websites` are arrays of strings).
    // Mixed keeps the migration lossless.
    source: { type: mongoose.Schema.Types.Mixed },
    websites: { type: mongoose.Schema.Types.Mixed },
    app: { type: mongoose.Schema.Types.Mixed },
    designColor: { type: mongoose.Schema.Types.Mixed },
    typography: { type: mongoose.Schema.Types.Mixed },
    uiDesignImgs: { type: mongoose.Schema.Types.Mixed },
    features: { type: mongoose.Schema.Types.Mixed },

    /* ---------- visibility ---------- */
    // Mirrors the Articles pattern so unfinished projects can be staged.
    draft: {
        type: Boolean,
        default: false,
    },
    archived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
})

// Derive a slug from `name` when the caller didn't supply one, so a project
// created through the API always has a readable URL instead of falling back to
// its _id. Runs on save()/create() — findOneAndUpdate skips validators by
// default, which is why scripts/seedProjects.mjs sets `slug` explicitly.
projectSchema.pre('validate', function (next) {
    if (!this.slug && this.name) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
})

const Projects = mongoose.model('Projects', projectSchema);

export default Projects;
