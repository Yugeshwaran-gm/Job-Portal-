import React from "react";
import { Link } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = ({ role }) => {
  return (
    <nav className="navbar">
      <h2>Job Portal</h2>
      <ul>
        {role === "seeker" && (
          <>
            <li><Link to="/seeker-dashboard">Dashboard</Link></li>
            <li><Link to="/jobs">Browse Jobs</Link></li>
            <li><Link to="/applications">My Applications</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </>
        )}
        {role === "employer" && (
          <>
            <li><Link to="/employer-dashboard">Dashboard</Link></li>
            <li><Link to="/post-job">Post Job</Link></li>
            <li><Link to="/candidates">View Candidates</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </>
        )}
        {role === "admin" && (
          <>
            <li><Link to="/admin-dashboard">Dashboard</Link></li>
            <li><Link to="/manage-users">Manage Users</Link></li>
            <li><Link to="/site-settings">Site Settings</Link></li>
            <li><Link to="/logout">Logout</Link></li>
          </>
        )}
        
      </ul>
    </nav>
  );
};

export default Navbar;
