import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import SeekerDashboard from './components/Dashboard/SeekersDashboard';
import EmployerDashboard from './components/Dashboard/EmployerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Navbar from './components/Common/Navbar';
import JobDetails from './components/Jobs/JobDetails';
import JobList from './components/Jobs/JobList';
import JobApplications from './components/Jobs/JobApplications';


// ✅ Role-Based Protected Route
const ProtectedRoute = ({ children, requiredRole }) => {
  const userRole = localStorage.getItem('userRole'); // ✅ Fetch from local storage

  if (!userRole) return <Navigate to="/login" />; // Redirect if not logged in

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/register" />; // Redirect if role doesn't match
  }

  return children;
};

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/applications" element={<JobApplications />} />
        {/* ✅ Role-Based Routes */}
        <Route path="/seeker-dashboard" element={<ProtectedRoute requiredRole="seeker"><SeekerDashboard /></ProtectedRoute>} />
        <Route path="/employer-dashboard" element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
