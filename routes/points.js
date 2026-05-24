import express from 'express';
import auth from '../utils/auth.js';
import {
  getBalance,
  syncOfflinePoints,
  spendPoints,
  creditEarnedPoints,
  getPackOptions,
  createPointPackOrder,
  capturePointPackOrder,
  getMyTransactions,
} from '../controllers/points.js';

const router = express.Router();

// Public — pack catalog visible without auth so the buy-points UI can render
// before login (CTA: "log in to purchase").
router.get('/points/packs', getPackOptions);

router.use(auth);

router.get('/points/balance', getBalance);
router.get('/points/transactions', getMyTransactions);
router.post('/points/sync', syncOfflinePoints);
router.post('/points/spend', spendPoints);
router.post('/points/earn', creditEarnedPoints);
router.post('/points/packs/orders', createPointPackOrder);
router.post('/points/packs/orders/capture', capturePointPackOrder);

export default router;
