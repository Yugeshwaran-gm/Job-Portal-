import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "./context/authContext";
import Home from './components/Home';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import SeekerDashboard from './components/Dashboard/SeekersDashboard';
import EmployerDashboard from './components/Dashboard/EmployerDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import Navbar from './components/Common/Navbar';
import JobList from './components/Jobs/JobList';
import JobApplications from './components/Jobs/JobApplications';
import ForgotPassword from './components/Auth/ForgotPassword';
import JobPostForm from './components/Jobs/JobPostForm';
import ProfileEdit from './components/Users/EditProfile';
import Messages from './components/Messages/Messages';
import AppliedCandidates from './components/Jobs/AppliedCandidates';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);

  if (user === null) return <p>Loading...</p>;  
  if (!user?.token) return <Navigate to="/login" replace />;  
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/login" replace />;  

  return children;
};

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Login />} />
        <Route path="/jobs" element={<JobList />} />
        <Route path="/applications" element={<JobApplications />} />
        <Route path="/post-job" element={<JobPostForm />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<ProfileEdit />} />
        <Route path="/candidates" element={<AppliedCandidates />} />

        {/* ✅ Seeker Dashboard with Explicit user ? Check */}
        <Route path="/seeker-dashboard" element={
          user ? (
            <>
              {console.log("✅ Authenticated User:", user)}
            <SeekerDashboard />
            </>
          ) : (
            <>
              {console.log("❌ User is null, redirecting to login")}
              <Navigate to="/login" />
            </>
          )
        } />

        {/* ✅ Employer Dashboard with Explicit user ? Check */}
        <Route path="/employer-dashboard" element={
          user ? (
            <>
              {console.log("✅ Authenticated User:", user)}
            <EmployerDashboard />
            </>
          ) : (
            <>
              {console.log("❌ User is null, redirecting to login")}
              <Navigate to="/login" />
            </>
          )
        } />

        {/* ✅ Admin Dashboard with Explicit user ? Check */}
        <Route path="/admin-dashboard" element={
          user ? (
            <>
              {console.log("✅ Authenticated User:", user)}
            <AdminDashboard />
            </>
          ) : (
            <>
              {console.log("❌ User is null, redirecting to login")}
              <Navigate to="/login" />
            </>
          )
        } />
      </Routes>
    </>
  );
}

export default App;
