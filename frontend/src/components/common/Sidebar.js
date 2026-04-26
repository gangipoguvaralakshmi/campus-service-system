import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';
  };

  // Define menu items based on user role
  const getNavItems = () => {
    const role = user?.role;
    
    // Common items for all roles
    const commonItems = [
      { path: '/settings', icon: 'fa-cog', label: 'Settings' },
    ];

    // Student items
    if (role === 'student') {
      return [
        { path: '/dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
        { path: '/new-complaint', icon: 'fa-plus-circle', label: 'New Complaint' },
        { path: '/complaint-status', icon: 'fa-list-check', label: 'My Requests' },
        ...commonItems
      ];
    }
    
    // Staff items
    if (role === 'staff') {
      return [
        { path: '/staff-dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
        { path: '/staff-dashboard?tab=assigned', icon: 'fa-tasks', label: 'Assigned Complaints' },
        ...commonItems
      ];
    }
    
    // Admin items
    if (role === 'admin') {
      return [
        { path: '/admin-dashboard', icon: 'fa-chart-pie', label: 'Dashboard' },
        { path: '/admin-complaints', icon: 'fa-clipboard-list', label: 'Manage Complaints' },
        { path: '/admin-analytics', icon: 'fa-chart-simple', label: 'Analytics' },
        ...commonItems
      ];
    }
    
    // Default (fallback)
    return commonItems;
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user role display name
  const getRoleDisplay = () => {
    switch(user?.role) {
      case 'admin': return 'Administrator';
      case 'staff': return 'Staff';
      case 'student': return 'Student';
      default: return 'User';
    }
  };

  return (
    <div className="sidebar" style={{ marginTop: '60px' }}>
      <div className="logo-area">
        <i className="fas fa-robot" style={{ color: '#FFD966' }}></i> ServCampus<span>AI</span>
      </div>
      <div className="sidebar-nav">
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <i className={`fas ${item.icon}`}></i> {item.label}
          </div>
        ))}
        <div className="nav-item" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </div>
      </div>
      <div className="user-chip">
        <div className="avatar">
          {getInitials(user?.name)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600 }}>{user?.name || 'User'}</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>
            {getRoleDisplay()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;