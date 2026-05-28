import express from 'express';
import auth from '../utils/auth.js';
import { synthesizeSpeech, getTTSQuota, getTTSCosts } from '../controllers/tts.js';

const router = express.Router();

router.post('/tts/synthesize', auth, synthesizeSpeech);
router.get('/tts/quota', auth, getTTSQuota);
router.get('/tts/admin/costs', auth, getTTSCosts);

export default router;
