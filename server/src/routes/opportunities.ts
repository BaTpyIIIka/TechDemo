import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getAllOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  addComment,
  addReminder,
} from '../controllers/opportunityController';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllOpportunities);
router.get('/:id', getOpportunity);
router.post('/', createOpportunity);
router.put('/:id', updateOpportunity);
router.delete('/:id', deleteOpportunity);
router.post('/:id/comments', addComment);
router.post('/:id/reminders', addReminder);

export default router;
