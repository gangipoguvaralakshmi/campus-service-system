import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchStaff();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await api.get('/complaints');
      setComplaints(response.data.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await api.get('/users/staff');
      setStaff(response.data.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const assignComplaint = async (complaintId, staffId) => {
    try {
      const response = await api.patch(`/complaints/${complaintId}/assign`, { staffId });
      
      if (response.data.success) {
        toast.success('Complaint assigned successfully');
        fetchComplaints(); // Refresh the list
        setShowAssignModal(false);
        setSelectedComplaint(null);
      }
    } catch (error) {
      console.error('Error assigning complaint:', error);
      toast.error(error.response?.data?.message || 'Failed to assign complaint');
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

  const AssignModal = ({ complaint, onClose }) => {
    const [selectedStaff, setSelectedStaff] = useState('');
    const [assigning, setAssigning] = useState(false);

    const handleAssign = async () => {
      if (!selectedStaff) {
        toast.error('Please select a staff member');
        return;
      }
      setAssigning(true);
      await assignComplaint(complaint._id, selectedStaff);
      setAssigning(false);
      onClose();
    };

    // Filter staff by department if complaint has category
    const filteredStaff = complaint.category 
      ? staff.filter(s => !s.department || s.department === complaint.category || s.department === 'other')
      : staff;

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
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '20px',
          width: '90%',
          maxWidth: '500px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <h3 style={{ color: '#0b2f4e', marginBottom: '1rem' }}>
            Assign Complaint
          </h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Complaint:</strong> {complaint.title}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Category:</strong> {complaint.category}
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Priority:</strong> <span style={{ color: getPriorityColor(complaint.priority) }}>{complaint.priority.toUpperCase()}</span>
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Location:</strong> {complaint.location} {complaint.roomNumber}
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Select Staff Member
            </label>
            <select
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem',
                border: '2px solid #dfe9f0',
                borderRadius: '10px',
                fontSize: '1rem'
              }}
            >
              <option value="">Choose staff...</option>
              {filteredStaff.map(s => (
                <option key={s._id} value={s._id}>
                  {s.name} - {s.department || 'General'} ({s.contactNumber})
                </option>
              ))}
            </select>
            {filteredStaff.length === 0 && (
              <p style={{ color: '#c44536', marginTop: '0.5rem' }}>
                No staff available for this category
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button 
              className="btn-secondary" 
              onClick={onClose}
              disabled={assigning}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleAssign}
              disabled={assigning || filteredStaff.length === 0}
            >
              {assigning ? 'Assigning...' : 'Assign Complaint'}
            </button>
          </div>
        </div>
      </div>
    );
  };

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2><i className="fas fa-clipboard-list"></i> Manage Complaints</h2>
          <button className="btn-primary" onClick={() => navigate('/admin-analytics')}>
            <i className="fas fa-chart-bar"></i> View Analytics
          </button>
        </div>

        <div className="card">
          {complaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#5f7d95' }}>
              <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
              <h3>No complaints found</h3>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="complaint-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Category</th>
                    <th>Title</th>
                    <th>Raised By</th>
                    <th>Date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td>#{complaint._id.slice(-6)}</td>
                      <td>
                        <i className={`fas ${getCategoryIcon(complaint.category)}`} style={{ marginRight: '5px' }}></i>
                        {complaint.category}
                      </td>
                      <td>{complaint.title}</td>
                      <td>{complaint.raisedBy?.name || 'Unknown'}</td>
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
                        {complaint.assignedTo ? (
                          <span style={{ color: '#27ae60' }}>
                            <i className="fas fa-check-circle"></i> Assigned
                          </span>
                        ) : (
                          <span style={{ color: '#c44536' }}>Unassigned</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {!complaint.assignedTo && (
                            <button 
                              className="btn-primary"
                              style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem' }}
                              onClick={() => {
                                setSelectedComplaint(complaint);
                                setShowAssignModal(true);
                              }}
                            >
                              Assign
                            </button>
                          )}
                          <button 
                            className="btn-outline"
                            style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem' }}
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

      {showAssignModal && selectedComplaint && (
        <AssignModal 
          complaint={selectedComplaint} 
          onClose={() => {
            setShowAssignModal(false);
            setSelectedComplaint(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminComplaints;