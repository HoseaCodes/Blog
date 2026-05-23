import express from 'express';
import {
  getCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategoryByID,
} from '../controllers/category.js';
import auth from "../utils/auth.js";
import isAdmin from "../utils/authAdmin.js";

const router = express.Router();

router.route('/category')
  .get(getCategory)
  .post(auth, isAdmin, createCategory)

router
  .route("/category/:id")
  .get(getCategoryByID)
  .delete(auth, isAdmin, deleteCategory)
  .put(auth, isAdmin, updateCategory);

export default router;
