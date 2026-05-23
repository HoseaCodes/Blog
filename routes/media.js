import express from 'express';
import {
  getMediaLibrary,
  deleteMedia,
  updateMediaMetadata,
  searchMedia,
  createFolder,
  getMediaStats
} from '../controllers/media.js';
import auth from '../utils/auth.js';

const router = express.Router();

// Debug middleware to log all requests to this router
router.use((req, res, next) => {
  console.log(`[MEDIA ROUTER] ${req.method} ${req.path}`);
  next();
});

// Public routes
router.route('/media/library')
  .get(getMediaLibrary);

router.route('/media/search')
  .get(searchMedia);

// Protected routes
router.use(auth);

// Note: Media upload is handled by /api/upload route (see routes/upload.js)
// Use the existing upload endpoint for uploading media files

router.route('/media')
  .delete(deleteMedia);

router.route('/media/metadata')
  .put(updateMediaMetadata);

router.route('/media/folder')
  .post(createFolder);

router.route('/media/stats')
  .get(getMediaStats);

export default router;
