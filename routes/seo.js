import express from 'express';
import {
  analyzeSEO,
  getKeywordSuggestions,
  analyzeKeywordDensity,
  checkReadability,
  generateMetaDescription,
  generateTitleSuggestions,
  checkDuplicateContent,
  analyzeCompetitors,
  generateStructuredData,
  analyzeLinkStructure,
  getTrendingTopics,
  optimizeImageSEO
} from '../controllers/seo.js';
import auth from '../utils/auth.js';

const router = express.Router();

// All SEO routes require authentication
router.use(auth);

router.route('/seo/analyze')
  .post(analyzeSEO);

router.route('/seo/keywords')
  .post(getKeywordSuggestions);

router.route('/seo/keyword-density')
  .post(analyzeKeywordDensity);

router.route('/seo/readability')
  .post(checkReadability);

router.route('/seo/meta-description')
  .post(generateMetaDescription);

router.route('/seo/title-suggestions')
  .post(generateTitleSuggestions);

router.route('/seo/duplicate-check')
  .post(checkDuplicateContent);

router.route('/seo/competitors')
  .post(analyzeCompetitors);

router.route('/seo/structured-data')
  .post(generateStructuredData);

router.route('/seo/link-analysis')
  .post(analyzeLinkStructure);

router.route('/seo/trending')
  .get(getTrendingTopics);

router.route('/seo/image-optimization')
  .post(optimizeImageSEO);

export default router;
