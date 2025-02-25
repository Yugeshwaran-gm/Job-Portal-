import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Common/Navbar';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user")); // 🔍 Parse stored user data
        const token = storedUser?.token || null; // Extract token safely
    
        console.log("🔍 Token in localStorage:", token); // ✅ Debugging log
    
        if (!token) {
          console.error("❌ No token found! Please log in again.");
          navigate("/login"); // Redirect to login
          return;
        }
    
        const response = await axios.get("http://localhost:3000/api/jobs/employer/jobs", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Correct Authorization header
        });
    
        console.log("✅ Jobs response:", response.data);
    
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
      <div style={styles.container}>
        <h2>Employer Dashboard</h2>
        <p>Manage your job postings and applications.</p>

        <button onClick={() => navigate('/post-job')} style={styles.postJobButton}>
          ➕ Post a Job
        </button>

        <h3>Your Posted Jobs</h3>
        <ul>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <li key={job._id} style={styles.jobItem}>
                <strong>{job.title}</strong> at {job.company} <br />
                <span>Applicants: {job.applicantCount || 0}</span>
                <br />
                <button onClick={() => navigate(`/candidates/${job._id}`)}>View Candidates</button>
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

const styles = {
  container: { textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' },
  postJobButton: { backgroundColor: 'blue', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer', marginBottom: '10px' },
  jobItem: { listStyle: 'none', marginBottom: '10px' },
};

export default EmployerDashboard;
