import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

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
app.use(express.json());
app.use(cors());
app.use(errorHandler);

const createAdminUser = async () => {
  const adminExists = await User.findOne({ email: 'admin@workhunt.com' });

  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@workhunt.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await createAdminUser(); // Auto-create admin user if missing
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

