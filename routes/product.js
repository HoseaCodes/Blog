import express from 'express';
import {
  getProducts,
  createProducts,
  deleteProducts,
  updateProducts,
} from '../controllers/product.js';
import {nodecache} from '../utils/cache.js';

const router = express.Router();

router.route('/products')
    .get(nodecache, getProducts)
    .post(createProducts)

router.route('/products/:id')
    .delete(deleteProducts)
    .put(updateProducts)

export default router;
