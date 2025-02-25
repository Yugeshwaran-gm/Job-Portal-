import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/authContext'; // ✅ Import AuthProvider
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* ✅ Wrap the entire app */}
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </StrictMode>,
);
