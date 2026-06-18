import { Router } from 'express';
import {
  getProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem,
  getTopics,
  getCompanies,
} from '../controllers/problem.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticate, getProblems);
router.get('/topics', authenticate, getTopics);
router.get('/companies', authenticate, getCompanies);
router.get('/:id', authenticate, getProblemById);
router.post('/', authenticate, createProblem);
router.patch('/:id', authenticate, updateProblem);
router.delete('/:id', authenticate, deleteProblem);

export default router;
