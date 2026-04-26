import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    fetchAssignedComplaints();
  }, []);

  const fetchAssignedComplaints = async () => {
    try {
      setLoading(true);
      // This endpoint will need to be created in backend
      const response = await api.get('/complaints/assigned-to-me');
      const complaints = response.data.data;
      setAssignedComplaints(complaints);
      
      // Calculate stats
      setStats({
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress' || c.status === 'assigned').length,
        resolved: complaints.filter(c => c.status === 'resolved').length
      });
    } catch (error) {
      console.error('Error fetching assigned complaints:', error);
      toast.error('Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (complaintId, newStatus, resolutionNotes = '') => {
    try {
      await api.patch(`/complaints/${complaintId}/status`, { 
        status: newStatus,
        resolutionNotes 
      });
      
      toast.success(`Status updated to ${newStatus}`);
      fetchAssignedComplaints(); // Refresh the list
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
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

  const StatusUpdateModal = ({ complaint, onClose }) => {
    const [status, setStatus] = useState(complaint.status);
    const [notes, setNotes] = useState('');
    const [updating, setUpdating] = useState(false);

    const handleSubmit = async () => {
      setUpdating(true);
      await updateStatus(complaint._id, status, notes);
      setUpdating(false);
      onClose();
    };

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '500px'
        }}>
          <h3 style={{ color: '#0b2f4e', marginBottom: '1rem' }}>
            Update Status
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Status
            </label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #dfe9f0',
                borderRadius: '10px'
              }}
            >
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Resolution Notes
            </label>
            <textarea
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about the resolution..."
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #dfe9f0',
                borderRadius: '10px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button 
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className="btn-primary"
              onClick={handleSubmit}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [selectedComplaint, setSelectedComplaint] = useState(null);

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="loader">Loading assigned complaints...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat">
            <div className="stat-left">
              <h4>Total Assigned</h4>
              <div className="number">{stats.total}</div>
            </div>
            <div className="stat-icon"><i className="fas fa-clipboard-list"></i></div>
          </div>
          <div className="stat">
            <div className="stat-left">
              <h4>Pending</h4>
              <div className="number">{stats.pending}</div>
            </div>
            <div className="stat-icon"><i className="fas fa-clock"></i></div>
          </div>
          <div className="stat">
            <div className="stat-left">
              <h4>In Progress</h4>
              <div className="number">{stats.inProgress}</div>
            </div>
            <div className="stat-icon"><i className="fas fa-rotate"></i></div>
          </div>
          <div className="stat">
            <div className="stat-left">
              <h4>Resolved</h4>
              <div className="number">{stats.resolved}</div>
            </div>
            <div className="stat-icon"><i className="fas fa-check-circle"></i></div>
          </div>
        </div>

        {/* Assigned Complaints */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>
            <i className="fas fa-tasks"></i> Assigned Complaints
          </h3>

          {assignedComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#5f7d95' }}>
              <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <h3>No complaints assigned</h3>
              <p>You don't have any complaints assigned to you yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Location</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedComplaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td>#{complaint._id.slice(-6)}</td>
                      <td>
                        <i className={`fas ${getCategoryIcon(complaint.category)}`} style={{ marginRight: '5px' }}></i>
                        {complaint.category}
                      </td>
                      <td>{complaint.title}</td>
                      <td>{complaint.location} {complaint.roomNumber}</td>
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
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button 
                            className="btn-primary"
                            style={{ padding: '0.3rem 1rem', fontSize: '0.9rem' }}
                            onClick={() => setSelectedComplaint(complaint)}
                          >
                            Update
                          </button>
                          <button 
                            className="btn-outline"
                            style={{ padding: '0.3rem 1rem', fontSize: '0.9rem' }}
                            onClick={() => navigate(`/complaint-details/${complaint._id}`)}
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedComplaint && (
        <StatusUpdateModal 
          complaint={selectedComplaint} 
          onClose={() => setSelectedComplaint(null)} 
        />
      )}
    </div>
  );
};

export default StaffDashboard;