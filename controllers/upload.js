import fs from 'fs';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import Logger from '../utils/logger.js';
import {cache} from '../utils/cache.js';
const logger = new Logger('articles')

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUND_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const removeTmp = (path) => {
  fs.unlink(path, err => {
      if (err) throw err;
  });
}

async function getAllUploads(req, res) {
  try {

    cloudinary.v2.search.expression(
      'folder:HoseaCodes/*' // add your folder
      ).sort_by('created_at','desc').max_results(30).execute().then(result=> {

        res.cookie('cloudinary-cache', result.total_count + "upload", {
          maxAge: 1000 * 60 * 60, // would expire after an hour
          httpOnly: true, // The cookie only accessible by the web server
       })

        cache.set(result.total_count + "upload", {
          status: 'success',
          location: 'cache',
          result: result,
        });

        res.json({
            status: 'success',
            location: 'main',
            result: result,
        });
      });

  } catch (err) {

      logger.error(err);

      return res.status(500).json({ msg: err.message })
  }
}

async function uploadImage(req, res) {
  try {
      logger.info('Upload request received:', { 
        hasFiles: !!req.files, 
        filesKeys: req.files ? Object.keys(req.files) : [],
        body: req.body,
        headers: req.headers['content-type']
      });

      if (!req.files || Object.keys(req.files).length === 0) {
        logger.error('No files in request');
        return res.status(400).json({ msg: "No files were uploaded." });
      }

      const file = req.files.file;
      
      if (!file) {
        logger.error('File field not found in req.files');
        return res.status(400).json({ msg: "File field 'file' not found" });
      }

      logger.info('File details:', { 
        name: file.name, 
        size: file.size, 
        mimetype: file.mimetype 
      });

      // Increase file size limit to 10MB
      if (file.size > 10 * 1024 * 1024) {
          removeTmp(file.tempFilePath)
          return res.status(400).json({ msg: "File size too large (max 10MB)" })
      }

      // Support more image formats
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.mimetype)) {
          removeTmp(file.tempFilePath)
          return res.status(400).json({ msg: "File format not supported. Please upload JPEG, PNG, GIF, WebP, or SVG" })
      }

      res.clearCookie('cloudinary-cache');

      // Use folder from request body or default to 'HoseaCodes'
      const folder = req.body.folder || 'HoseaCodes';
      logger.info('Uploading to Cloudinary:', { folder, fileName: file.name });

      cloudinary.v2.uploader.upload(file.tempFilePath, { folder }, async (err, result) => {
          if (err) {
            logger.error('Cloudinary upload error:', err);
            removeTmp(file.tempFilePath);
            throw err;
          }

          logger.info('Upload successful:', { 
            public_id: result.public_id, 
            url: result.secure_url 
          });

          removeTmp(file.tempFilePath)

          res.json({ 
            result,
            media: {
              _id: result.public_id,
              url: result.secure_url,
              originalName: file.name,
              cloudinaryId: result.public_id,
              format: result.format,
              size: result.bytes
            }
          })
      })

  } catch (err) {
      logger.error('Upload error:', { error: err.message, stack: err.stack });
      return res.status(500).json({ msg: err.message })
  }
}

async function destoryImage(req, res) {
  try {

    const { public_id } = req.body;

    if (!public_id) return res.status(400).json({ msg: 'No images Selected' });

    res.clearCookie('cloudinary-cache');

     await cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
          if (err) throw err;

          res.json({ msg: 'Deleted Image' })
      });

  } catch (err) {
      return res.status(500).json({ msg: err.message })
  }

}


export {
  uploadImage,
  destoryImage,
  getAllUploads
  };
