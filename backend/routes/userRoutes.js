import express from 'express';
import { loginUser, registerUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userControllers.js';

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser); // ✅ Login Route
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
