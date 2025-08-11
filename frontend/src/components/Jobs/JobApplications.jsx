import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../Common/Navbar';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import './styles/JobApplication.css';

const JobApplications = () => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/applications/user/${user.id}`);
        const sortedApplications = response.data.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
        setApplications(sortedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (user) {
      fetchApplications();
    }
  }, [user]);

  const filteredApplications = applications
    .filter(app =>
      app.jobId && (
        app.jobId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.jobId.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .filter(app =>
      !filterStatus || app.status.toLowerCase() === filterStatus.toLowerCase()
    );

  return (
    <div>
      <Navbar role="seeker" />
      <br/>
      <div className='jobContainer1'>
        <center><h3>Applied Jobs</h3></center>

        {/* 🔽 Toggle Filter Panel Button */}
        <div className="filter-toggle">
          <button onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {/* 🔽 Sliding Filter Panel */}
        <div className={`filter-panel ${showFilters ? 'show' : ''}`}>
          <input
            type="text"
            placeholder="Search applied jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            onChange={(e) => setFilterStatus(e.target.value)}
            value={filterStatus}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* 🔽 Job List */}
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.jobId._id} className="appliedJobCard">
              <h3>{app.jobId.title}</h3>
              <p><strong>Company: </strong> {app.jobId.company}</p>
              <p><strong>Location: </strong> {app.jobId.location}</p>
              <p><strong>Salary: </strong>₹{app.jobId.salary} PM</p>
              <p><strong>Posted by: </strong> {app.jobId.name?.name || "Admin"}</p>
              <p><strong>Email: </strong> {app.jobId?.email || "admin@workhunt.com"}</p>
              <p><strong>Status: </strong> 
                <span className={`status-badge ${app.status.toLowerCase()}`}>
                  {app.status}
                </span>
              </p>
            </div>
          ))
        ) : (
          <p>No matching applications found.</p>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
