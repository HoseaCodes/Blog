import express from 'express';
import {
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
} from '../controllers/roadmap.js';
import auth from '../utils/auth.js';
import authAdmin from '../utils/authAdmin.js';

const router = express.Router();

/*
  Every verb is `auth, authAdmin` — including the reads.

  routes/project.js and routes/articles.js gate writes with bare `auth`, which
  means any authenticated account (users self-register through Storm-Gate and
  are mirrored into Mongo by utils/auth.js syncBlogUser) can write them. This
  is a personal planning tool holding tuition figures, ratings and private
  goals, and it has no public surface at all, so it follows routes/category.js
  and adds authAdmin — and applies it to GET as well, since there is no
  anonymous reader to serve.
*/
const admin = [auth, authAdmin];

router.route('/roadmap').get(admin, getRoadmap);

router.route('/roadmap/settings').put(admin, updateRoadmapSettings);

router.route('/roadmap/curricula').post(admin, createCurriculum);
router
  .route('/roadmap/curricula/:slug')
  .put(admin, updateCurriculum)
  .patch(admin, patchCurriculum)
  .delete(admin, deleteCurriculum);

router.route('/roadmap/programs').post(admin, createProgram);
router
  .route('/roadmap/programs/:slug')
  .put(admin, updateProgram)
  .delete(admin, deleteProgram);
router.route('/roadmap/programs/:slug/progress').patch(admin, patchProgramProgress);

router.route('/roadmap/alternatives').post(admin, createAlternative);
router
  .route('/roadmap/alternatives/:slug')
  .put(admin, updateAlternative)
  .delete(admin, deleteAlternative);

export default router;
