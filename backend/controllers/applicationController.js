import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

// Apply for a job
export const applyJob = async (req, res) => {
  try {
    let { jobId, userId } = req.body;
    console.log("Received apply request:", req.body); // ✅ Log request data

    if (!jobId || !userId) {
      return res.status(400).json({ message: "Missing jobId or userId" });
    }

    jobId = new mongoose.Types.ObjectId(jobId);
    userId = new mongoose.Types.ObjectId(userId);

    // ✅ Check if the user has already applied for this job
    const existingApplication = await Application.findOne({ jobId, userId });
    if (existingApplication) {
      console.log("User already applied for this job:", jobId);
      return res.status(400).json({ message: "You have already applied for this job." });
    }

    const application = new Application(req.body);
    await application.save();
    console.log("New application saved:", application); // ✅ Log the saved application

    // ✅ Increase application count for the job
    const updatedJob = await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } }, { new: true });
    console.log("Updated job application count:", updatedJob?.applicationCount); // ✅ Log updated count

    res.status(201).json(application);
  } catch (error) {
    console.error("Error applying for job:", error); // ✅ Log error
    res.status(400).json({ error: error.message });
  }
};

// Get all applications
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title company")
      .populate("userId", "name email");

    console.log("✅ Applications fetched:", applications.length);
    applications.forEach(app => console.log("📌 Job ID:", app.jobId));

    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get application by ID
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId", "title company")
      .populate("userId", "name email");

    if (!application) return res.status(404).json({ message: "Application not found" });

    res.status(200).json(application);
  } catch (error) {
    console.error("❌ Error fetching application by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get applications for a specific job (For Employer Dashboard)
export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    console.log("🔄 Fetching applications for job:", jobId);

    const applications = await Application.find({ jobId })
      .populate("userId", "name email") // ✅ Get user details
      .populate("jobId", "title company description location salary");

    applications.forEach(app => {
      if (!app.jobId) {
        console.warn(`⚠️ Job not found for Application ID: ${app._id}`);
      } else {
        console.log("📌 Checking Job ID:", app.jobId);
      }
    });

    console.log("✅ Applications fetched:", applications.length);
    res.status(200).json({ totalApplications: applications.length, applications });
  } catch (error) {
    console.error("❌ Error fetching applicants:", error);
    res.status(500).json({ message: "Error fetching applicants" });
  }
};

// Get applications for a specific seeker (For Seekers Dashboard)
// Get applications for a specific seeker (For Seekers Dashboard)
export const getApplicationsForUser = async (req, res) => {
  const { userId } = req.params;
  console.log("🔄 Fetching applications for user:", userId);

  try {
    const applications = await Application.find({ userId })
      .populate({ path: "jobId", select: "title company location salary employer" });

    if (!applications.length) {
      console.warn("⚠️ No applications found for user:", userId);
    } else {
      applications.forEach(app => {
        if (!app.jobId) {
          console.warn(`⚠️ Job not found for Application ID: ${app._id}`);
        } else {
          console.log("📌 Found Job ID:", app.jobId._id, "Title:", app.jobId.title);
        }
      });
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error fetching applications:", error);
    res.status(500).json({ error: "Server error fetching applications" });
  }
};



// Update application
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!application) return res.status(404).json({ message: "Application not found" });

    res.status(200).json(application);
  } catch (error) {
    console.error("❌ Error updating application:", error);
    res.status(400).json({ error: error.message });
  }
};

// Delete application
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting application:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get applications for a specific user (For Seekers Dashboard)
export const getUserApplications = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("🔄 Fetching applications for user:", userId);

    const applications = await Application.find({ userId }).populate("jobId");

    if (applications.length === 0) {
      console.warn(`⚠️ No applications found for user: ${userId}`);
    }

    res.status(200).json(applications);
  } catch (error) {
    console.error("❌ Error fetching user applications:", error);
    res.status(500).json({ message: "Error fetching applications" });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // "Accepted" or "Rejected"
    const { id } = req.params;

    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { applicationStatus: status },
      { new: true }
    ).populate("userId", "name email");

    if (!updatedApplication) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: `Application ${status} successfully`, application: updatedApplication });
  } catch (error) {
    console.error("❌ Error updating application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};