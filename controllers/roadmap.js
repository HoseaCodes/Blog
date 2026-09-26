import Curriculums from "../models/curriculum.js";
import Programs from "../models/program.js";
import Alternatives from "../models/alternative.js";
import Settings from "../models/setting.js";
import Logger from "../utils/logger.js";

const logger = new Logger("roadmap");

/*
  The private learning roadmap behind /admin/roadmap.

  Deliberately NO PUBLIC_FILTER here, unlike controllers/project.js and
  controllers/article.js. Those serve anonymous readers and need a predicate to
  hide drafts; every route in routes/roadmap.js is `auth, authAdmin`, so the
  route gate IS the filter. Don't "fix" this by adding one.
*/

const MAX_MONTHS = 36;

/*
  Every record belongs to one admin. The owner is Storm-Gate's email for the
  caller (utils/auth.js merges /me onto req.user), never anything the client
  sends — otherwise one admin could read or overwrite another's roadmap by
  passing a different address.
*/
function ownerOf(req) {
  const email = String(req.user?.email || "").trim().toLowerCase();
  return email || null;
}

// Settings are per owner too, so each roadmap has its own calendar anchor.
const settingsKeyFor = (owner) => `roadmap:${owner}`;

// Guard used by every handler. Storm-Gate can authenticate a caller without
// returning a profile (see the /me failure path in utils/auth.js), and a
// roadmap with no owner would be invisible and unwritable, so fail loudly
// rather than silently scoping to undefined.
function requireOwner(req, res) {
  const owner = ownerOf(req);
  if (!owner) {
    res.status(403).json({ msg: "No account email available; cannot resolve your roadmap." });
    return null;
  }
  return owner;
}

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Slugs are generated from the name the same way controllers/article.js does
// it, then de-duplicated against the collection so a second "Computer Science"
// does not collide on the unique index.
async function uniqueSlug(Model, owner, name, existingSlug) {
  if (existingSlug) return existingSlug;

  const base = String(name || "item")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";

  let slug = base;
  let n = 2;
  // Bounded so a pathological collision can't spin forever.
  while (n < 100 && (await Model.exists({ ownerEmail: owner, slug }))) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return slug;
}

/* ------------------------------------------------------------------
   Read — one payload for the whole page
   ------------------------------------------------------------------ */

// The page draws every lane, bar and panel from the same data, so one round
// trip beats three. ~20 documents; there is no pagination case here.
async function getRoadmap(req, res) {
  try {
    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const includeArchived = String(req.query.includeArchived || "") === "true";
    const filter = includeArchived
      ? { ownerEmail: owner }
      : { ownerEmail: owner, archived: { $ne: true } };

    const [curricula, programs, alternatives, setting] = await Promise.all([
      Curriculums.find(filter).sort({ order: 1, name: 1 }).lean(),
      Programs.find(filter).sort({ curriculumSlug: 1, order: 1 }).lean(),
      Alternatives.find(filter).sort({ curriculumSlug: 1, order: 1 }).lean(),
      Settings.findOne({ key: settingsKeyFor(owner) }).lean(),
    ]);

    logger.info(
      `Returning ${curricula.length} curricula, ${programs.length} programs, ${alternatives.length} alternatives for ${owner}`
    );

    res.json({
      status: "success",
      curricula,
      programs,
      alternatives,
      settings: (setting && setting.value) || {},
      result: curricula.length,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

/* ------------------------------------------------------------------
   Curricula
   ------------------------------------------------------------------ */

function curriculumPayload(body) {
  const data = {
    name: String(body.name || "").trim(),
    why: String(body.why || "").trim(),
    shortTermGoal: String(body.shortTermGoal || "").trim(),
    longTermGoal: String(body.longTermGoal || "").trim(),
    rating: clamp(num(body.rating, 0), 0, 5),
    detail: String(body.detail || ""),
    startMonth: clamp(num(body.startMonth, 1), 1, MAX_MONTHS),
    endMonth: clamp(num(body.endMonth, 12), 1, MAX_MONTHS),
    color: String(body.color || "#4f6bed").trim(),
    order: num(body.order, 0),
  };
  if (data.endMonth < data.startMonth) data.endMonth = data.startMonth;
  if (typeof body.archived === "boolean") data.archived = body.archived;
  return data;
}

async function createCurriculum(req, res) {
  try {
    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const data = curriculumPayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "A curriculum needs a name." });
    }

    data.ownerEmail = owner;
    data.slug = await uniqueSlug(Curriculums, owner, data.name, String(req.body.slug || "").trim());

    const curriculum = await Curriculums.create(data);
    logger.info(`Created curriculum ${curriculum.slug}`);

    res.json({ success: true, msg: "Curriculum created.", curriculum });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function updateCurriculum(req, res) {
  try {
    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const data = curriculumPayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "A curriculum needs a name." });
    }

    // runValidators so an out-of-range rating or month is rejected rather than
    // written. updateProject omits this; that omission lets bad enums through.
    // The ownerEmail in the filter is what stops one admin editing another's.
    const curriculum = await Curriculums.findOneAndUpdate(
      { ownerEmail: owner, slug: req.params.slug },
      data,
      { new: true, runValidators: true }
    );
    if (!curriculum) {
      return res.status(404).json({ msg: "Curriculum does not exist." });
    }

    res.json({ success: true, msg: "Curriculum updated.", curriculum });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Partial update for the fields edited in place on the page — the rating pips
// and the two goal cells. Kept off the full PUT so a pip click cannot blank a
// field the form did not send.
async function patchCurriculum(req, res) {
  try {
    const updates = {};
    if (req.body.rating !== undefined) updates.rating = clamp(num(req.body.rating, 0), 0, 5);
    if (req.body.why !== undefined) updates.why = String(req.body.why).trim();
    if (req.body.shortTermGoal !== undefined) updates.shortTermGoal = String(req.body.shortTermGoal).trim();
    if (req.body.longTermGoal !== undefined) updates.longTermGoal = String(req.body.longTermGoal).trim();
    if (req.body.order !== undefined) updates.order = num(req.body.order, 0);

    if (!Object.keys(updates).length) {
      return res.status(400).json({ msg: "Nothing to update." });
    }

    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const curriculum = await Curriculums.findOneAndUpdate(
      { ownerEmail: owner, slug: req.params.slug },
      updates,
      { new: true, runValidators: true }
    );
    if (!curriculum) {
      return res.status(404).json({ msg: "Curriculum does not exist." });
    }

    res.json({ success: true, curriculum });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Cascades. A curriculum's programs and alternatives are meaningless without
// it, and leaving them behind would orphan bars that never render again.
async function deleteCurriculum(req, res) {
  try {
    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const { slug } = req.params;

    const curriculum = await Curriculums.findOneAndDelete({ ownerEmail: owner, slug });
    if (!curriculum) {
      return res.status(404).json({ msg: "Curriculum does not exist." });
    }

    // Scoped by owner as well as slug so a cascade can never reach across
    // accounts, even if two owners share a curriculum slug.
    const [programs, alternatives] = await Promise.all([
      Programs.deleteMany({ ownerEmail: owner, curriculumSlug: slug }),
      Alternatives.deleteMany({ ownerEmail: owner, curriculumSlug: slug }),
    ]);

    logger.info(
      `Deleted curriculum ${slug} with ${programs.deletedCount} programs and ${alternatives.deletedCount} alternatives`
    );

    res.json({
      success: true,
      msg: "Curriculum deleted.",
      removed: {
        programs: programs.deletedCount,
        alternatives: alternatives.deletedCount,
      },
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

/* ------------------------------------------------------------------
   Programs
   ------------------------------------------------------------------ */

function programPayload(body) {
  const data = {
    name: String(body.name || "").trim(),
    code: String(body.code || "").trim(),
    provider: String(body.provider || "").trim(),
    startMonth: clamp(num(body.startMonth, 1), 1, MAX_MONTHS),
    endMonth: clamp(num(body.endMonth, 1), 1, MAX_MONTHS),
    lengthLabel: String(body.lengthLabel || "").trim(),
    progress: clamp(num(body.progress, 0), 0, 100),
    link: String(body.link || "").trim(),
    detail: String(body.detail || ""),
    outcome: String(body.outcome || "").trim(),
    notes: String(body.notes || ""),
    order: num(body.order, 0),
    teaches: Array.isArray(body.teaches)
      ? body.teaches.map((t) => String(t).trim()).filter(Boolean)
      : String(body.teaches || "")
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
  };
  if (data.endMonth < data.startMonth) data.endMonth = data.startMonth;
  if (typeof body.archived === "boolean") data.archived = body.archived;
  return data;
}

async function createProgram(req, res) {
  try {
    const curriculumSlug = String(req.body.curriculumSlug || "").trim();
    if (!curriculumSlug) {
      return res.status(400).json({ msg: "A program needs a curriculum." });
    }

    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    // Scoped: you cannot hang a program off someone else's curriculum.
    const parent = await Curriculums.exists({ ownerEmail: owner, slug: curriculumSlug });
    if (!parent) {
      return res.status(400).json({ msg: "That curriculum does not exist." });
    }

    const data = programPayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "A program needs a name." });
    }

    data.ownerEmail = owner;
    data.curriculumSlug = curriculumSlug;
    data.slug = await uniqueSlug(Programs, owner, data.name, String(req.body.slug || "").trim());

    const program = await Programs.create(data);
    logger.info(`Created program ${program.slug} under ${curriculumSlug}`);

    res.json({ success: true, msg: "Program created.", program });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function updateProgram(req, res) {
  try {
    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const data = programPayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "A program needs a name." });
    }
    if (req.body.curriculumSlug) {
      const target = String(req.body.curriculumSlug).trim();
      // Re-parenting is allowed, but only to a curriculum you own.
      const parent = await Curriculums.exists({ ownerEmail: owner, slug: target });
      if (!parent) {
        return res.status(400).json({ msg: "That curriculum does not exist." });
      }
      data.curriculumSlug = target;
    }

    const program = await Programs.findOneAndUpdate(
      { ownerEmail: owner, slug: req.params.slug },
      data,
      { new: true, runValidators: true }
    );
    if (!program) {
      return res.status(404).json({ msg: "Program does not exist." });
    }

    res.json({ success: true, msg: "Program updated.", program });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// The high-frequency write path: the progress slider. Kept separate from the
// full PUT so dragging a slider never has to round-trip the whole document.
async function patchProgramProgress(req, res) {
  try {
    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const progress = clamp(num(req.body.progress, 0), 0, 100);

    const existing = await Programs.findOne({ ownerEmail: owner, slug: req.params.slug });
    if (!existing) {
      return res.status(404).json({ msg: "Program does not exist." });
    }

    const updates = { progress };
    // Stamp the transitions rather than asking the UI to send them.
    if (progress > 0 && !existing.startedAt) updates.startedAt = new Date();
    if (progress >= 100) updates.completedAt = existing.completedAt || new Date();
    else updates.completedAt = null;
    if (req.body.notes !== undefined) updates.notes = String(req.body.notes);

    const program = await Programs.findOneAndUpdate(
      { ownerEmail: owner, slug: req.params.slug },
      updates,
      { new: true, runValidators: true }
    );

    res.json({ success: true, program });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function deleteProgram(req, res) {
  try {
    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const program = await Programs.findOneAndDelete({ ownerEmail: owner, slug: req.params.slug });
    if (!program) {
      return res.status(404).json({ msg: "Program does not exist." });
    }
    res.json({ success: true, msg: "Program deleted." });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

/* ------------------------------------------------------------------
   Alternatives
   ------------------------------------------------------------------ */

function alternativePayload(body) {
  const rawCost = body.costAmount;
  const hasCost = rawCost !== undefined && rawCost !== null && String(rawCost).trim() !== "";

  const data = {
    name: String(body.name || "").trim(),
    provider: String(body.provider || "").trim(),
    kind: body.kind === "free" ? "free" : "paid",
    // null, not 0 — "not checked" and "free" are different claims.
    costAmount: hasCost ? num(rawCost, null) : null,
    costUnit: String(body.costUnit || "").trim(),
    costNote: String(body.costNote || "").trim(),
    credential: String(body.credential || "").trim(),
    format: String(body.format || "").trim(),
    link: String(body.link || "").trim(),
    detail: String(body.detail || ""),
    tradeoff: String(body.tradeoff || ""),
    order: num(body.order, 0),
  };
  if (typeof body.archived === "boolean") data.archived = body.archived;
  return data;
}

async function createAlternative(req, res) {
  try {
    const curriculumSlug = String(req.body.curriculumSlug || "").trim();
    if (!curriculumSlug) {
      return res.status(400).json({ msg: "An alternative needs a curriculum." });
    }

    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const parent = await Curriculums.exists({ ownerEmail: owner, slug: curriculumSlug });
    if (!parent) {
      return res.status(400).json({ msg: "That curriculum does not exist." });
    }

    const data = alternativePayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "An alternative needs a name." });
    }

    data.ownerEmail = owner;
    data.curriculumSlug = curriculumSlug;
    data.slug = await uniqueSlug(Alternatives, owner, data.name, String(req.body.slug || "").trim());

    const alternative = await Alternatives.create(data);
    res.json({ success: true, msg: "Alternative created.", alternative });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function updateAlternative(req, res) {
  try {
    const data = alternativePayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "An alternative needs a name." });
    }

    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const alternative = await Alternatives.findOneAndUpdate(
      { ownerEmail: owner, slug: req.params.slug },
      data,
      { new: true, runValidators: true }
    );
    if (!alternative) {
      return res.status(404).json({ msg: "Alternative does not exist." });
    }

    res.json({ success: true, msg: "Alternative updated.", alternative });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function deleteAlternative(req, res) {
  try {
    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const alternative = await Alternatives.findOneAndDelete({ ownerEmail: owner, slug: req.params.slug });
    if (!alternative) {
      return res.status(404).json({ msg: "Alternative does not exist." });
    }
    res.json({ success: true, msg: "Alternative deleted." });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

/* ------------------------------------------------------------------
   Settings
   ------------------------------------------------------------------ */

// Currently just the calendar anchor the month axis is labelled from.
async function updateRoadmapSettings(req, res) {
  try {
    const owner = requireOwner(req, res);
    if (!owner) return undefined;

    const anchor = String(req.body.anchor || "").trim();
    if (anchor && !/^\d{4}-\d{2}$/.test(anchor)) {
      return res.status(400).json({ msg: "Anchor must look like 2026-10." });
    }

    const setting = await Settings.findOneAndUpdate(
      { key: settingsKeyFor(owner) },
      { key: settingsKeyFor(owner), value: { anchor } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, settings: setting.value });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export {
  getRoadmap,
  createCurriculum,
  updateCurriculum,
  patchCurriculum,
  deleteCurriculum,
  createProgram,
  updateProgram,
  patchProgramProgress,
  deleteProgram,
  createAlternative,
  updateAlternative,
  deleteAlternative,
  updateRoadmapSettings,
};
