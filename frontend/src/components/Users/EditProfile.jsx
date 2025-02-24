import { useState, useEffect } from "react";
import axios from "axios";

const ProfileEdit = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error("Error fetching profile:", error.response.data.message);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        "/api/users/profile",
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Profile updated successfully!");
      localStorage.setItem("token", data.token); // Update token after change
    } catch (error) {
      setMessage("Error updating profile. Try again.");
    }
  };

  return (
    <div className="profile-edit-container">
      <h2>Edit Profile</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>New Password (optional):</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default ProfileEdit;
