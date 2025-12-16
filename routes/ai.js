import express from 'express';
import {
  generateContent,
  improveContent,
  generateTitles,
  generateOutline,
  expandContent,
  summarizeContent,
  translateContent,
  generateSocialPosts,
  checkGrammar,
  getStyleSuggestions,
  generateMetaTags,
  extractKeyPoints,
  generateCTA
} from '../controllers/ai.js';
import auth from '../utils/auth.js';

const router = express.Router();

// All AI routes require authentication
router.use(auth);

router.route('/ai/generate')
  .post(generateContent);

router.route('/ai/improve')
  .post(improveContent);

router.route('/ai/titles')
  .post(generateTitles);

router.route('/ai/outline')
  .post(generateOutline);

router.route('/ai/expand')
  .post(expandContent);

router.route('/ai/summarize')
  .post(summarizeContent);

router.route('/ai/translate')
  .post(translateContent);

router.route('/ai/social-posts')
  .post(generateSocialPosts);

router.route('/ai/grammar')
  .post(checkGrammar);

router.route('/ai/style')
  .post(getStyleSuggestions);

router.route('/ai/meta-tags')
  .post(generateMetaTags);

router.route('/ai/key-points')
  .post(extractKeyPoints);

router.route('/ai/cta')
  .post(generateCTA);

export default router;
