import express from 'express';
import auth from '../utils/auth.js';
import loginRequired from '../utils/loginRequired.js';
import {
  register,
  refreshToken,
  login,
  getUser,
  updateProfile,
  deleteProfile,
  getAllUsers
} from '../controllers/user.js';
const router = express.Router();

router.route('/')
    .get(loginRequired, getAllUsers)

router.route('/:id')
    .put(loginRequired, updateProfile)
    .delete(loginRequired, deleteProfile)

router.post('/register', register);

router.post('/login', login);

router.get('/refresh_token', refreshToken);

router.get('/info', auth, getUser);





export default router;
