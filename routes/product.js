import express from 'express';
import {
  getProducts,
  createProducts,
  deleteProducts,
  updateProducts,
} from '../controllers/product.js';
const router = express.Router();

router.route('/products')
    .get(getProducts)
    .post(createProducts)

router.route('/products/:id')
    .delete(deleteProducts)
    .put(updateProducts)

export default router;
