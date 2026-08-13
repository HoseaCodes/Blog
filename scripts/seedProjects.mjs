/*
  One-time migration: src/Pages/Projects/ProjectsData.jsx -> MongoDB.

  Run with:  node scripts/seedProjects.mjs

  The long-form record is read straight out of ProjectsData.jsx rather than
  hand-copied, so the migration is lossless. The card copy (eyebrow, stack,
  links) is defined below because it never lived in ProjectsData — it was
  duplicated into a local SHOWCASE constant in both Projects.jsx and
  projectHighlight.jsx. Folding it in here is what makes a project a single
  document instead of three files.

  Idempotent: upserts by projectId, so re-running updates rather than
  duplicating. Nothing is deleted.
*/

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import "dotenv/config";
import Projects from "../models/project.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(
  __dirname,
  "..",
  "src",
  "Pages",
  "Projects",
  "ProjectsData.jsx"
);

/* ------------------------------------------------------------------
   Card copy, lifted from the SHOWCASE constants.
   `externals` -> /project grid footer.  `links` -> home-page highlight.
------------------------------------------------------------------ */
const CARD = {
  1: {
    eyebrow: "01 / SOCIAL RING",
    cardTitle: "Custom borders for social profile pictures.",
    cardRole: "Software Lead",
    highlightRole: "Software Lead · Swift / SwiftUI",
    description:
      "iOS app letting users layer custom-designed rings around their profile pictures — 100+ borders, in-app editor, pinch-to-resize. Grew to 500+ active users before v2.",
    timeframe: "Spring 2021 · 120 hrs",
    type: "iOS App",
    stack: ["Swift", "SwiftUI", "iOS", "UIKit"],
    image: "https://i.imgur.com/138wx8D.png",
    slug: "social-ring",
    externals: [
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/social-ring/id1551446005",
      },
      { label: "Website", href: "https://www.social-ring.com/" },
    ],
    links: [
      { label: "Showcase", href: "/project/social-ring", internal: true, primary: true },
      {
        label: "App Store",
        href: "https://apps.apple.com/us/app/social-ring/id1551446005",
        external: true,
      },
      { label: "Website", href: "https://www.social-ring.com/", external: true },
    ],
  },
  2: {
    eyebrow: "02 / AIMLY",
    cardTitle: "Digital fundraising platform with gourmet chips.",
    cardRole: "Lead Backend Engineer",
    highlightRole: "Lead Backend Engineer",
    description:
      "Lead backend engineer on the API powering campaign creation, donations, team leaderboards, inventory, and shipment tracking. Real-time reporting, payment gateway integration, and serverless data layer.",
    timeframe: "Fall 2022 · 2.5k hrs",
    type: "Web Platform",
    stack: ["Node.js", "Next.js", "AWS", "MySQL", "Redux"],
    image: "https://i.imgur.com/9k4vVxL.png",
    slug: "aimly",
    externals: [{ label: "goaimly.com", href: "https://goaimly.com/" }],
    links: [
      { label: "Showcase", href: "/project/aimly", internal: true, primary: true },
      { label: "goaimly.com", href: "https://goaimly.com/", external: true },
    ],
  },
};

// ProjectsData.jsx is pure data — no imports, no JSX — so stripping the `export`
// keywords makes it evaluatable as a plain function body.
function loadProjectData() {
  const src = fs.readFileSync(DATA_FILE, "utf8");
  const body = src.replace(/^\s*export\s+const\s+/gm, "const ");
  // eslint-disable-next-line no-new-func
  const fn = new Function(`${body}\n; return projectData;`);
  return fn();
}

async function run() {
  const URI = process.env.MONGODB_URL || "mongodb://localhost:27017/";
  await mongoose.connect(URI);
  mongoose.set("strictQuery", false);
  console.log("Connected to MongoDB");

  const projectData = loadProjectData();
  console.log(`Parsed ${projectData.length} projects from ProjectsData.jsx\n`);

  for (const entry of projectData) {
    const { id, ...rest } = entry;
    const card = CARD[id] || {};

    // `prototype` cannot be a mongoose schema path (collides with
    // Object.prototype and is dropped silently), so it is stored as
    // prototypeUrl and aliased back in the component.
    const { prototype, ...safeRest } = rest;

    const doc = {
      ...safeRest,
      ...card,
      ...(prototype ? { prototypeUrl: prototype } : {}),
      projectId: id,
      order: id,
      // `title` in ProjectsData is the detail hero ("SOCIAL RING"); the card
      // headline lives in cardTitle. Keep both.
      title: entry.title,
      draft: false,
      archived: false,
    };

    const result = await Projects.findOneAndUpdate({ projectId: id }, doc, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
      rawResult: true,
    });

    const created = !result.lastErrorObject?.updatedExisting;
    console.log(
      `${created ? "CREATED" : "UPDATED"}  #${id}  ${entry.name}  ` +
        `(${Object.keys(doc).length} fields)`
    );
  }

  const total = await Projects.countDocuments();
  console.log(`\nDone. ${total} projects in the collection.`);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
