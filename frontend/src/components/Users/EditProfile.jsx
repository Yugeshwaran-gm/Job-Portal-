import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Common/Navbar";
import "./styles/EditProfile.css";

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
    console.log("📦 Raw storedUser from localStorage:", storedUser);

    if (!storedUser) {
      console.warn("⚠️ No user in localStorage — redirecting to login");
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    console.log("✅ Parsed userData:", userData);

    const token = userData?.token;
    const userRole = userData?.role;
    console.log("🔑 Token:", token);
    console.log("👤 Role:", userRole);

    if (!token) {
      console.warn("⚠️ No token found — redirecting to login");
      navigate("/login");
      return;
    }

    setRole(userRole);

    console.log("🌐 Fetching profile...");
    const { data } = await axios.get("http://localhost:3000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📄 Profile data from API:", data);

    setName(data.name);
    setEmail(data.email);
    setLoading(false);

  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    if (error.response) {
      console.error("📡 API Error Data:", error.response.data);
      console.error("📡 API Error Status:", error.response.status);
      console.error("📡 API Error Headers:", error.response.headers);
    }
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
          <fieldset>
            <legend>Profile Information</legend>
            <table>
              <tbody>
                <tr>
                  <td><label>Name:</label></td>
                  <td>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </td>
                </tr>
                <tr>
                  <td><label>Email:</label></td>
                  <td>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </td>
                </tr>
                <tr>
                  <td><label>New Password (optional):</label></td>
                  <td>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan="2" className="button-container">
                    <button type="submit">Update Profile</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </fieldset>
        </form>
      )}
    </div>
  );
};

export default ProfileEdit;
