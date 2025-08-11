import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../Common/Navbar';
import { AuthContext } from "../../context/authContext";
import './styles/JobList.css';
import { useNavigate } from 'react-router-dom';

const JobList = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [hoveredJobId, setHoveredJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ location: '', minSalary: '', maxSalary: '' });
  const [showFilters, setShowFilters] = useState(false); // 🔹 New state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/jobs/get");
        const sortedJobs = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobs(sortedJobs);
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

    const applicationData = { jobId, userId: user.id };

    try {
      await axios.post("http://localhost:3000/api/applications", applicationData);
      alert("Successfully applied for the job!");
      setApplications([...applications, jobId]);
    } catch (error) {
      console.error("Application error:", error.response?.data);
      alert(error.response?.data?.message || "Error applying for the job.");
    }
  };

  const handleMessage = (postedBy) => {
    if (!user || !user.id) {
      alert("Please log in to send a message.");
      return;
    }
    navigate('/messages', { state: { selectedUser: postedBy } });
  };

  // 🔽 Filter and Search Logic
  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(job =>
    (!filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase())) &&
    (!filters.minSalary || job.salary >= Number(filters.minSalary)) &&
    (!filters.maxSalary || job.salary <= Number(filters.maxSalary))
  );

  return (
    <div className='jobListContainer'>
      <Navbar role="seeker" />
      <h3>Available Jobs</h3>

      {/* 🔘 Toggle Button */}
      <div className="filter-toggle">
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* 🔎 Search & Filter Options */}
<div className={`filters-wrapper ${showFilters ? "open" : ""}`}>
  <div className="filters">
    <input 
      type="text" 
      placeholder="Search jobs..." 
      value={searchQuery} 
      onChange={(e) => setSearchQuery(e.target.value)} 
    />
    <input 
      type="text" 
      placeholder="Location" 
      value={filters.location} 
      onChange={(e) => setFilters({ ...filters, location: e.target.value })} 
    />
    <input 
      type="number" 
      placeholder="Min Salary" 
      value={filters.minSalary} 
      onChange={(e) => setFilters({ ...filters, minSalary: e.target.value })} 
    />
    <input 
      type="number" 
      placeholder="Max Salary" 
      value={filters.maxSalary} 
      onChange={(e) => setFilters({ ...filters, maxSalary: e.target.value })} 
    />
  </div>
</div>


      <ul>
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <li key={job._id} className={`jobItem ${hoveredJobId === job._id ? 'jobItemHover' : ''}`}
              onMouseEnter={() => setHoveredJobId(job._id)}
              onMouseLeave={() => setHoveredJobId(null)}
            >
              <center>
                <strong>{job.title} at {job.company}</strong>
              </center>
              <p><strong>Employer: {job.postedBy?.name || "Admin"}</strong></p>
              <p><strong>Email: {job.postedBy?.email || "admin@workhunt.com"}</strong></p>
              <p><strong>Location: {job.location}</strong></p>
              <p><strong>Salary: ₹{job.salary} PM</strong></p>
              <p><strong>Posted on: {new Date(job.createdAt).toLocaleDateString()}</strong></p>
              <p><strong>Description: {job.description}</strong></p>
              <center>
                <div className="button-container">
                  <button onClick={() => handleApply(job._id)} disabled={applications.includes(job._id)}>
                    {applications.includes(job._id) ? "Applied" : "Apply"}
                  </button>
                  <button onClick={() => handleMessage(job.postedBy)}>Message</button>
                </div>
              </center>
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
