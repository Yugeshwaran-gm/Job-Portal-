import mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
});

export default mongoose.model('Auth', authSchema);
