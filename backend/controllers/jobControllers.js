import Job from '../models/job.js';

// 🔹 Create a Job
export const createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Get All Jobs
export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      // .populate("postedBy", "name email")
      //  // Fetch user name & email
      .populate("postedBy", "name email")
      .select("title company location salary description createdAt postedBy"); // Ensure all required fields are included
      console.log("🔍 Jobs Fetched from DB:", jobs)
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 🔹 Get Job by ID
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Update Job
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Delete Job
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 🔹 Employer Posts a Job
export const createJobPost = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user.id // ✅ Use `_id` instead of `id`
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 🔹 Get Jobs Posted by an Employer
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }); // ✅ Directly use `_id`
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error fetching jobs' });
  }
};
