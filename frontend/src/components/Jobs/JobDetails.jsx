import React from 'react';
import Navbar from '../Common/Navbar'; // Corrected import path

const JobDetails = () => {
  return (
    <div>
      <Navbar role="seeker" /> {/* Include the Navbar component */}
      <div>JobDetails</div>
    </div>
  );
};

export default JobDetails;