import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../Common/Navbar';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
const JobApplications = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/applications/user/${user.id}`);
      setApplications(response.data.map(app => app.jobId._id)); // Store applied job IDs
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  fetchApplications();
}, [user]);
  return (
    <div>
        <Navbar role="seeker" /> {/* Include the Navbar component */}
        <div>JobApplications</div>
        {applications.length > 0 ? (
          applications.map((jobId) => {
            const job = jobs.find((j) => j._id === jobId);
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
  )
}

export default JobApplications