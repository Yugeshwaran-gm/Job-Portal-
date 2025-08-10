import express from 'express';
import { loginUser, registerUser, getUsers, getUserById, updateUser, deleteUser, getUserProfile } from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUsers);

// ✅ Put profile route before :id
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUser); 

router.get('/:id', getUserById);
router.delete('/:id', deleteUser);


export default router;
