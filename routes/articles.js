import express from 'express';
import {
  getArticle,
  createArticle,
  getArticleByID,
  conditionalArticle,
  deleteArticle,
  updateArticle,
  updateArticleComment,
  updateLikes
} from '../controllers/article.js';
import {
  getComment,
  createComment,
  deleteComment
} from '../controllers/comment.js';
import {nodecache} from '../utils/cache.js';

const router = express.Router();
const commentRouter = express.Router({mergeParams: true});
router.use('/articles/:id/comments', commentRouter);

router.route('/articles')
  .get(nodecache, getArticle)
  .post(createArticle)

router.route('/articles/:id')
  .get(getArticleByID)
  .patch(conditionalArticle)
  .delete(deleteArticle)
  .put(updateArticle)

router.route('/articles/:id/likes')
  .put(updateLikes)

router.route('/articles/:id/comments')
  .get(getComment)
  .post(createComment)
  .put(updateArticleComment)

commentRouter.route('/:id')
  .delete(deleteComment)

export default router;
