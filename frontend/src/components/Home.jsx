import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; 
import Register from './Auth/Register';// Ensure this file exists in the same directory

const Home = () => {
return (
    <div className="home-container">
        <header className="home-header">
            <h1>Welcome to the Job Portal</h1>
            <p>Find your dream job or hire top talent effortlessly.</p>
        </header>
        <div className="home-buttons">
            <Link to="/register" className="home-btn">Join Now</Link>
        </div>
    </div>
);
};

export default Home;
