import { Router } from 'express';
import {
  getUserProblem,
  updateStatus,
  trackClick,
  getAllUserProblems,
} from '../controllers/userProblem.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getAllUserProblems);
router.get('/:problemId', getUserProblem);
router.patch('/:problemId/status', updateStatus);
router.post('/:problemId/click', trackClick);

export default router;
