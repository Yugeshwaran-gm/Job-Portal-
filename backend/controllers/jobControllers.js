import Job from '../models/Job.js';
import mongoose from 'mongoose';
export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createJobPost = async (req, res) => {
  try {
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Unauthorized: Only employers can post jobs' });
    }

    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const getEmployerJobs = async (req, res) => {
  try {
      const employerId = req.user._id;  // ✅ Get employer's ID from `req.user`

      // ✅ Ensure employerId is valid
      if (!mongoose.Types.ObjectId.isValid(employerId)) {
          return res.status(400).json({ message: 'Invalid employer ID' });
      }

      const jobs = await Job.find({ postedBy: employerId }); // ✅ Fix filtering by postedBy

      res.json(jobs);
  } catch (error) {
      console.error('Error fetching employer jobs:', error);
      res.status(500).json({ message: 'Server error fetching jobs' });
  }
};
