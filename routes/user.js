import express from 'express';
import auth from '../utils/auth.js';
import isAdmin from '../utils/authAdmin.js';
import loginRequired from '../utils/loginRequired.js';
import {
  register,
  refreshToken,
  login,
  logout,
  getUser,
  updateProfile,
  deleteProfile,
  getAllUsers,
  addCart,
  history
} from '../controllers/user.js';
const router = express.Router();


router.post('/register', register);

router.post('/login', login);

router.post('/logout', logout);

router.get('/refresh_token', refreshToken);

router.get('/info', auth, getUser);

router.patch('/addcart', auth, addCart);

router.get('/history', auth, history);

router.route('/:id')
    .get(isAdmin, getAllUsers)
    .put(loginRequired, updateProfile)
    .delete(loginRequired, deleteProfile)


export default router;
