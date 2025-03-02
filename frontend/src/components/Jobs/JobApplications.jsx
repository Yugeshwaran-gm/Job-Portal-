import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../Common/Navbar';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import './styles/JobApplication.css';

const JobApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("🔄 Fetching applications for user:", user.id);
        const response = await axios.get(`http://localhost:3000/api/applications/user/${user.id}`);
        
        if (!response.data || response.data.length === 0) {
          console.warn("⚠️ No applications found for user.");
        }

        setApplications(response.data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  return (
    <div>
      <Navbar role="seeker" />
      <br/>
    <div className='jobContainer1'>
      <div >Job Applications</div>
      <center>
      <h3>Applied Jobs</h3>
      </center>
      {applications.length > 0 ? (
        applications.map((app) => (
          app.jobId ? (
            console.log("jobid:", app.jobId),
            <div key={app.jobId._id} className="appliedJobCard">
              <h3>{app.jobId.title}</h3>
              <p><strong>Company:</strong> {app.jobId.company}</p>
              <p><strong>Location:</strong> {app.jobId.location}</p>
              <p><strong>Salary:</strong> {app.jobId.salary}</p>
              <p><strong>Posted by:</strong> {app.jobId.name?.name || "Admin"}</p>
              <p><strong>Status:</strong> 
              <span className={`status-badge ${app.status.toLowerCase()}`}>
                    {app.status}
                  </span>
              </p>
            </div>
          ) : (
            <p key={app._id} className="error">⚠️ Job not found for this application.</p>
          )
        ))
      ) : (
        <p>You have not applied for any jobs yet.</p>
      )}
    </div>
    </div>
  );
};

export default JobApplications;
