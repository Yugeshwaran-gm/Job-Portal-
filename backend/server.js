import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorMiddleware.js';
import User from './models/user.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }, // Adjust based on frontend URL
});

app.use(express.json());
app.use(cors());
app.use(errorHandler);

// Ensure admin user is created at startup
const createAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ email: 'admin@workhunt.com' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('Admin@123', 10);
      await User.create({
        name: 'Admin',
        email: 'admin@workhunt.com',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created successfully!');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await createAdminUser();
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

// 🔹 Socket.io for Real-Time Messaging
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);

  // Handle sending messages
  socket.on('sendMessage', async (message) => {
    try {
      // Save message in DB with status 'sent'
      const newMessage = await Message.create({ ...message, status: 'sent' });
      io.emit('receiveMessage', newMessage); // Broadcast to all users
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  // 🔹 Handle Message Status Updates
  socket.on('updateStatus', async ({ messageId, status }) => {
    try {
      await Message.findByIdAndUpdate(messageId, { status }, { new: true });
      io.emit('statusUpdated', { messageId, status }); // Notify all clients
    } catch (error) {
      console.error('Error updating message status:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
