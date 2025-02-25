import Application from '../models/Application.js';
import Job from '../models/Job.js';

export const applyJob = async (req, res) => {
  try {
    const { jobId, userId } = req.body;
    console.log("Received apply request:", req.body); // ✅ Log request data

    if (!jobId || !userId) {
      return res.status(400).json({ message: "Missing jobId or userId" });
    }
    // ✅ Check if the user has already applied for this job
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    const application = new Application(req.body);
    await application.save();

    // ✅ Increase application count for the job
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } }, { new: true });

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find().populate('jobId', 'title company').populate('userId', 'name email');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('jobId', 'title company').populate('userId', 'name email');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get applications for a specific job (For Employer Dashboard)
export const getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('userId', 'name email')
      .populate('jobId', 'title company description location salary');

    // Count total applications for the job
    const totalApplications = applications.length;

    res.status(200).json({ totalApplications, applications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get applications for a specific seeker (For Seekers Dashboard)
export const getApplicationsForUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
  }

  try {
      console.log("Fetching applications for user:", userId);  // ✅ Debugging
      const applications = await Application.find({ userId });

      if (applications.length === 0) {
          console.warn("No applications found for user:", userId);
      }

      res.json(applications);
  } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Server error fetching applications" });
  }
};


export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get applications for a specific user (For Seekers Dashboard)
export const getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    const applications = await Application.find({ userId }).populate("jobId");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applications" });
  }
};

// Get applicants for a specific job (For Employer Dashboard)
export const getApplicantsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const applicants = await Application.find({ jobId }).populate("userId");
    res.status(200).json(applicants);
  } catch (error) {
    res.status(500).json({ message: "Error fetching applicants" });
  }
};
