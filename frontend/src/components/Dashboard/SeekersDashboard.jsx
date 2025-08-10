import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import { AuthContext } from "../../context/authContext";
import './styles/SeekersDashboard.css';

const SeekersDashboard = () => {
  const { user } = useContext(AuthContext);
  const [jobsCount, setJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      // Fetch available jobs count
      axios.get("http://localhost:3000/api/jobs/get")
        .then(res => setJobsCount(res.data.length))
        .catch(err => console.error("Error fetching jobs:", err));

      // Fetch applied jobs count
      axios.get(`http://localhost:3000/api/applications/user/${user.id}`)
        .then(res => setApplicationsCount(res.data.length))
        .catch(err => console.error("Error fetching applications:", err));
    }
  }, [user]);

  return (
    <div className="seeker-dashboard">
      <Navbar role="seeker" />
      <div className="dashboard-header">
        <h2>Welcome, {user?.name || "Job Seeker"}!</h2>
        <p>Quick overview of your activity</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card jobs">
          <h3>{jobsCount}</h3>
          <p>Jobs Available</p>
        </div>
        <div className="stat-card applied">
          <h3>{applicationsCount}</h3>
          <p>Jobs Applied</p>
        </div>
        <div className="stat-card messages">
          <h3>Messages</h3>
          <button>View</button>
        </div>
      </div>
    </div>
  );
};

export default SeekersDashboard;
