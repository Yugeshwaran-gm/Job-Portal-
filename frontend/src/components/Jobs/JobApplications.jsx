import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../Common/Navbar';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

const JobApplications = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);  // Store full job details
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("🔄 Fetching applications for user:", user.id);
        const response = await axios.get(`http://localhost:3000/api/applications/user/${user.id}`);
        
        console.log("Applications response:", response.data);
        
        if (!response.data || response.data.length === 0) {
          console.warn("⚠️ No applications found for user.");
        }
        
        setApplications(response.data); // Store full application details
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    const fetchJobs = async () => {
      try {
        console.log("🔄 Fetching all jobs...");
        const response = await axios.get("http://localhost:3000/api/jobs"); // Adjust API route if necessary
        console.log("Jobs response:", response.data);
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    if (user) {
      fetchApplications();
      fetchJobs();
    }
  }, [user]);

  return (
    <div>
      <Navbar role="seeker" />
      <div>Job Applications</div>
      {applications.length > 0 ? (
        applications.map((app) => {
          console.log("Checking job application:", app);

          const job = jobs.find((j) => j._id === app.jobId?._id);
          if (!job) console.warn("⚠️ Job not found for ID:", app.jobId?._id);

          return job ? (
            <div key={job._id} className="appliedJobCard">
              <h3>{job.title}</h3>
              <p><strong>Company:</strong> {job.company}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Posted by:</strong> {job.employer?.name || "Unknown"}</p>
            </div>
          ) : null;
        })
      ) : (
        <p>You have not applied for any jobs yet.</p>
      )}
    </div>
  );
};

export default JobApplications;
