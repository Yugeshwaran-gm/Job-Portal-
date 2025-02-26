import express from 'express';
import { loginUser, registerUser, getUsers, getUserById, updateUser, deleteUser, getUserProfile } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/profile', protect, updateUser); // ✅ Only logged-in user can update their profile
router.delete('/:id', deleteUser);
router.get('/profile', protect, getUserProfile);


export default router;
