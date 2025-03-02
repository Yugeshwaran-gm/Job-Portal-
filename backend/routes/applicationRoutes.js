import express from 'express';
import { applyJob, getApplications, getApplicationById,getEmployerJobsWithCandidates, updateApplication, deleteApplication, getApplicationsForJob,getApplicationsForUser, updateApplicationStatus  } from '../controllers/applicationController.js';

const router = express.Router();

router.post('/', applyJob);
router.get('/', getApplications);
router.get('/user/:userId', getApplicationsForUser); 
router.get('/job/:jobId', getApplicationsForJob);
router.get('/:id', getApplicationById);
router.put('/:id', updateApplication);
router.get('/employer/jobs', getEmployerJobsWithCandidates);
router.delete('/:id', deleteApplication);
router.put("/update-status/:id", updateApplicationStatus);


export default router;
