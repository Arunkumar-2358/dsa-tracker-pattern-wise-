import { Router } from 'express';
import { getMe, logout, firebaseAuth } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/firebase', firebaseAuth);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

export default router;
