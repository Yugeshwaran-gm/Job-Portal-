import express from 'express';
import { createJob, getJobs, getJobById, updateJob, deleteJob } from '../controllers/jobController.js';
const router = express.Router();

router.post('/', createJob);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

export default router;