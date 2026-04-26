import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    contactNumber: user?.contactNumber || '',
    registrationId: user?.registrationId || ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    complaintUpdates: true,
    marketingEmails: false
  });

  // Fetch notification preferences on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/users/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleNotificationChange = (e) => {
    setNotifications({
      ...notifications,
      [e.target.name]: e.target.checked
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/users/profile', {
        name: profileData.name,
        contactNumber: profileData.contactNumber
      });
      
      // Update user in context
      if (setUser) {
        setUser(response.data.user);
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.put('/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = async () => {
    setLoading(true);
    try {
      await api.put('/users/notifications', notifications);
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      try {
        await api.delete('/users/account');
        toast.success('Account deleted');
        logout();
        navigate('/');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete account');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#0b2f4e', marginBottom: '2rem' }}>
            <i className="fas fa-cog"></i> Settings
          </h2>

          {/* Settings Tabs */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            borderBottom: '2px solid #eef4f8',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                padding: '0.8rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'profile' ? '3px solid #0b2f4e' : 'none',
                color: activeTab === 'profile' ? '#0b2f4e' : '#5f7d95',
                fontWeight: activeTab === 'profile' ? '600' : 'normal',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-user"></i> Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              style={{
                padding: '0.8rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'security' ? '3px solid #0b2f4e' : 'none',
                color: activeTab === 'security' ? '#0b2f4e' : '#5f7d95',
                fontWeight: activeTab === 'security' ? '600' : 'normal',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-lock"></i> Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              style={{
                padding: '0.8rem 1.5rem',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === 'notifications' ? '3px solid #0b2f4e' : 'none',
                color: activeTab === 'notifications' ? '#0b2f4e' : '#5f7d95',
                fontWeight: activeTab === 'notifications' ? '600' : 'normal',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-bell"></i> Notifications
            </button>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Profile Information</h3>
              <form onSubmit={updateProfile}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    required
                    disabled
                    style={{ background: '#f5f5f5' }}
                  />
                  <small style={{ color: '#5f7d95' }}>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label>Contact Number</label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={profileData.contactNumber}
                    onChange={handleProfileChange}
                    placeholder="Enter your contact number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Registration/Employee ID</label>
                  <input
                    type="text"
                    name="registrationId"
                    value={profileData.registrationId}
                    onChange={handleProfileChange}
                    disabled
                    style={{ background: '#f5f5f5' }}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Change Password</h3>
              <form onSubmit={changePassword}>
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    minLength="6"
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>

              <hr style={{ margin: '2rem 0', border: '1px solid #eef4f8' }} />

              <h3 style={{ marginBottom: '1.5rem', color: '#c44536' }}>Danger Zone</h3>
              <button 
                className="btn-danger"
                onClick={deleteAccount}
                disabled={loading}
                style={{
                  background: '#c44536',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 1.5rem',
                  borderRadius: '40px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Delete Account
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card">
              <h3 style={{ marginBottom: '1.5rem' }}>Notification Preferences</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={notifications.emailNotifications}
                    onChange={handleNotificationChange}
                  />
                  Email Notifications
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={notifications.smsNotifications}
                    onChange={handleNotificationChange}
                  />
                  SMS Notifications
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="complaintUpdates"
                    checked={notifications.complaintUpdates}
                    onChange={handleNotificationChange}
                  />
                  Complaint Status Updates
                </label>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="marketingEmails"
                    checked={notifications.marketingEmails}
                    onChange={handleNotificationChange}
                  />
                  Marketing Emails
                </label>
              </div>

              <button 
                className="btn-primary"
                onClick={saveNotifications}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;