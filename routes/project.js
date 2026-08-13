import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/project.js';
import auth from '../utils/auth.js';

const router = express.Router();

// Reads are public — the /project grid and /project/:id detail page are part
// of the public site. Writes require a JWT, matching routes/articles.js.
router
  .route("/projects")
  .get(getProjects)
  .post(auth, createProject);

router
  .route("/projects/:id")
  .get(getProjectById)
  .put(auth, updateProject)
  .delete(auth, deleteProject);

export default router;
