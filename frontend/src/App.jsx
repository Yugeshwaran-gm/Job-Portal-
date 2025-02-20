import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import SeekerDashboard from './components/Dashboard/SeekersDashboard';
import EmployerDashboard from './components/Dashboard/EmployerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';

// ✅ Role-Based Protected Route
const ProtectedRoute = ({ children, requiredRole }) => {
  const userRole = localStorage.getItem('userRole'); // ✅ Fetch from local storage

  if (!userRole) return <Navigate to="/login" />; // Redirect if not logged in

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/not-authorized" />; // Redirect if role doesn't match
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* ✅ Role-Based Routes */}
        <Route path="/seeker-dashboard" element={<ProtectedRoute requiredRole="jobseeker"><SeekerDashboard /></ProtectedRoute>} />
        <Route path="/employer-dashboard" element={<ProtectedRoute requiredRole="employer"><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/admin-dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
