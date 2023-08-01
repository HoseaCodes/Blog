import express from 'express';
import {
  getArticle,
  createArticle,
  createArticleComment,
  archiveArticle,
  deleteArticle,
  deletePostcomment,
  updateArticle,
  updateArticleComment,
  updateLikes
} from '../controllers/article.js';
import {nodecache} from '../utils/cache.js';

const router = express.Router();

router.route('/articles')
  .get(nodecache, getArticle)
  .post(createArticle)

router.route('/articles/:id')
  .patch(archiveArticle)
  .delete(deleteArticle)
  .put(updateArticle)

router.route('/articles/:id/likes')
  .put(updateLikes)

router.route('/articles/:id/postcomments')
  .post(createArticleComment)
  .delete(deletePostcomment)
  .put(updateArticleComment)

export default router;
