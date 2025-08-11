import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import './styles/EmployerDashboard.css'// ✅ Import new CSS

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const token = storedUser?.token || null;

        if (!token) {
          console.error("❌ No token found! Please log in again.");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/jobs/employer/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const jobsWithApplicants = await Promise.all(
          response.data.map(async (job) => {
            const appResponse = await axios.get(`http://localhost:3000/api/applications/job/${job._id}`);
            return { ...job, applicantCount: appResponse.data.totalApplications };
          })
        );

        setJobs(jobsWithApplicants);
      } catch (error) {
        console.error("❌ Error fetching jobs:", error.response?.data || error.message);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <Navbar role="employer" />
      <div className="employer-dashboard">
        <h2>Employer Dashboard</h2>
        <p>Manage your job postings and applications.</p>

        <button onClick={() => navigate('/post-job')} className="post-job-btn">
          ➕ Post a Job
        </button>

        <h3>Your Posted Jobs</h3>
        <ul className="jobs-list">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <li key={job._id} className="job-card">
                <strong>{job.title}</strong> at {job.company}
                <br />
                <span>Applicants: {job.applicantCount || 0}</span>
                <br />
                <button onClick={() => navigate(`/candidates`)} className="view-btn">
                  View Candidates
                </button>
              </li>
            ))
          ) : (
            <p>No job postings yet.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default EmployerDashboard;
