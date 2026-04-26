import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';

const ComplaintDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get complaint ID from URL
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use useCallback to memoize the fetch function
  const fetchComplaintDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/complaints/${id}`);
      setComplaint(response.data.data);
    } catch (error) {
      console.error('Error fetching complaint:', error);
      toast.error('Failed to load complaint details');
      navigate('/complaint-status');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchComplaintDetails();
  }, [fetchComplaintDetails]); // Now includes the dependency

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

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="loader">Loading complaint details...</div>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>Complaint not found</h3>
            <button className="btn-primary" onClick={() => navigate('/complaint-status')}>
              Back to Complaints
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          {/* Header with back button */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <button 
              onClick={() => navigate('/complaint-status')}
              style={{ 
                background: 'none', 
                border: 'none', 
                fontSize: '1.2rem', 
                cursor: 'pointer',
                marginRight: '1rem',
                color: '#0b2f4e'
              }}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h2 style={{ color: '#0b2f4e', margin: 0 }}>
              Complaint Details
            </h2>
          </div>

          {/* Main complaint card */}
          <div className="card" style={{ padding: '2rem' }}>
            {/* Header with ID and status */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid #eef4f8',
              paddingBottom: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <h3 style={{ color: '#0b2f4e', margin: 0 }}>
                  #{complaint._id.slice(-8)}
                </h3>
                <p style={{ color: '#5f7d95', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                  Raised on {formatDate(complaint.createdAt)}
                </p>
              </div>
              <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                {getStatusText(complaint.status)}
              </span>
            </div>

            {/* Two column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              {/* Left column - Details */}
              <div>
                <h4 style={{ color: '#0b2f4e', marginBottom: '1rem' }}>
                  <i className="fas fa-info-circle"></i> Issue Details
                </h4>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#2e4c64' }}>Title</label>
                  <p style={{ marginTop: '0.3rem' }}>{complaint.title}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#2e4c64' }}>Category</label>
                  <p style={{ marginTop: '0.3rem' }}>
                    <i className={`fas ${getCategoryIcon(complaint.category)}`} style={{ marginRight: '5px' }}></i>
                    {complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#2e4c64' }}>Location</label>
                  <p style={{ marginTop: '0.3rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '5px' }}></i>
                    {complaint.location} {complaint.roomNumber && `- ${complaint.roomNumber}`}
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ fontWeight: 'bold', color: '#2e4c64' }}>Description</label>
                  <p style={{ 
                    marginTop: '0.3rem', 
                    background: '#f8fafc', 
                    padding: '1rem', 
                    borderRadius: '8px',
                    lineHeight: '1.6'
                  }}>
                    {complaint.description}
                  </p>
                </div>
              </div>

              {/* Right column - Status and AI Info */}
              <div>
                <h4 style={{ color: '#0b2f4e', marginBottom: '1rem' }}>
                  <i className="fas fa-chart-bar"></i> Status Information
                </h4>

                <div style={{ 
                  background: '#f8fafc', 
                  padding: '1.5rem', 
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: '#2e4c64' }}>Priority:</span>
                    <span style={{ color: getPriorityColor(complaint.priority), fontWeight: 'bold' }}>
                      {complaint.priority.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: '#2e4c64' }}>Status:</span>
                    <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                      {getStatusText(complaint.status)}
                    </span>
                  </div>

                  {complaint.assignedTo && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{ color: '#2e4c64' }}>Assigned to:</span>
                      <span>Staff Member</span>
                    </div>
                  )}

                  {complaint.resolvedAt && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#2e4c64' }}>Resolved on:</span>
                      <span>{formatDate(complaint.resolvedAt)}</span>
                    </div>
                  )}
                </div>

                {/* AI Classification Section */}
                {complaint.aiClassification && (
                  <div className="ml-prediction" style={{ marginTop: '1rem' }}>
                    <h5 style={{ color: '#0b2f4e', marginBottom: '1rem' }}>
                      <i className="fas fa-robot"></i> AI Analysis
                    </h5>
                    <div>
                      <span className="prediction-badge">
                        <i className="fas fa-tag"></i> Dept: {complaint.aiClassification.department}
                      </span>
                      <span className="prediction-badge">
                        <i className="fas fa-chart-line"></i> Confidence: {complaint.aiClassification.confidence}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Resolution Notes (if resolved) */}
                {complaint.resolutionNotes && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <h5 style={{ color: '#0b2f4e', marginBottom: '0.5rem' }}>
                      <i className="fas fa-check-circle"></i> Resolution Notes
                    </h5>
                    <p style={{ 
                      background: '#e8f5e9', 
                      padding: '1rem', 
                      borderRadius: '8px',
                      color: '#2e7d32'
                    }}>
                      {complaint.resolutionNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ 
              marginTop: '2rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid #eef4f8',
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end'
            }}>
              <button 
                className="btn-outline" 
                onClick={() => navigate('/complaint-status')}
              >
                Back to List
              </button>
              {complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
                <button 
                  className="btn-primary"
                  onClick={() => toast.success('Feature coming soon!')}
                >
                  <i className="fas fa-comment"></i> Add Update
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;