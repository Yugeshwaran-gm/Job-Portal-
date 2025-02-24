import express from 'express';
import { applyJob, getApplications, getApplicationById, updateApplication, deleteApplication, getApplicationsForJob } from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', applyJob);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.get('/job/:jobId', getApplicationsForJob);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;
