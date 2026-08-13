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
  register,
  setUserStatus,
} from '../controllers/user.js';
const router = express.Router();
import {nodecache} from '../utils/cache.js';

// Public — mirrors Storm-Gate registration into the blog DB with status PENDING.
router.post('/register', register);

router.patch('/addcart', auth, addCart);

router.get('/history', auth, nodecache, history);

// TEMP: no auth middleware — see comment on getAllUsers in controllers/user.js
router.get('/admin/all', getAllUsers);

router.patch('/:id/status', auth, isAdmin, setUserStatus);

router.route('/:id')
    .put(loginRequired, updateProfile)
    .delete(loginRequired, deleteProfile)


export default router;
