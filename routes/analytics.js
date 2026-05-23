import express from 'express';
import {
  getArticleStats,
  getPerformanceMetrics,
  trackView,
  trackEngagement,
  getTopArticles,
  getReaderDemographics,
  getTrafficSources,
  getEngagementMetrics,
  getConversionMetrics,
  getRealTimeStats,
  exportAnalytics
} from '../controllers/analytics.js';
import auth from '../utils/auth.js';

const router = express.Router();

// Public routes
router.route('/analytics/view')
  .post(trackView);

router.route('/analytics/engagement')
  .post(trackEngagement);

// Protected routes
router.use(auth);

router.route('/analytics/article/:id')
  .get(getArticleStats);

router.route('/analytics/performance')
  .get(getPerformanceMetrics);

router.route('/analytics/top-articles')
  .get(getTopArticles);

router.route('/analytics/demographics/:id')
  .get(getReaderDemographics);

router.route('/analytics/traffic-sources/:id')
  .get(getTrafficSources);

router.route('/analytics/engagement/:id')
  .get(getEngagementMetrics);

router.route('/analytics/conversions')
  .get(getConversionMetrics);

router.route('/analytics/realtime')
  .get(getRealTimeStats);

router.route('/analytics/export')
  .get(exportAnalytics);

export default router;
