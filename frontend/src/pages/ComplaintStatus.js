import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';

const ComplaintStatus = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/complaints/my-complaints');
      setComplaints(response.data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'assigned': return 'status-progress';
      case 'in-progress': return 'status-progress';
      case 'resolved': return 'status-resolved';
      case 'rejected': return 'status-pending';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Pending';
      case 'assigned': return 'Assigned';
      case 'in-progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'rejected': return 'Rejected';
      default: return status;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return '#c44536';
      case 'medium': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#666';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'electrical': return 'fa-bolt';
      case 'plumbing': return 'fa-water';
      case 'hostel': return 'fa-bed';
      case 'maintenance': return 'fa-brush';
      case 'canteen': return 'fa-utensils';
      default: return 'fa-tag';
    }
  };

  const filteredComplaints = filter === 'All' 
    ? complaints 
    : complaints.filter(c => {
        if (filter === 'Open') return c.status === 'pending';
        if (filter === 'In Progress') return c.status === 'assigned' || c.status === 'in-progress';
        if (filter === 'Resolved') return c.status === 'resolved';
        return true;
      });

  const filters = ['All', 'Open', 'In Progress', 'Resolved'];

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="loader">Loading complaints...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="status-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2><i className="fas fa-list-check" style={{ marginRight: '10px' }}></i> My Service Requests</h2>
            <button 
              className="btn-primary" 
              onClick={() => navigate('/new-complaint')}
              style={{ padding: '0.5rem 1rem' }}
            >
              <i className="fas fa-plus"></i> New Complaint
            </button>
          </div>
          
          <div className="filter-tabs">
            {filters.map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          
          {filteredComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#5f7d95' }}>
              <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <h3>No complaints found</h3>
              <p>Raise your first complaint to get started</p>
              <button 
                className="btn-primary" 
                onClick={() => navigate('/new-complaint')}
                style={{ marginTop: '1rem' }}
              >
                Raise Complaint
              </button>
            </div>
          ) : (
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint._id}>
                    <td>#{complaint._id.slice(-6)}</td>
                    <td>
                      <i className={`fas ${getCategoryIcon(complaint.category)}`} style={{ marginRight: '5px' }}></i> 
                      {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}
                    </td>
                    <td>{complaint.title || complaint.description.substring(0, 30)}...</td>
                    <td>{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span style={{ color: getPriorityColor(complaint.priority), fontWeight: 'bold' }}>
                        {complaint.priority.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                        {getStatusText(complaint.status)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-track" 
                        onClick={() => navigate(`/complaint-details/${complaint._id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button className="btn-back" onClick={() => navigate('/dashboard')}>
              <i className="fas fa-arrow-left"></i> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintStatus;