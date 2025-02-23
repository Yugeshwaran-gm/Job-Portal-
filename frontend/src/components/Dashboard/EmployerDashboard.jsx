import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Common/Navbar';

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');

  useEffect(() => {
    // ✅ Fetch employer's job postings
    const fetchEmployerJobs = async () => {
      try {
        const token = localStorage.getItem('token'); // ✅ Include authentication token
        const response = await axios.get('http://localhost:3000/api/jobs/employer/jobs', {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    

    fetchEmployerJobs();
  }, []);

  const postJob = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/jobs', { title, company });
      setJobs([...jobs, response.data]);
      setTitle('');
      setCompany('');
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  return (
    <div>
      <Navbar role="employer" /> {/* ✅ Navbar visible only for employers */}
    <div style={styles.container}>
      <h2>Employer Dashboard</h2>
      <p>Manage your job postings and applications.</p>

      <h3>Post a New Job</h3>
      <input type="text" placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
      <button onClick={postJob}>Post Job</button>

      <h3>Your Posted Jobs</h3>
      <ul>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <li key={job._id} style={styles.jobItem}>
              <strong>{job.title}</strong> at {job.company} <br />
              <button onClick={() => alert('Job deleted')}>Delete</button>
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
  jobItem: { listStyle: 'none', marginBottom: '10px' },
};

export default EmployerDashboard;
