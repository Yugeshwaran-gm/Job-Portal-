import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Authstyles/Login.css';

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/users/login", { email, password });
  
      console.log("✅ Login Response:", response.data);
  
      // ✅ Store authentication data in localStorage
      login(response.data.token, response.data.role);
  
      // ✅ Redirect based on role
      if (response.data.role === "admin") navigate("/admin-dashboard");
      else if (response.data.role === "employer") navigate("/employer-dashboard");
      else navigate("/seeker-dashboard");
  
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      console.error("❌ Login Error:", err.response?.data);
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <div className="password-container">
          <input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            onClick={() => setShowPassword(!showPassword)} 
            className="password-toggle-icon"
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
};

export default Login;