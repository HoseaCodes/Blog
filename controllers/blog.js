import Articles from "../models/article.js";
import Logger from "../utils/logger.js";

const logger = new Logger("blog");

// Get all drafts for authenticated user
export async function getDrafts(req, res) {
  try {
    const drafts = await Articles.find({ 
      draft: true,
      postedBy: req.user.id 
    }).sort({ updatedAt: -1 });

    logger.info(`Returning ${drafts.length} drafts for user ${req.user.id}`);
    
    res.json({
      status: "success",
      drafts,
      result: drafts.length
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Get scheduled posts
export async function getScheduledPosts(req, res) {
  try {
    const scheduled = await Articles.find({ 
      scheduled: true,
      postedBy: req.user.id 
    }).sort({ scheduledDateTime: 1 });

    logger.info(`Returning ${scheduled.length} scheduled posts`);
    
    res.json({
      status: "success",
      scheduled,
      result: scheduled.length
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Create or update draft
export async function createDraft(req, res) {
  try {
    // Log incoming request for debugging
    console.log('=== CREATE DRAFT REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('User ID:', req.user?.id);
    
    // Validate required fields
    if (!req.body.title) {
      console.log('ERROR: Missing title');
      return res.status(400).json({ 
        msg: 'Title is required',
        error: 'MISSING_TITLE'
      });
    }
    
    if (!req.body.article_id) {
      console.log('ERROR: Missing article_id');
      return res.status(400).json({ 
        msg: 'Article ID is required',
        error: 'MISSING_ARTICLE_ID'
      });
    }

    const draftData = {
      ...req.body,
      postedBy: req.user.id,
      draft: true,
      published: false
    };

    let draft;
    
    // Check if updating existing draft by MongoDB _id or article_id
    if (req.body._id) {
      // Update by MongoDB _id
      draft = await Articles.findByIdAndUpdate(
        req.body._id,
        draftData,
        { new: true, runValidators: false }
      );
    } else if (req.body.article_id) {
      // Check if draft with this article_id already exists
      const existing = await Articles.findOne({ article_id: req.body.article_id });
      if (existing) {
        // Update existing
        draft = await Articles.findByIdAndUpdate(
          existing._id,
          draftData,
          { new: true, runValidators: false }
        );
      } else {
        // Create new draft
        draft = await Articles.create(draftData);
      }
    } else {
      // Create new draft
      draft = await Articles.create(draftData);
    }

    logger.info(`Draft saved: ${draft._id}`);
    
    res.json({
      status: "success",
      draft
    });
  } catch (err) {
    console.log('=== DRAFT SAVE ERROR ===');
    console.log('Error name:', err.name);
    console.log('Error message:', err.message);
    console.log('Error code:', err.code);
    console.log('Full error:', err);
    
    logger.error('Draft save error:', err);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => ({
        field: key,
        message: err.errors[key].message
      }));
      console.log('Validation errors:', errors);
      return res.status(400).json({ 
        msg: 'Validation failed',
        errors,
        error: 'VALIDATION_ERROR'
      });
    }
    
    // Handle duplicate key errors
    if (err.code === 11000) {
      console.log('Duplicate key error');
      return res.status(400).json({ 
        msg: 'Article with this ID already exists',
        error: 'DUPLICATE_ARTICLE_ID'
      });
    }
    
    console.log('Unknown error type');
    return res.status(500).json({ 
      msg: err.message,
      error: 'SERVER_ERROR'
    });
  }
}

// Publish article
export async function publishArticle(req, res) {
  try {
    const article = await Articles.findByIdAndUpdate(
      req.params.id,
      {
        draft: false,
        published: true,
        scheduled: false,
        scheduledDateTime: null,
        ...req.body
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    logger.info(`Article published: ${article._id}`);
    
    res.json({
      status: "success",
      article
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Schedule article
export async function scheduleArticle(req, res) {
  try {
    const { scheduledDateTime } = req.body;

    if (!scheduledDateTime) {
      return res.status(400).json({ msg: "scheduledDateTime is required" });
    }

    const article = await Articles.findByIdAndUpdate(
      req.params.id,
      {
        scheduled: true,
        scheduledDateTime: new Date(scheduledDateTime),
        draft: false,
        published: false
      },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    logger.info(`Article scheduled: ${article._id} for ${scheduledDateTime}`);
    
    res.json({
      status: "success",
      article
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Get version history (simplified - would need separate Version model for full implementation)
export async function getVersionHistory(req, res) {
  try {
    // This is a simplified implementation
    // In production, you'd want a separate Version collection
    const article = await Articles.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    // Return article history (placeholder)
    res.json({
      status: "success",
      versions: [
        {
          versionId: article._id,
          createdAt: article.createdAt,
          updatedAt: article.updatedAt,
          isCurrent: true
        }
      ]
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Restore version (simplified)
export async function restoreVersion(req, res) {
  try {
    // Placeholder for version restoration
    // Would need Version model for full implementation
    res.json({
      status: "success",
      msg: "Version restoration requires Version model implementation"
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Duplicate article
export async function duplicateArticle(req, res) {
  try {
    const original = await Articles.findById(req.params.id);
    
    if (!original) {
      return res.status(404).json({ msg: "Article not found" });
    }

    const duplicate = await Articles.create({
      ...original.toObject(),
      _id: undefined,
      article_id: `${original.article_id}-copy-${Date.now()}`,
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      draft: true,
      published: false,
      scheduled: false,
      scheduledDateTime: null,
      postedBy: req.user.id,
      likes: 0,
      views: 0,
      comments: []
    });

    logger.info(`Article duplicated: ${duplicate._id}`);
    
    res.json({
      status: "success",
      article: duplicate
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Archive article
export async function archiveArticle(req, res) {
  try {
    const article = await Articles.findByIdAndUpdate(
      req.params.id,
      { archived: true },
      { new: true }
    );

    if (!article) {
      return res.status(404).json({ msg: "Article not found" });
    }

    logger.info(`Article archived: ${article._id}`);
    
    res.json({
      status: "success",
      article
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Batch publish
export async function batchPublish(req, res) {
  try {
    const { articleIds } = req.body;

    const result = await Articles.updateMany(
      { _id: { $in: articleIds }, postedBy: req.user.id },
      {
        draft: false,
        published: true,
        scheduled: false
      }
    );

    logger.info(`Batch published ${result.modifiedCount} articles`);
    
    res.json({
      status: "success",
      modified: result.modifiedCount
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Batch delete
export async function batchDelete(req, res) {
  try {
    const { articleIds } = req.body;

    const result = await Articles.deleteMany({
      _id: { $in: articleIds },
      postedBy: req.user.id
    });

    logger.info(`Batch deleted ${result.deletedCount} articles`);
    
    res.json({
      status: "success",
      deleted: result.deletedCount
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}
