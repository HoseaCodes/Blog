import express from 'express';
import {
  uploadImage,
  destoryImage,
  getAllUploads
} from '../controllers/upload.js';
import {nodecache} from '../utils/cache.js';
import auth from "../utils/auth.js";

const router = express.Router();

//image upload
router.post("/allImages", nodecache, getAllUploads);

//image upload
router.post("/upload", auth, uploadImage);

//image delete
router.post("/destory", auth, destoryImage);

export default router;
