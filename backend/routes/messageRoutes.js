import express from 'express';
import { sendMessage, getMessages, getMessageById, deleteMessage } from '../controllers/messageController.js';
const router = express.Router();

router.post('/', sendMessage);
router.get('/', getMessages);
router.get('/:id', getMessageById);
router.delete('/:id', deleteMessage);

export default router;