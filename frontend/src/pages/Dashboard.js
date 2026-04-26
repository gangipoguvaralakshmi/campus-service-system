import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar">
          <div className="welcome">
            <h1>Student Dashboard</h1>
            <p>Welcome back! Track your campus service requests.</p>
          </div>
        </div>
        
        <div className="stats-cards">
          <div className="stat">
            <div className="stat-left">
              <h4>Open complaints</h4>
              <div className="number">0</div>
            </div>
            <div className="stat-icon"><i className="fas fa-ticket"></i></div>
          </div>
          <div className="stat">
            <div className="stat-left">
              <h4>In progress</h4>
              <div className="number">0</div>
            </div>
            <div className="stat-icon"><i className="fas fa-rotate"></i></div>
          </div>
          <div className="stat">
            <div className="stat-left">
              <h4>Resolved</h4>
              <div className="number">0</div>
            </div>
            <div className="stat-icon"><i className="fas fa-circle-check"></i></div>
          </div>
          <div className="stat">
            <div className="stat-left">
              <h4>AI accuracy</h4>
              <div className="number">94%</div>
            </div>
            <div className="stat-icon"><i className="fas fa-brain"></i></div>
          </div>
        </div>

        <div className="row-split">
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Quick Actions</h3>
            <p style={{ color: '#5f7d95', marginBottom: '1.5rem' }}>
              Raise a new complaint or track existing requests
            </p>
            <div className="action-buttons">
              <button 
                className="btn-primary" 
                onClick={() => navigate('/new-complaint')}
              >
                <i className="fas fa-plus"></i> New Complaint
              </button>
              <button 
                className="btn-outline" 
                onClick={() => navigate('/complaint-status')}
              >
                <i className="fas fa-search"></i> Track Status
              </button>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: '1rem' }}>Recent Activity</h3>
            <p style={{ color: '#5f7d95' }}>No recent complaints</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;