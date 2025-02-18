import express from 'express';
import { applyJob, getApplications, getApplicationById, updateApplication, deleteApplication } from '../controllers/applicationController.js';
const router = express.Router();

router.post('/', applyJob);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;