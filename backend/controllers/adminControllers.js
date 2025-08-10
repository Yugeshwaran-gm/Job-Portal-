import User from '../models/user.js';
import Job from '../models/job.js'; // ✅ Import Job model

// =======================
// USER MANAGEMENT
// =======================

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user role or details
export const updateUserRole = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a user and their jobs
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ Delete all jobs posted by this user
    await Job.deleteMany({ postedBy: userId });

    // ✅ Delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ message: 'User and their jobs deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =======================
// JOB MANAGEMENT
// =======================

// Get all jobs (with user info)
// Get all jobs (with user info) — sorted by recent first
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 }); // ✅ Newest first

    // ✅ Filter out jobs posted by admins
    const nonAdminJobs = jobs.filter((job) => job.postedBy?.role !== "admin");

    res.status(200).json(nonAdminJobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a single job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
