import express from 'express';
import auth from '../utils/auth.js';
import authAdmin from '../utils/authAdmin.js';
import {
  getPayments,
  createPayment,
} from '../controllers/payment.js';
import {nodecache} from '../utils/cache.js';

const router = express.Router();

router.route('/payment')
    .post(auth, createPayment)

router.route('/payment/:id')
    .get(authAdmin, nodecache, getPayments)


export default router;
