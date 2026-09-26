/*
  One-time migration for the /admin/roadmap ownership change.

  Run with:  node scripts/migrateRoadmapOwner.mjs --dry-run
             node scripts/migrateRoadmapOwner.mjs
             node scripts/migrateRoadmapOwner.mjs --owner=someone@example.com

  Roadmap records were originally global — one shared roadmap for every admin.
  They are now scoped to an owner's Storm-Gate email, which needs two things
  doing to data that already exists:

  1. Stamp `ownerEmail` on rows that predate the field. Without it they match no
     owner's filter and the page reads as empty, which is exactly what an
     ownerless row looks like from the API.

  2. Drop the old single-field unique indexes on `slug`. Mongoose creates new
     indexes but never removes ones it no longer declares, so a stale
     `slug_1 unique` would stop a second admin from having their own
     "computer-science" curriculum — the whole point of the change.

  Idempotent: re-running stamps nothing further and finds no stale index.
  Rows that already carry an ownerEmail are never reassigned.
*/

import "dotenv/config";
import mongoose from "mongoose";
import Curriculums from "../models/curriculum.js";
import Programs from "../models/program.js";
import Alternatives from "../models/alternative.js";
import Settings from "../models/setting.js";

const DRY_RUN = process.argv.includes("--dry-run");

const OWNER = (
  process.argv.find((a) => a.startsWith("--owner="))?.split("=")[1] ||
  process.env.ROADMAP_OWNER ||
  "dominique11h@yahoo.com"
).trim().toLowerCase();

const MODELS = [
  ["curricula", Curriculums],
  ["programs", Programs],
  ["alternatives", Alternatives],
];

// Indexes this migration retires. Anything else on the collection is left alone.
const STALE_INDEXES = ["slug_1", "curriculumSlug_1_order_1"];

async function dropStaleIndexes(label, Model) {
  const collection = Model.collection;

  let existing;
  try {
    existing = await collection.indexes();
  } catch (err) {
    // A collection that has never been written has no indexes to list.
    if (err.codeName === "NamespaceNotFound") {
      console.log(`  ${label}: collection does not exist yet, nothing to drop`);
      return;
    }
    throw err;
  }

  for (const name of STALE_INDEXES) {
    const found = existing.find((i) => i.name === name);
    if (!found) continue;

    if (DRY_RUN) {
      console.log(`  ${label}: would drop index ${name}${found.unique ? " (unique)" : ""}`);
      continue;
    }
    await collection.dropIndex(name);
    console.log(`  ${label}: dropped index ${name}${found.unique ? " (unique)" : ""}`);
  }
}

async function stampOwner(label, Model) {
  // $exists:false catches rows written before the field; null/"" catches any
  // that were written with it blank.
  const filter = { $or: [{ ownerEmail: { $exists: false } }, { ownerEmail: null }, { ownerEmail: "" }] };

  const count = await Model.countDocuments(filter);
  if (!count) {
    console.log(`  ${label}: no ownerless rows`);
    return;
  }

  if (DRY_RUN) {
    console.log(`  ${label}: would stamp ${count} row(s) with ${OWNER}`);
    return;
  }

  const res = await Model.updateMany(filter, { $set: { ownerEmail: OWNER } });
  console.log(`  ${label}: stamped ${res.modifiedCount} row(s) with ${OWNER}`);
}

async function migrateSettings() {
  const legacy = await Settings.findOne({ key: "roadmap" });
  if (!legacy) {
    console.log("  settings: no legacy 'roadmap' key");
    return;
  }

  const target = `roadmap:${OWNER}`;
  if (DRY_RUN) {
    console.log(`  settings: would move 'roadmap' -> '${target}'`);
    return;
  }

  await Settings.findOneAndUpdate(
    { key: target },
    { key: target, value: legacy.value || {} },
    { upsert: true, setDefaultsOnInsert: true }
  );
  await Settings.deleteOne({ key: "roadmap" });
  console.log(`  settings: moved 'roadmap' -> '${target}'`);
}

async function main() {
  const uri = process.env.MONGODB_URL || "mongodb://localhost:27017/";
  await mongoose.connect(uri);
  mongoose.set("strictQuery", false);

  // Never log the URI itself — it carries credentials.
  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);
  console.log(`Owner: ${OWNER}`);
  if (DRY_RUN) console.log("DRY RUN — nothing will be written.\n");

  console.log("\nRetiring stale indexes:");
  for (const [label, Model] of MODELS) await dropStaleIndexes(label, Model);

  console.log("\nStamping ownership:");
  for (const [label, Model] of MODELS) await stampOwner(label, Model);

  console.log("\nSettings:");
  await migrateSettings();

  if (!DRY_RUN) {
    // Build the new per-owner indexes now rather than on first request.
    console.log("\nBuilding new indexes:");
    for (const [label, Model] of MODELS) {
      await Model.syncIndexes();
      console.log(`  ${label}: indexes synced`);
    }

    console.log("\nResulting state:");
    for (const [label, Model] of MODELS) {
      const mine = await Model.countDocuments({ ownerEmail: OWNER });
      const orphaned = await Model.countDocuments({
        $or: [{ ownerEmail: { $exists: false } }, { ownerEmail: null }, { ownerEmail: "" }],
      });
      console.log(`  ${label}: ${mine} owned by ${OWNER}, ${orphaned} still ownerless`);
    }
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
