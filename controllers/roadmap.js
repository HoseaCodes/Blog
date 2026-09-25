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

const SETTINGS_KEY = "roadmap";
const MAX_MONTHS = 36;

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function num(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

// Slugs are generated from the name the same way controllers/article.js does
// it, then de-duplicated against the collection so a second "Computer Science"
// does not collide on the unique index.
async function uniqueSlug(Model, name, existingSlug) {
  if (existingSlug) return existingSlug;

  const base = String(name || "item")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";

  let slug = base;
  let n = 2;
  // Bounded so a pathological collision can't spin forever.
  while (n < 100 && (await Model.exists({ slug }))) {
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
    const includeArchived = String(req.query.includeArchived || "") === "true";
    const filter = includeArchived ? {} : { archived: { $ne: true } };

    const [curricula, programs, alternatives, setting] = await Promise.all([
      Curriculums.find(filter).sort({ order: 1, name: 1 }).lean(),
      Programs.find(filter).sort({ curriculumSlug: 1, order: 1 }).lean(),
      Alternatives.find(filter).sort({ curriculumSlug: 1, order: 1 }).lean(),
      Settings.findOne({ key: SETTINGS_KEY }).lean(),
    ]);

    logger.info(
      `Returning ${curricula.length} curricula, ${programs.length} programs, ${alternatives.length} alternatives`
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
    const data = curriculumPayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "A curriculum needs a name." });
    }

    data.slug = await uniqueSlug(Curriculums, data.name, String(req.body.slug || "").trim());

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
    const data = curriculumPayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "A curriculum needs a name." });
    }

    // runValidators so an out-of-range rating or month is rejected rather than
    // written. updateProject omits this; that omission lets bad enums through.
    const curriculum = await Curriculums.findOneAndUpdate(
      { slug: req.params.slug },
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

    const curriculum = await Curriculums.findOneAndUpdate(
      { slug: req.params.slug },
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
    const { slug } = req.params;

    const curriculum = await Curriculums.findOneAndDelete({ slug });
    if (!curriculum) {
      return res.status(404).json({ msg: "Curriculum does not exist." });
    }

    const [programs, alternatives] = await Promise.all([
      Programs.deleteMany({ curriculumSlug: slug }),
      Alternatives.deleteMany({ curriculumSlug: slug }),
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

    const parent = await Curriculums.exists({ slug: curriculumSlug });
    if (!parent) {
      return res.status(400).json({ msg: "That curriculum does not exist." });
    }

    const data = programPayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "A program needs a name." });
    }

    data.curriculumSlug = curriculumSlug;
    data.slug = await uniqueSlug(Programs, data.name, String(req.body.slug || "").trim());

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
    const data = programPayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "A program needs a name." });
    }
    if (req.body.curriculumSlug) {
      data.curriculumSlug = String(req.body.curriculumSlug).trim();
    }

    const program = await Programs.findOneAndUpdate(
      { slug: req.params.slug },
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
    const progress = clamp(num(req.body.progress, 0), 0, 100);

    const existing = await Programs.findOne({ slug: req.params.slug });
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
      { slug: req.params.slug },
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
    const program = await Programs.findOneAndDelete({ slug: req.params.slug });
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

    const parent = await Curriculums.exists({ slug: curriculumSlug });
    if (!parent) {
      return res.status(400).json({ msg: "That curriculum does not exist." });
    }

    const data = alternativePayload(req.body);
    if (!data.name) {
      return res.status(400).json({ msg: "An alternative needs a name." });
    }

    data.curriculumSlug = curriculumSlug;
    data.slug = await uniqueSlug(Alternatives, data.name, String(req.body.slug || "").trim());

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

    const alternative = await Alternatives.findOneAndUpdate(
      { slug: req.params.slug },
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
    const alternative = await Alternatives.findOneAndDelete({ slug: req.params.slug });
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
    const anchor = String(req.body.anchor || "").trim();
    if (anchor && !/^\d{4}-\d{2}$/.test(anchor)) {
      return res.status(400).json({ msg: "Anchor must look like 2026-10." });
    }

    const setting = await Settings.findOneAndUpdate(
      { key: SETTINGS_KEY },
      { key: SETTINGS_KEY, value: { anchor } },
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
