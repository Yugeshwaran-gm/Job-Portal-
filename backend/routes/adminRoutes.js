import express from 'express';
import {
  getUsers,
  deleteUser,
  updateUserRole,
  getJobs,
  deleteJob
} from '../controllers/adminControllers.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// =======================
// USER MANAGEMENT
// =======================
router.get('/users', protect, authorizeRoles('admin'), getUsers);
router.put('/users/:id', protect, authorizeRoles('admin'), updateUserRole);
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUser);

// =======================
// JOB MANAGEMENT
// =======================
router.get('/jobs', protect, authorizeRoles('admin'), getJobs);
router.delete('/jobs/:id', protect, authorizeRoles('admin'), deleteJob);

export default router;
