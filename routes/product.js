import express from 'express';
import {
  getProducts,
  createProducts,
  deleteProducts,
  updateProducts,
} from '../controllers/product.js';
import {nodecache} from '../utils/cache.js';
import auth from "../utils/auth.js";
import isAdmin from "../utils/authAdmin.js";

const router = express.Router();

router.route('/products')
    .get(nodecache, getProducts)
    .post(auth, isAdmin, createProducts)

router
  .route("/products/:id")
  .delete(auth, isAdmin, deleteProducts)
  .put(auth, isAdmin, updateProducts);

export default router;
