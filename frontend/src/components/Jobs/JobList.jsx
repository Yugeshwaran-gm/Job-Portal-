import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import { AuthContext } from "../../context/authContext";
import './styles/JobList.css';

const JobList = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hoveredJobId, setHoveredJobId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/jobs/get");
        console.log("✅ Jobs fetched:", response.data);
        setJobs(response.data);
      } catch (error) {
        console.error("❌ Error fetching jobs:", error.response?.data || error.message);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    if (!user || !user.id) {
      alert("Please log in to apply for jobs.");
      return;
    }

    if (applications.includes(jobId)) {
      alert("You have already applied for this job.");
      return;
    }

    const applicationData = {
      jobId,
      userId: user.id,
    };

    try {
      await axios.post("http://localhost:3000/api/applications", applicationData);
      alert("Successfully applied for the job!");
      setApplications([...applications, jobId]);
    } catch (error) {
      console.error("Application error:", error.response?.data);
      alert(error.response?.data?.message || "Error applying for the job.");
    }
  };

  return (
    <div className='jobListContainer'>
      <Navbar role="seeker" /> {/* Include the Navbar component */}
      {/* <div>JobList</div> */}
      <h3>Available Jobs</h3>
      <ul>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <li
              key={job._id}
              className={`jobItem ${hoveredJobId === job._id ? 'jobItemHover' : ''}`}
              onMouseEnter={() => setHoveredJobId(job._id)}
              onMouseLeave={() => setHoveredJobId(null)}
            >
              <strong>{job.title}</strong> at {job.company} <br />
              <p><strong>Posted by:</strong> {job.postedBy?.name || "Unknown"}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> ₹{job.salary} PCM</p>
              <p><strong>Posted on:</strong> {new Date(job.createdAt).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <button onClick={() => handleApply(job._id)} disabled={applications.includes(job._id)}>
                {applications.includes(job._id) ? "Applied" : "Apply"}
              </button>
            </li>
          ))
        ) : (
          <p>No job listings available.</p>
        )}
      </ul>
    </div>
  );
};

export default JobList;