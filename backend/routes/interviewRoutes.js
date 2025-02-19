import express from 'express';
import { scheduleInterview, getInterviews, getInterviewById, updateInterview, deleteInterview } from '../controllers/interviewControllers.js';
const router = express.Router();

router.post('/', scheduleInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
