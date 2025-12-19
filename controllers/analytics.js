import Articles from '../models/article.js';
import Logger from '../utils/logger.js';

const logger = new Logger('analytics');

// Basic analytics implementation using existing Article model
// For production, consider dedicated Analytics model or service like Google Analytics

export async function getArticleStats(req, res) {
  try {
    const { id } = req.params;
    const article = await Articles.findById(id);

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    res.json({
      status: 'success',
      stats: {
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments?.length || 0,
        shares: 0 // Would require Share tracking
      }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function getPerformanceMetrics(req, res) {
  try {
    const { range = '7d' } = req.query;
    
    // Calculate date range
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const days = daysMap[range] || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const articles = await Articles.find({
      postedBy: req.user.id,
      createdAt: { $gte: startDate }
    });

    const metrics = {
      totalArticles: articles.length,
      totalViews: articles.reduce((sum, a) => sum + (a.views || 0), 0),
      totalLikes: articles.reduce((sum, a) => sum + (a.likes || 0), 0),
      totalComments: articles.reduce((sum, a) => sum + (a.comments?.length || 0), 0),
      avgViewsPerArticle: articles.length > 0 
        ? Math.round(articles.reduce((sum, a) => sum + (a.views || 0), 0) / articles.length)
        : 0
    };

    res.json({
      status: 'success',
      metrics
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function trackView(req, res) {
  try {
    const { articleId } = req.body;
    
    await Articles.findByIdAndUpdate(articleId, {
      $inc: { views: 1 }
    });

    res.json({ status: 'success' });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function trackEngagement(req, res) {
  try {
    console.log('=== TRACK ENGAGEMENT REQUEST ===');
    console.log('Request body:', req.body);
    
    const { articleId, eventType, data } = req.body;
    
    // Validation - articleId and eventType are optional for tracking
    if (!articleId && !eventType) {
      logger.warn('Engagement tracking attempted without articleId or eventType');
    }
    
    // Log engagement for future analytics implementation
    logger.info(`Engagement tracked: ${eventType || 'unknown'} for article ${articleId || 'none'}`, data);
    
    console.log('Engagement tracked successfully');
    
    // Always return success to not block user experience
    return res.json({ 
      status: 'success',
      message: 'Engagement tracked'
    });
  } catch (err) {
    console.error('=== ENGAGEMENT TRACKING ERROR ===');
    console.error('Error:', err);
    logger.error('Error tracking engagement:', err);
    // Return success even on error to not block auto-save
    return res.json({ 
      status: 'success',
      message: 'Engagement tracking skipped'
    });
  }
}

export async function getTopArticles(req, res) {
  try {
    const { range = '7d', limit = 10 } = req.query;
    
    const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
    const days = daysMap[range] || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const articles = await Articles.find({
      published: true,
      createdAt: { $gte: startDate }
    })
    .sort({ views: -1 })
    .limit(parseInt(limit))
    .select('title slug views likes comments createdAt');

    res.json({
      status: 'success',
      articles
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function getReaderDemographics(req, res) {
  try {
    // TODO: Implement with proper analytics service
    res.json({
      status: 'success',
      demographics: {
        msg: 'Demographics tracking requires analytics service integration'
      }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function getTrafficSources(req, res) {
  try {
    // TODO: Implement with proper analytics service
    res.json({
      status: 'success',
      sources: {
        msg: 'Traffic source tracking requires analytics service integration'
      }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function getEngagementMetrics(req, res) {
  try {
    const { id } = req.params;
    const article = await Articles.findById(id);

    if (!article) {
      return res.status(404).json({ msg: 'Article not found' });
    }

    const engagementRate = article.views > 0 
      ? ((article.likes + article.comments?.length || 0) / article.views * 100).toFixed(2)
      : 0;

    res.json({
      status: 'success',
      engagement: {
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments?.length || 0,
        engagementRate: `${engagementRate}%`
      }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function getConversionMetrics(req, res) {
  try {
    // TODO: Implement conversion tracking
    res.json({
      status: 'success',
      conversions: {
        msg: 'Conversion tracking requires dedicated implementation'
      }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function getRealTimeStats(req, res) {
  try {
    const recentArticles = await Articles.find({
      published: true,
      postedBy: req.user.id
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('title views likes comments createdAt');

    res.json({
      status: 'success',
      realtime: {
        recentArticles
      }
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

export async function exportAnalytics(req, res) {
  try {
    const { range = '7d', format = 'csv' } = req.query;
    
    // TODO: Implement data export functionality
    res.json({
      status: 'success',
      msg: 'Analytics export requires implementation'
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}
