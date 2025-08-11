import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import './Authstyles/Register.css';

const Register = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('seeker');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
      }
      try {
        const response = await axios.post('http://localhost:3000/api/users/register', { name, email, password, role });
      
        // ✅ Store token & role in localStorage
        login(response.data.token, response.data.role);

      
        console.log("Registered Role:", response.data.role); // Debugging check
      
        // ✅ Redirect based on role
        if (response.data.role === 'admin') navigate('/admin-dashboard');
        else if (response.data.role === 'employer') navigate('/employer-dashboard');
        else navigate('/seeker-dashboard'); 
      
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed');
      }
    }
    

  return (
    <div class="main-wrapper">
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
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
            className="password-toggle-icon inside"
          />
        </div>
        <div className="password-container">
          <input 
            type={showConfirmPassword ? 'text' : 'password'} 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
          <FontAwesomeIcon 
            icon={showConfirmPassword ? faEyeSlash : faEye} 
            onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
            className="password-toggle-icon inside"
          />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="seeker">Job Seeker</option>
          <option value="employer">Employer</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
    </div>
  );
};

export default Register;
