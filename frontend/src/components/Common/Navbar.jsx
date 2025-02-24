import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = ({ role }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="navbar">
      <h2>WorkHunt</h2>
      <ul>
        {role === "seeker" && (
          <>
            <li><Link to="/seeker-dashboard">Dashboard</Link></li>
            <li><Link to="/jobs">Browse Jobs</Link></li>
            <li><Link to="/applications">My Applications</Link></li>
            {/* Profile Dropdown */}
            <li className="dropdown">
              <button className="dropbtn" onClick={toggleDropdown}>Profile</button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/edit-profile">Edit Profile</Link>
                  <Link to="/logout">Logout</Link>
                </div>
              )}
            </li>
          </>
        )}
        {role === "employer" && (
          <>
            <li><Link to="/employer-dashboard">Dashboard</Link></li>
            <li><Link to="/post-job">Post Job</Link></li>
            <li><Link to="/candidates">View Candidates</Link></li>
            {/* Profile Dropdown */}
            <li className="dropdown">
              <button className="dropbtn" onClick={toggleDropdown}>Profile</button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/edit-profile">Edit Profile</Link>
                  <Link to="/logout">Logout</Link>
                </div>
              )}
            </li>
          </>
        )}
        {role === "admin" && (
          <>
            <li><Link to="/admin-dashboard">Dashboard</Link></li>
            <li><Link to="/manage-users">Manage Users</Link></li>
            <li><Link to="/site-settings">Site Settings</Link></li>
            {/* Profile Dropdown */}
            <li className="dropdown">
              <button className="dropbtn" onClick={toggleDropdown}>Profile</button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/edit-profile">Edit Profile</Link>
                  <Link to="/logout">Logout</Link>
                </div>
              )}
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
