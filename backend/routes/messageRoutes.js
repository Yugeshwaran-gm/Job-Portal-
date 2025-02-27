import express from 'express';
import { sendMessage, getMessages, getMessageById, deleteMessage, updateMessageStatus } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', sendMessage);
router.get('/:senderId/:receiverId', getMessages);
router.get('/:id', getMessageById);
router.put('/status', updateMessageStatus);
router.delete('/:id', deleteMessage);

export default router;
