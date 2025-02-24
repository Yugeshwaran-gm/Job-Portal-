import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext'; // ✅ Import AuthProvider
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
import ForgotPassword from './components/Auth/ForgotPassword';
import JobPostForm from './components/Jobs/JobPostForm';
import ProfileEdit from './components/Users/EditProfile';

// ✅ Role-Based Protected Route with AuthContext
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();  // ✅ Get user from AuthContext

  if (user === null) {
    return <p>Loading...</p>; // ✅ Avoid flickering on refresh
  }

  if (!user?.token) {
    return <Navigate to="/login" />; // ✅ Redirect if not logged in
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" />; // ✅ Redirect if role doesn't match
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Login />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/applications" element={<JobApplications />} />
          <Route path="/post-job" element={<JobPostForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* ✅ Role-Based Routes */}
          <Route path="/profile" element={<ProfileEdit />} />
          <Route path="/seeker-dashboard" element={<ProtectedRoute requiredRole="seeker"><SeekerDashboard /></ProtectedRoute>} />
          <Route path="/employer-dashboard" element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
