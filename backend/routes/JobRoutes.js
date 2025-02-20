import express from 'express';
import { 
    createJob, 
    getJobs, 
    getJobById, 
    updateJob, 
    deleteJob, 
    createJobPost 
} from '../controllers/jobControllers.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🔹 Job Management Routes
router.post('/', createJob);
router.get('/get', getJobs);
router.get('/:id', getJobById);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);

// 🔹 Job Posting Route (For Employers)
router.post('/post-job', protect, authorizeRoles('employer'), createJobPost);

export default router;
