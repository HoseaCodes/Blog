import express from 'express';
import {
  getDrafts,
  createDraft,
  publishArticle,
  scheduleArticle,
  getVersionHistory,
  restoreVersion,
  duplicateArticle,
  archiveArticle,
  batchPublish,
  batchDelete,
  getScheduledPosts
} from '../controllers/blog.js';
import auth from '../utils/auth.js';

const router = express.Router();

// Protected routes - require authentication
router.use(auth);

// Draft management
router.route('/blog/drafts')
  .get(getDrafts);

router.route('/blog/draft')
  .post(createDraft);

// Publishing
router.route('/blog/publish/:id')
  .put(publishArticle);

// Scheduling
router.route('/blog/schedule/:id')
  .put(scheduleArticle);

router.route('/blog/scheduled')
  .get(getScheduledPosts);

// Version history
router.route('/blog/versions/:id')
  .get(getVersionHistory);

router.route('/blog/restore/:articleId/:versionId')
  .put(restoreVersion);

// Article operations
router.route('/blog/duplicate/:id')
  .post(duplicateArticle);

router.route('/blog/archive/:id')
  .put(archiveArticle);

// Batch operations
router.route('/blog/batch/publish')
  .post(batchPublish);

router.route('/blog/batch/delete')
  .post(batchDelete);

export default router;
