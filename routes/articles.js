import express from 'express';
import {
  getArticle,
  createArticle,
  getArticleByID,
  getAdminArticles,
  getAdminArticleByID,
  conditionalArticle,
  deleteArticle,
  updateArticle,
  updateArticleComment,
  toggleLike,
  toggleSave,
  getSavedArticles
} from '../controllers/article.js';
import {
  getComment,
  createComment,
  deleteComment
} from '../controllers/comment.js';
import { nodecache } from '../utils/cache.js';
import auth from '../utils/auth.js';
import optionalAuth from '../utils/optionalAuth.js';

const router = express.Router();
const commentRouter = express.Router({mergeParams: true});
router.use('/articles/:id/comments', commentRouter);

// Admin routes — auth-gated; return drafts and archived. Must be registered
// before /articles/:id so the prefix never gets shadowed.
router.route("/admin/articles").get(auth, getAdminArticles);
router.route("/admin/articles/:id").get(auth, getAdminArticleByID);

// Logged-in user's bookmarks. Must be registered before /articles/:id so
// the literal "saved" path isn't captured as an id.
router.route("/articles/saved").get(auth, getSavedArticles);

router
  .route("/articles")
  .get(nodecache, getArticle)
  .post(auth, createArticle);

// optionalAuth lets anonymous viewers read; authenticated viewers also get
// per-viewer `liked` and `saved` flags populated on the response.
router
  .route("/articles/:id")
  .get(optionalAuth, getArticleByID)
  .patch(auth, conditionalArticle)
  .delete(auth, deleteArticle)
  .put(auth, updateArticle);

// Like and save are user-toggled actions: POST to toggle, response includes
// the resulting state. Both require auth — anonymous clicks 401 so the UI
// can redirect to /login.
router.route('/articles/:id/like')
  .post(auth, toggleLike);

router.route('/articles/:id/save')
  .post(auth, toggleSave);

router.route('/articles/:id/comments')
  .get(getComment)
  .post(createComment)
  .put(updateArticleComment)

commentRouter.route('/:id')
  .delete(auth, deleteComment)

export default router;
