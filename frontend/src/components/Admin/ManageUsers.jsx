import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Navbar from "../Common/Navbar";
import { AuthContext } from "../../context/authContext";
import "./styles/ManageUsers.css"; // new CSS file
// import ManageUsers from './ManageUsers';

const ManageUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        console.log("✅ Users fetched:", res.data);

        if (Array.isArray(res.data)) {
          // Remove admins from the list
          const nonAdminUsers = res.data.filter((u) => u.role !== "admin");

          // Sort by most recently created first
          const sortedUsers = nonAdminUsers.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          setUsers(sortedUsers);
        } else {
          console.error("Expected an array, got:", res.data);
          setUsers([]);
        }
      } catch (err) {
        console.error(
          "❌ Error fetching users:",
          err.response?.data || err.message
        );
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchUsers();
    }
  }, [user?.token]);

  // Delete user handler
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      // Update UI without reloading
      setUsers(users.filter((u) => u._id !== userId));
      alert("✅ User deleted successfully");
    } catch (err) {
      console.error(
        "❌ Error deleting user:",
        err.response?.data || err.message
      );
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar role="admin" />
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="manageUsersContainer">
      <Navbar role="admin" />
      <h2 style={{ textAlign: 'center', margin: '20px 0' }}>Manage Users</h2>

      {users.length > 0 ? (
        <div className="userCards">
          {users.map((u) => (
            <div className="userCard" key={u._id}>
              <h3>{u.name}</h3>
              <p><strong>Email:</strong> {u.email}</p>
              <p><strong>Role:</strong> {u.role}</p>
              <div className="userActions">
                <button
                  className="deleteBtn"
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No non-admin users found.</p>
      )}
    </div>
  );
};

export default ManageUsers;
