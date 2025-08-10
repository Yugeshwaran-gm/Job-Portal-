import React, { useEffect, useState } from "react";
import Navbar from "../Common/Navbar";
import axios from "axios";
// import "./AdminDashboard.css"; // Import CSS file
import "./styles/AdminDashboard.css"; // Import CSS file

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [jobCount, setJobCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;

        const [usersRes, jobsRes] = await Promise.all([
          axios.get("http://localhost:3000/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/api/admin/jobs", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUserCount(usersRes.data.length);
        setJobCount(jobsRes.data.length);
      } catch (error) {
        console.error("Error fetching counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="dashboard-container">
      <Navbar role="admin" />

      <div className="dashboard-content">
        <h2 className="dashboard-title">Admin Dashboard</h2>

        {loading ? (
          <p className="loading-text">Loading dashboard...</p>
        ) : (
          <div className="cards-grid">
            <div className="card users-card">
              <div className="icon">👤</div>
              <div>
                <h3>Total Users</h3>
                <p className="count">{userCount}</p>
              </div>
            </div>

            <div className="card jobs-card">
              <div className="icon">💼</div>
              <div>
                <h3>Total Jobs</h3>
                <p className="count">{jobCount}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
