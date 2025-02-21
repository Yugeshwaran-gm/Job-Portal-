import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Navbar from '../Common/Navbar';
const JobList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/jobs/get');
                setJobs(response.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div>
            <Navbar role="seeker" /> {/* Include the Navbar component */}
            <div>JobList</div>
        </div>
    )
}

export default JobList