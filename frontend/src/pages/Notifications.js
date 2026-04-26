import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'assignment': return 'fa-clipboard-list';
      case 'status_update': return 'fa-rotate';
      case 'complaint_resolved': return 'fa-check-circle';
      case 'comment': return 'fa-comment';
      default: return 'fa-bell';
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="loader">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ color: '#0b2f4e' }}>
              <i className="fas fa-bell"></i> Notifications
            </h2>
            {notifications.some(n => !n.isRead) && (
              <button 
                onClick={markAllAsRead}
                className="btn-outline"
                style={{ padding: '0.5rem 1rem' }}
              >
                Mark All as Read
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <i className="fas fa-bell-slash" style={{ fontSize: '3rem', color: '#5f7d95', marginBottom: '1rem' }}></i>
              <h3 style={{ color: '#5f7d95' }}>No notifications</h3>
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="card">
              {notifications.map(notification => (
                <div
                  key={notification._id}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #eef4f8',
                    background: notification.isRead ? 'white' : '#f0f7ff',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#0b2f4e20',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0b2f4e'
                    }}>
                      <i className={`fas ${getNotificationIcon(notification.type)}`}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>
                        {notification.title}
                      </div>
                      <div style={{ color: '#5f7d95', marginBottom: '0.5rem' }}>
                        {notification.message}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', gap: '1rem' }}>
                        <span>{getTimeAgo(notification.createdAt)}</span>
                        {notification.relatedComplaint && (
                          <button
                            onClick={() => navigate(`/complaint-details/${notification.relatedComplaint._id}`)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#0b2f4e',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              textDecoration: 'underline'
                            }}
                          >
                            View Complaint
                          </button>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification._id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#0b2f4e',
                            cursor: 'pointer',
                            fontSize: '0.8rem'
                          }}
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#c44536',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;