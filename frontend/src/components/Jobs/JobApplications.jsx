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

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        console.log("🔄 Fetching applications for user:", user.id);
        const response = await axios.get(`http://localhost:3000/api/applications/user/${user.id}`);
        
        if (!response.data || response.data.length === 0) {
          console.warn("⚠️ No applications found for user.");
        }
        console.log("🔄 Raw API Response:", response.data);


        // 🔽 Sort applications by createdAt (latest first)
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

  const filteredApplications = applications.filter(app =>
    app.jobId && (
      app.jobId.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.jobId.company.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).filter(app =>
    !filterStatus || app.status.toLowerCase() === filterStatus.toLowerCase()
  );

  return (
    <div>
      <Navbar role="seeker" />
      <br/>
    <div className='jobContainer1'>
      <div >Job Applications</div>
      <center>
      <h3>Applied Jobs</h3>
      </center>
      {/* 🔎 Search & Filter Options */}
      <div className='filter'>
      <input type="text" placeholder="Search applied jobs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        <select onChange={(e) => setFilterStatus(e.target.value)} value={filterStatus}>
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
        {filteredApplications.length > 0 ? (
          filteredApplications.map((app) => (
            <div key={app.jobId._id} className="appliedJobCard">
              <h3>{app.jobId.title}</h3>
              <p><strong>Company: </strong> {app.jobId.company}</p>
              <p><strong>Location: </strong> {app.jobId.location}</p>
              <p><strong>Salary: </strong>₹{app.jobId.salary} PM</p>
              <p><strong>Posted by: </strong> {app.jobId.name?.name || "Admin"}</p>
              <p><strong>email: </strong> {app.jobId?.email ||"admin@workhunt.com"}</p>
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
      {/* {applications.length > 0 ? (
        applications.map((app) => (
          app.jobId ? (
            console.log("jobid:", app.jobId),
            <div key={app.jobId._id} className="appliedJobCard">
              <h3>{app.jobId.title}</h3>
              <p><strong>Company: </strong> {app.jobId.company}</p>
              <p><strong>Location: </strong> {app.jobId.location}</p>
              <p><strong>Salary: </strong>₹{app.jobId.salary} PM</p>
              <p><strong>Posted by: </strong> {app.jobId.name?.name || "Admin"}</p>
              <p><strong>email: </strong> {app.jobId?.email ||"admin@workhunt.com"}</p>
              <p><strong>Status: </strong> 
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
      )} */}
    </div>
    </div>
  );
};

export default JobApplications;
