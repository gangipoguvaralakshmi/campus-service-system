import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewComplaint from './pages/NewComplaint';
import ComplaintStatus from './pages/ComplaintStatus';
import ComplaintDetails from './pages/ComplaintDetails';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminComplaints from './pages/AdminComplaints';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import Register from './pages/Register';
import Settings from './pages/Settings';
import AuthSuccess from './pages/AuthSuccess'; // Add this import
import ChatBot from './components/common/ChatBot';

// Context
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import { useAuth } from './context/AuthContext';

// Header component
const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div style={{
      background: '#0b2f4e',
      color: 'white',
      padding: '0.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      height: '60px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div 
        style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
        onClick={() => {
          if (user.role === 'admin') navigate('/admin-dashboard');
          else if (user.role === 'staff') navigate('/staff-dashboard');
          else navigate('/dashboard');
        }}
      >
        <i className="fas fa-robot" style={{ color: '#FFD966', fontSize: '1.5rem' }}></i>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>ServCampus<span style={{ color: '#FFD966' }}>AI</span></span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user?.name}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.7, textTransform: 'capitalize' }}>{user?.role}</div>
        </div>
        <button
          onClick={logout}
          style={{
            background: 'none',
            border: '1px solid #FFD966',
            color: '#FFD966',
            padding: '0.3rem 1rem',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#FFD966';
            e.target.style.color = '#0b2f4e';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
            e.target.style.color = '#FFD966';
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

// Main App component
const AppContent = () => {
  const location = useLocation();
  const isPublicPage = location.pathname === '/' || 
                      location.pathname === '/login' || 
                      location.pathname === '/register' || 
                      location.pathname === '/auth/success'; // Add auth/success as public
  
  return (
    <>
      {!isPublicPage && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/success" element={<AuthSuccess />} /> {/* Add this route */}
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        
        <Route path="/new-complaint" element={<PrivateRoute />}>
          <Route path="/new-complaint" element={<NewComplaint />} />
        </Route>
        
        <Route path="/complaint-status" element={<PrivateRoute />}>
          <Route path="/complaint-status" element={<ComplaintStatus />} />
        </Route>

        <Route path="/complaint-details/:id" element={<PrivateRoute />}>
          <Route path="/complaint-details/:id" element={<ComplaintDetails />} />
        </Route>
        
        <Route path="/admin-dashboard" element={<PrivateRoute role="admin" />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="/admin-complaints" element={<PrivateRoute role="admin" />}>
          <Route path="/admin-complaints" element={<AdminComplaints />} />
        </Route>
        
        <Route path="/admin-analytics" element={<PrivateRoute role="admin" />}>
          <Route path="/admin-analytics" element={<AdminAnalytics />} />
        </Route>

        <Route path="/staff-dashboard" element={<PrivateRoute role="staff" />}>
          <Route path="/staff-dashboard" element={<StaffDashboard />} />
        </Route>
        
        <Route path="/settings" element={<PrivateRoute />}>
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ChatBot />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                icon: '✅',
              },
              error: {
                duration: 4000,
                icon: '❌',
              },
            }}
          />
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;