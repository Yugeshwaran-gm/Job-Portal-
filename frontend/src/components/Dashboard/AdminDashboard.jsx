import React from 'react';
import Navbar from '../Common/Navbar';
const AdminDashboard = () => {
  return (
    <div>
      <Navbar role="admin" /> 
      <h2>Admin Dashboard</h2>
      <p>Manage users, job posts, and platform settings.</p>
    </div>
  );
};

export default AdminDashboard;
