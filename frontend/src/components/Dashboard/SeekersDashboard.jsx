import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Common/Navbar';

const SeekersDashboard = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // ✅ Fetch job listings
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/jobs/get');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      <Navbar role="seeker" /> {/* ✅ Navbar visible only for seekers */}
      <div style={styles.container}>
        <h2>Welcome, Job Seeker!</h2>
        <p>Browse and apply for jobs that match your skills.</p>

        <h3>Available Jobs</h3>
        <ul>
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <li key={job._id} style={styles.jobItem}>
                <strong>{job.title}</strong> at {job.company} <br />
                <button onClick={() => alert(`Applied for ${job.title}`)}>Apply</button>
              </li>
            ))
          ) : (
            <p>No job listings available.</p>
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

export default SeekersDashboard;
