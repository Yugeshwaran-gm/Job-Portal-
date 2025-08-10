import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Navigation for login redirection
import Navbar from "../Common/Navbar";
import "./styles/AppliedCandidates.css";

const AppliedCandidates = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  
  // ✅ Fetch jobs posted by the employer
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = storedUser?.token || null;
        console.log("🔍 Token in localStorage:", token);

        if (!token) {
          console.error("❌ No token found! Please log in again.");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/jobs/employer/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ Jobs with applicants:", response.data);
        const jobsWithApplicants = await Promise.all(
          response.data.map(async (job) => {
            const appResponse = await axios.get(`http://localhost:3000/api/applications/job/${job._id}`);
            return { 
              ...job, 
              applicantCount: appResponse.data.totalApplications, 
              applicants: appResponse.data.applications // ✅ Store applicants in state
            };
          })
        );
    
        setJobs(jobsWithApplicants);
      } catch (error) {
        console.error("❌ Error fetching jobs:", error.response?.data || error.message);
      }
    };

    fetchJobs();
  }, []); // ✅ Runs once when the component mounts

  // ✅ Update application status (Accept/Reject)
  const updateApplicationStatus = async (applicationId, status) => {
    console.log("🔍 Sending API Request with:");
    console.log("Application ID:", applicationId); // Check if this is undefined
    console.log("Status:", status);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token || null;

      await axios.put(
        `http://localhost:3000/api/applications/update-status/${applicationId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(`✅ Application ${status}`);

      // ✅ Refresh jobs list after updating
      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          applicants: job.applicants.map((applicant) =>
            applicant.applicationId === applicationId
              ? { ...applicant, status }
              : applicant
          ),
        }))
      );
    } catch (error) {
      console.error(`❌ Error updating application status:`, error);
    }
  };

  // ✅ Remove an application
  const removeApplication = async (applicationId) => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const token = storedUser?.token || null;

      await axios.delete(`http://localhost:3000/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Application removed");

      // ✅ Remove the application from state
      setJobs((prevJobs) =>
        prevJobs.map((job) => ({
          ...job,
          applicants: job.applicants.filter((applicant) => applicant.applicationId !== applicationId),
        }))
      );
    } catch (error) {
      console.error("❌ Error removing application:", error);
    }
  };

  return (
    <div>
      <Navbar role="employer" />
      <h2>Posted Jobs</h2>
      {jobs.length === 0 ? <p>No jobs found.</p> : null}
      
      {jobs.map((job) => (
        <div key={job._id} className="job-card">
          <h3>{job.title}</h3>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
          <p><strong>Applicants:</strong> {job.applicantCount}</p>

          {job.applicants && job.applicants.length > 0 ? (
            <ul>
              {job.applicants.map((applicant) => {
                console.log("Jobs with applicants:", job.applicants);
                console.log("Applicant Data:", applicant); // Debugging log
                // console.log("Applicant ID:", applicant._id); // Debugging
                console.log("Applicant ID:", applicant.applicationId); // Debugging

                return (
                  <li key={applicant.applicationId || applicant._id} className="applicant-card">
                    <p><strong>Name:</strong> {applicant.name}</p>
                    <p><strong>Email:</strong> {applicant.email}</p>
                    <p><strong>Status:</strong> {applicant.status || "Pending"}</p> {/* ✅ Status Added */}
                    <p><strong>Applied At:</strong> {applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString() : "N/A"}</p>

                    <button onClick={() => updateApplicationStatus(applicant.applicationId, "Approved")} className="accept-btn">
                      Approve
                    </button>
                    <button onClick={() => updateApplicationStatus(applicant.applicationId, "Rejected")} className="reject-btn">
                      Reject
                    </button>
                    <button onClick={() => removeApplication(applicant.applicationId)} className="remove-btn">
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No applicants yet.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default AppliedCandidates;
