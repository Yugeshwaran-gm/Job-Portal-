const ApplicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resume: { type: String, required: true },
    status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now }
  });
  
  export default mongoose.model('Application', ApplicationSchema);