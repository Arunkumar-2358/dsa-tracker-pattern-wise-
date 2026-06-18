import { Router } from 'express';
import { getDashboard, getHeatmap } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getDashboard);
router.get('/heatmap', getHeatmap);

export default router;
