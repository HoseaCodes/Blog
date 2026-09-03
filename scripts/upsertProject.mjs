/*
  Add or update a single project from a JSON file.

  Run with:  node scripts/upsertProject.mjs /tmp/some-project.json --dry-run
             node scripts/upsertProject.mjs /tmp/some-project.json

  seedProjects.mjs was the one-time migration out of ProjectsData.jsx and reads
  that file directly. This is the ongoing path for projects added after it.

  Keep the input file OUT of the repo. The database is the source of truth; a
  committed copy of a record is stale as soon as the document is edited by any
  other route. Treat the file as throwaway input, not a fixture.

  Idempotent: upserts by projectId, so re-running updates rather than
  duplicating. Only the keys present in the file are written, so a partial file
  is a valid patch — it does not blank the fields it omits. Nothing is deleted.

  NOTE: findOneAndUpdate does not run the pre('validate') hook in
  models/project.js, so the record MUST carry an explicit `slug` — otherwise the
  project saves without one and /project/:slug will not resolve it. Same reason
  seedProjects.mjs sets slug in its CARD table.
*/

import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import "dotenv/config";
import Projects from "../models/project.js";

const [, , fileArg, ...flags] = process.argv;
const dryRun = flags.includes("--dry-run");

if (!fileArg) {
  console.error("Usage: node scripts/upsertProject.mjs <file.json> [--dry-run]");
  process.exit(1);
}

const file = path.resolve(fileArg);
const doc = JSON.parse(fs.readFileSync(file, "utf8"));

if (typeof doc.projectId !== "number") {
  console.error(`${fileArg}: projectId is required and must be a number.`);
  process.exit(1);
}
if (!doc.slug) {
  console.error(`${fileArg}: slug is required — findOneAndUpdate skips the hook that derives it.`);
  process.exit(1);
}

async function run() {
  const URI = process.env.MONGODB_URL || "mongodb://localhost:27017/";
  await mongoose.connect(URI);
  mongoose.set("strictQuery", false);

  // Log the host, not the URI — the connection string carries credentials.
  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

  const existing = await Projects.findOne({ projectId: doc.projectId }).lean();

  // A slug already taken by a DIFFERENT project would fail the unique index
  // mid-write; catch it here so the message names the conflict.
  const slugOwner = await Projects.findOne({ slug: doc.slug }).lean();
  if (slugOwner && slugOwner.projectId !== doc.projectId) {
    console.error(
      `Slug "${doc.slug}" already belongs to project #${slugOwner.projectId} (${slugOwner.name}).`
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  if (dryRun) {
    console.log(
      `DRY RUN  would ${existing ? "UPDATE" : "CREATE"}  #${doc.projectId}  ${doc.name}  ` +
        `(${Object.keys(doc).length} fields, draft=${doc.draft === true})`
    );
    await mongoose.disconnect();
    return;
  }

  await Projects.findOneAndUpdate({ projectId: doc.projectId }, doc, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });

  // Reported from the pre-write lookup rather than the driver's result
  // metadata. Mongoose 8 replaced `rawResult` with `includeResultMetadata`, so
  // reading `lastErrorObject` off a plain document silently yields undefined
  // and every write reports itself as CREATED. seedProjects.mjs still has that
  // bug; its output is cosmetic, but do not copy the pattern.
  console.log(
    `${existing ? "UPDATED" : "CREATED"}  #${doc.projectId}  ${doc.name}  ` +
      `-> /project/${doc.slug}  (draft=${doc.draft === true})`
  );

  const total = await Projects.countDocuments({ draft: { $ne: true }, archived: { $ne: true } });
  console.log(`${total} projects now public.`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error("Upsert failed:", err.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
