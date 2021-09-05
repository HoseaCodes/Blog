import express from 'express';
import auth from '../utils/auth.js';
import {
  register,
  refreshToken,
  login,
  getUser,
  updateProfile
} from '../controllers/user.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/refresh_token', refreshToken);

router.get('/info', auth, getUser);

router.post('/update', auth, updateProfile);

export default router;
