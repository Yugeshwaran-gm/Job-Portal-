import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Common/Navbar';

const JobPostForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
  });

  const postJob = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // ✅ Get token from local storage
      if (!token) {
        alert('You must be logged in to post a job.');
        return;
      }

      await axios.post('http://localhost:3000/api/jobs/post-job', formData, {
        headers: { Authorization: `Bearer ${token}` } // ✅ Send token in headers
      });

      setFormData({ title: '', company: '', location: '', salary: '', description: '' });
      alert('Job Posted Successfully!');
      navigate('/employer-dashboard'); 
    } catch (error) {
      console.error('Error posting job:', error.response?.data || error.message);
    }
  };

  return (
    <div>
      <Navbar role="employer" />
      <form onSubmit={postJob}>
        <fieldset>
          <legend>Post Job</legend>
          <table>
            <tbody>
              <tr>
                <td><label htmlFor="title">Job Title</label></td>
                <td>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Job Title"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="company">Company</label></td>
                <td>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company Name"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="location">Location</label></td>
                <td>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Location"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="salary">Salary</label></td>
                <td>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="Salary"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="description">Job Description</label></td>
                <td>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Job Description"
                    required
                  />
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <button type="submit">Post Job</button>
                </td>
              </tr>
            </tbody>
          </table>
        </fieldset>
      </form>
    </div>
  );
};

export default JobPostForm;
