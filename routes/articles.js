import express from 'express';
import {
  getArticle,
  createArticle,
  archiveArticle,
  deleteArticle,
  updateArticle
} from '../controllers/article.js';
import nodecache from '../utils/cache.js';

const router = express.Router();

router.route('/articles')
    // .get(nodecache(300), getArticle)
    .get( getArticle)
    .post(createArticle)

router.route('/articles/:id')
    .patch(archiveArticle)
    .delete(deleteArticle)
    .put(updateArticle)

export default router;
