import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Common/Navbar";

const ProfileEdit = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          navigate("/login");
          return;
        }

        const userData = JSON.parse(storedUser);
        const token = userData?.token;
        const userRole = userData?.role;  // ✅ Fetch role from localStorage

        if (!token) {
          navigate("/login");
          return;
        }

        setRole(userRole); // ✅ Set the role for Navbar

        const { data } = await axios.get("http://localhost:3000/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(data.name);
        setEmail(data.email);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data?.message || error.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setMessage("Unauthorized. Please log in again.");
        navigate("/login");
        return;
      }

      const userData = JSON.parse(storedUser);
      const token = userData?.token;

      const { data } = await axios.put(
        "http://localhost:3000/api/users/profile",
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Profile updated successfully!");

      // ✅ Update user data in localStorage (ensuring role remains unchanged)
      localStorage.setItem(
        "user",
        JSON.stringify({ ...userData, name: data.name, email: data.email, token: data.token })
      );
    } catch (error) {
      setMessage("Error updating profile. Try again.");
    }
  };

  return (
    <div className="profile-edit-container">
      {/* ✅ Pass role to Navbar */}
      {role && <Navbar role={role} />}
      <h2>Edit Profile</h2>
      {message && <p className="message">{message}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label>New Password (optional):</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit">Update Profile</button>
        </form>
      )}
    </div>
  );
};

export default ProfileEdit;
