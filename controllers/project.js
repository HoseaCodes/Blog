import Projects from "../models/project.js";
import Logger from "../utils/logger.js";

const logger = new Logger("projects");

// Public visibility predicate. Mirrors PUBLIC_FILTER in controllers/article.js.
const PUBLIC_FILTER = { draft: { $ne: true }, archived: { $ne: true } };

// Grid order: explicit `order` wins, otherwise fall back to projectId so the
// migrated records keep the sequence they had as an array.
const SORT = { order: 1, projectId: 1 };

async function getProjects(req, res) {
  try {
    const projects = await Projects.find(PUBLIC_FILTER).sort(SORT).lean();

    logger.info(`Returning ${projects.length} projects`);

    res.json({
      status: "success",
      projects,
      result: projects.length,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Resolves by numeric projectId first (the /project/:id URLs), then by slug,
// then by Mongo _id — so old links keep working and slugs can be adopted later.
async function getProjectById(req, res) {
  try {
    const { id } = req.params;

    let project = null;
    const numericId = Number(id);
    if (Number.isInteger(numericId)) {
      project = await Projects.findOne({
        projectId: numericId,
        ...PUBLIC_FILTER,
      }).lean();
    }
    if (!project) {
      project = await Projects.findOne({ slug: id, ...PUBLIC_FILTER }).lean();
    }
    if (!project && /^[a-f0-9]{24}$/i.test(id)) {
      project = await Projects.findOne({ _id: id, ...PUBLIC_FILTER }).lean();
    }

    if (!project) {
      logger.error(`Project not found - ${id}`);
      return res.status(404).json({ msg: "Project does not exist" });
    }

    res.json({ status: "success", project });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function createProject(req, res) {
  try {
    const { projectId, name } = req.body;

    if (projectId === undefined || projectId === null || projectId === "") {
      logger.error("No projectId provided.");
      return res.status(400).json({ msg: "No projectId provided." });
    }
    if (!name) {
      logger.error("No name provided.");
      return res.status(400).json({ msg: "No name provided." });
    }

    const existing = await Projects.findOne({ projectId });
    if (existing) {
      logger.error(`Project ${projectId} already exists.`);
      return res.status(400).json({ msg: "This project already exists." });
    }

    const project = new Projects(req.body);
    await project.save();

    logger.info(`Created project ${project.projectId} - ${project.name}`);

    res.json({
      success: true,
      msg: "Created a new project",
      project: { projectId: project.projectId, name: project.name },
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function updateProject(req, res) {
  try {
    const { id } = req.params;

    // projectId is the public identifier — changing it would break existing
    // /project/:id links, so it is not accepted from the request body.
    const { projectId, _id, ...updates } = req.body;

    const project = await Projects.findOneAndUpdate(
      { projectId: Number(id) },
      updates,
      { new: true }
    );

    if (!project) {
      logger.error(`Project not found - ${id}`);
      return res.status(404).json({ msg: "Project does not exist" });
    }

    logger.info(`Updated project ${id}`);
    res.json({ success: true, msg: "Updated project", project });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

async function deleteProject(req, res) {
  try {
    const { id } = req.params;

    const project = await Projects.findOneAndDelete({ projectId: Number(id) });

    if (!project) {
      logger.error(`Project not found - ${id}`);
      return res.status(404).json({ msg: "Project does not exist" });
    }

    logger.info(`Deleted project ${id}`);
    res.json({ success: true, msg: "Deleted project" });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
