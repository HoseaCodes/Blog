import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import Logger from '../utils/logger.js';

dotenv.config();

const logger = new Logger('media');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Get media library
export async function getMediaLibrary(req, res) {
  try {
    logger.info('Media library request:', { folder: req.query.folder });
    
    // Check if Cloudinary is configured
    if (!process.env.CLOUND_NAME || !process.env.CLOUD_API_KEY) {
      logger.error('Cloudinary not configured');
      return res.status(400).json({ 
        msg: 'Media service not configured',
        media: [],
        folders: [],
        total: 0
      });
    }

    const { folder } = req.query;
    
    const searchExpression = folder ? `folder:HoseaCodes/${folder}/*` : 'folder:HoseaCodes/*';
    
    logger.info('Cloudinary search:', { expression: searchExpression });
    
    const result = await cloudinary.v2.search
      .expression(searchExpression)
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    logger.info(`Returning ${result.total_count} media items`);
    
    res.json({
      status: 'success',
      media: result.resources,
      folders: result.folders || [],
      total: result.total_count
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Delete media (using existing destroy functionality)
export async function deleteMedia(req, res) {
  try {
    const { public_id } = req.body;
    
    await cloudinary.v2.uploader.destroy(public_id);
    
    logger.info(`Media deleted: ${public_id}`);
    
    res.json({
      status: 'success',
      msg: 'Media deleted successfully'
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Update media metadata
export async function updateMediaMetadata(req, res) {
  try {
    const { public_id, context } = req.body;
    
    const result = await cloudinary.v2.uploader.explicit(public_id, {
      type: 'upload',
      context: context
    });
    
    logger.info(`Metadata updated for: ${public_id}`);
    
    res.json({
      status: 'success',
      result
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Search media
export async function searchMedia(req, res) {
  try {
    const { query } = req.query;
    
    const result = await cloudinary.v2.search
      .expression(query)
      .max_results(50)
      .execute();
    
    res.json({
      status: 'success',
      results: result.resources
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Create folder (Note: Cloudinary creates folders implicitly)
export async function createFolder(req, res) {
  try {
    const { name } = req.body;
    
    // Cloudinary doesn't have explicit folder creation
    // Folders are created when uploading to them
    res.json({
      status: 'success',
      msg: `Folder ${name} will be created on first upload`,
      folder: `HoseaCodes/${name}`
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}

// Get media stats
export async function getMediaStats(req, res) {
  try {
    const usage = await cloudinary.v2.api.usage();
    
    res.json({
      status: 'success',
      stats: usage
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ msg: err.message });
  }
}
