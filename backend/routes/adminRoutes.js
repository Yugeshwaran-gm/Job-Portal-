import express from 'express';
import { getUsers, deleteUser, updateUserRole } from '../controllers/adminController.js';
const router = express.Router();

router.get('/users', getUsers);
router.put('/users/:id', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;