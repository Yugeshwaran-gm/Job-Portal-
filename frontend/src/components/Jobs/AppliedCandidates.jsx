import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../Common/Navbar';

const AppliedCandidates = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [jobTitle, setJobTitle] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/applications/job/${jobId}`);
        
        if (response.data.applications.length === 0) {
          console.warn("No candidates found for this job.");
        }

        setCandidates(response.data.applications);
        setJobTitle(response.data.applications[0]?.jobId?.title || "Unknown Job");
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };

    fetchCandidates();
  }, [jobId]);

  const handleStatusChange = async (appId, status) => {
    try {
      await axios.put(`http://localhost:3000/api/applications/update-status/${appId}`, { status });
      setCandidates(prev =>
        prev.map(app => app._id === appId ? { ...app, applicationStatus: status } : app)
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleRemove = async (appId) => {
    try {
      await axios.delete(`http://localhost:3000/api/applications/${appId}`);
      setCandidates(prev => prev.filter(app => app._id !== appId));
    } catch (error) {
      console.error("Error removing application:", error);
    }
  };

  return (
    <div>
      <Navbar role="employer" />
      <div className="container">
        <h2>Candidates for: {jobTitle}</h2>
        <button onClick={() => navigate(-1)} className="back-btn">⬅ Back</button>
        {candidates.length > 0 ? (
          <table className="candidate-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate._id}>
                  <td>{candidate.userId.name}</td>
                  <td>{candidate.userId.email}</td>
                  <td className={`status ${candidate.applicationStatus.toLowerCase()}`}>
                    {candidate.applicationStatus}
                  </td>
                  <td>
                    {candidate.applicationStatus === "Pending" && (
                      <>
                        <button onClick={() => handleStatusChange(candidate._id, "Accepted")} className="accept-btn">
                          ✅ Accept
                        </button>
                        <button onClick={() => handleStatusChange(candidate._id, "Rejected")} className="reject-btn">
                          ❌ Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => handleRemove(candidate._id)} className="remove-btn">
                      🗑 Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No candidates have applied for this job yet.</p>
        )}
      </div>
    </div>
  );
};

export default AppliedCandidates;
