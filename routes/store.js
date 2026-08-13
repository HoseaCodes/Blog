import express from 'express';
import auth from '../utils/auth.js';
import {
  listStoreItems,
  redeemItem,
  listMyRedemptions,
  getRedemptionDownload,
} from '../controllers/store.js';

const router = express.Router();

// Public — catalog browsable without login.
router.get('/store/items', listStoreItems);

router.use(auth);

router.post('/store/redeem', redeemItem);
router.get('/store/my-redemptions', listMyRedemptions);
router.get('/store/download/:productId', getRedemptionDownload);

export default router;
