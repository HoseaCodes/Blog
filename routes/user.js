import express from 'express';
import {
  register,
  refreshToken,
  login,
} from '../controllers/user.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/refresh_token', refreshToken);

export default router;
