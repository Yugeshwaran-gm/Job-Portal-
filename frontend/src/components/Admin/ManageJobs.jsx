import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../Common/Navbar";
import { AuthContext } from "../../context/authContext";
import "./styles/ManageJobs.css"; // import your CSS file

const ManageJobs = () => {
  const { user } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/jobs", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log("✅ Jobs fetched:", res.data);

        if (Array.isArray(res.data)) {
          // Remove jobs posted by admins
          const nonAdminJobs = res.data.filter(
            (job) => job.postedBy?.role !== "admin"
          );

          // Sort by recent first
          const sortedJobs = nonAdminJobs.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setJobs(sortedJobs);
        } else {
          console.error("Expected an array, got:", res.data);
          setJobs([]);
        }
      } catch (err) {
        console.error(
          "❌ Error fetching jobs:",
          err.response?.data || err.message
        );
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchJobs();
    }
  }, [user?.token]);

  // Delete job handler
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/admin/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      setJobs(jobs.filter((j) => j._id !== jobId));
      alert("✅ Job deleted successfully");
    } catch (err) {
      console.error(
        "❌ Error deleting job:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Error deleting job");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar role="admin" />
        <p>Loading jobs...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar role="admin" />
      <div className="manageJobsContainer">
  <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Manage Jobs</h2>
        {jobs.length > 0 ? (
          <div className="jobCards">
            {jobs.map((job) => (
              <div className="jobCard" key={job._id}>
                <h3>{job.title}</h3>
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Posted By:</strong> {job.postedBy?.name || "Admin"}</p>
                <p style={{ fontSize: "0.9em", color: "#777" }}>
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </p>
                <div className="jobActions">
                  <button
                    className="deleteBtn"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No non-admin jobs found.</p>
        )}
      </div>
    </div>
  );
};

export default ManageJobs;
