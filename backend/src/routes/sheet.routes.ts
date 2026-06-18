import { Router } from 'express';
import {
  getSheets,
  getSheetById,
  createSheet,
  updateSheet,
  deleteSheet,
  addProblemToSheet,
  removeProblemFromSheet,
} from '../controllers/sheet.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getSheets);
router.get('/:id', getSheetById);
router.post('/', createSheet);
router.patch('/:id', updateSheet);
router.delete('/:id', deleteSheet);
router.post('/:id/problems', addProblemToSheet);
router.delete('/:id/problems/:problemId', removeProblemFromSheet);

export default router;
