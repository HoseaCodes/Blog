import express from 'express';
import {
  getReviews,
  requestReview,
  submitReview,
  addCollaborator,
  removeCollaborator,
  getCollaborators,
  shareArticle,
  getShareAnalytics,
  addInlineComment,
  resolveInlineComment,
  getActivityFeed
} from '../controllers/collaboration.js';
import auth from '../utils/auth.js';

const router = express.Router();

// All collaboration routes require authentication
router.use(auth);

// Reviews
router.route('/collaboration/reviews')
  .get(getReviews);

router.route('/collaboration/review/request')
  .post(requestReview);

router.route('/collaboration/review/:id')
  .put(submitReview);

// Collaborators
router.route('/collaboration/collaborator')
  .post(addCollaborator);

router.route('/collaboration/collaborator/:articleId/:userId')
  .delete(removeCollaborator);

router.route('/collaboration/collaborators/:articleId')
  .get(getCollaborators);

// Sharing
router.route('/collaboration/share')
  .post(shareArticle);

router.route('/collaboration/shares/:articleId')
  .get(getShareAnalytics);

// Inline comments
router.route('/collaboration/inline-comment')
  .post(addInlineComment);

router.route('/collaboration/inline-comment/:id/resolve')
  .put(resolveInlineComment);

// Activity feed
router.route('/collaboration/activity/:articleId')
  .get(getActivityFeed);

export default router;
