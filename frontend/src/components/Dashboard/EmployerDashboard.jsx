import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Common/Navbar';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState({}); // Store applicant count per job
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/jobs/employer/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchApplicantsCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/applications/employer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplicants(response.data);
      } catch (error) {
        console.error("Error fetching applicants count:", error);
      }
    };

    fetchEmployerJobs();
    fetchApplicantsCount();
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
                <span>Applicants: {applicants[job._id] || 0}</span>
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
