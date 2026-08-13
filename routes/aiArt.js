import express from 'express';
import auth from '../utils/auth.js';
import {
  generatePreview,
  getDownloadUrl,
  listMyPurchases,
  getPaypalConfig,
  createOrderForArt,
  captureOrderForArt,
  purchaseWithPoints,
} from '../controllers/aiArt.js';

const router = express.Router();

router.get('/ai-art/paypal-config', getPaypalConfig);

router.use(auth);

router.post('/ai-art/preview', generatePreview);
router.get('/ai-art/download/:productId', getDownloadUrl);
router.get('/ai-art/my-purchases', listMyPurchases);
router.post('/ai-art/orders', createOrderForArt);
router.post('/ai-art/orders/capture', captureOrderForArt);
router.post('/ai-art/purchase-with-points', purchaseWithPoints);

export default router;
