import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar">
          <div className="welcome">
            <h1>Admin Dashboard</h1>
            <p>Welcome back! Manage campus service requests.</p>
          </div>
        </div>
        
        <div className="stats-cards">
          <div className="stat" onClick={() => navigate('/admin-complaints')} style={{ cursor: 'pointer' }}>
            <div className="stat-left">
              <h4>Manage Complaints</h4>
              <div className="number">View All</div>
            </div>
            <div className="stat-icon"><i className="fas fa-clipboard-list"></i></div>
          </div>
          <div className="stat" onClick={() => navigate('/admin-analytics')} style={{ cursor: 'pointer' }}>
            <div className="stat-left">
              <h4>Analytics</h4>
              <div className="number">Reports</div>
            </div>
            <div className="stat-icon"><i className="fas fa-chart-bar"></i></div>
          </div>
          <div className="stat" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }}>
            <div className="stat-left">
              <h4>Settings</h4>
              <div className="number">Profile</div>
            </div>
            <div className="stat-icon"><i className="fas fa-cog"></i></div>
          </div>
        </div>

        <div className="card">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => navigate('/admin-complaints')}>
              View All Complaints
            </button>
            <button className="btn-outline" onClick={() => navigate('/admin-analytics')}>
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;