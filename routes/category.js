import express from 'express';
import {
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryByID,
} from '../controllers/category.js';

const router = express.Router();

router.route('/category')
  .get(getCategory)
  .post(createCategory)

router.route('/category/:id')
  .get(getCategoryByID)
  .delete(deleteCategory)
  .put(updateCategory)

export default router;
