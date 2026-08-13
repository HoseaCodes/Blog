import express from 'express';
import auth from '../utils/auth.js';
import authAdmin from '../utils/authAdmin.js';
import {
  connect,
  callback,
  status,
  disconnect,
  postExistingArticle,
} from '../controllers/linkedin.js';

const router = express.Router();

// Initiate OAuth — admin only. Redirects browser to LinkedIn authorize URL.
router.get('/admin/linkedin/connect', auth, authAdmin, connect);

// OAuth callback — invoked by LinkedIn redirect, no auth header.
// Identity is verified via signed state cookie set in /connect.
router.get('/admin/linkedin/callback', callback);

// Status — admin only. UI polls this to render Connect / Connected.
router.get('/admin/linkedin/status', auth, authAdmin, status);

// Disconnect — admin only. Clears stored tokens.
router.delete('/admin/linkedin/disconnect', auth, authAdmin, disconnect);

// Explicit "Post to LinkedIn now" — admin only. Body: { intro?: string }.
// Bypasses the linkedinPostedAt idempotency check so re-posts work.
router.post('/admin/linkedin/post/:articleId', auth, authAdmin, postExistingArticle);

export default router;
