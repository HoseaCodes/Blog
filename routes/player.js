import express from 'express';
import auth from '../utils/auth.js';
import {
  getPlayers,
  updatePlayer,
  createPlater,
  deletePlayer,
  getbadges,
  createbadge
} from '../controllers/player.js';
const router = express.Router();

router.route('/new')
    .post(auth, createPlater)

router.route('/:id')
    .get(getPlayers)
    .put(loginRequired, updatePlayer)
    .delete(loginRequired, deletePlayer)

router.route('/:id/badges')
    .get(getbadges)

router.route('/:id/assign_badge')
    .post(auth, createbadge)


export default router;
