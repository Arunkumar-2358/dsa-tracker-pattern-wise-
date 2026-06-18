import { Router } from 'express';
import {
  getRoadmaps,
  getRoadmapById,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  addNode,
  deleteNode,
} from '../controllers/roadmap.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getRoadmaps);
router.get('/:id', getRoadmapById);
router.post('/', createRoadmap);
router.patch('/:id', updateRoadmap);
router.delete('/:id', deleteRoadmap);
router.post('/:id/nodes', addNode);
router.delete('/:id/nodes/:nodeId', deleteNode);

export default router;
