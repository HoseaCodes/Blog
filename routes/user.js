import express from 'express';
import auth from '../utils/auth.js';
import isAdmin from '../utils/authAdmin.js';
import loginRequired from '../utils/loginRequired.js';
import {
  updateProfile,
  deleteProfile,
  addCart,
  history,
  getAllUsers,
} from '../controllers/user.js';
const router = express.Router();
import {nodecache} from '../utils/cache.js';

router.patch('/addcart', auth, addCart);

router.get('/history', auth, nodecache, history);

// TEMP: no auth middleware — see comment on getAllUsers in controllers/user.js
router.get('/admin/all', getAllUsers);

router.route('/:id')
    .put(loginRequired, updateProfile)
    .delete(loginRequired, deleteProfile)


export default router;
