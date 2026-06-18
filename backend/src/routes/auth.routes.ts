import { Router } from 'express';
import { getMe, logout, requestOtp, verifyOtp } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);
router.get('/me', authenticate, getMe);
router.post('/logout', logout);

export default router;
