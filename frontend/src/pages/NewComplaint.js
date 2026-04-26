import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';

const NewComplaint = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'electrical',
    location: 'hostel-a',
    description: '',
    roomNumber: ''
  });
  
  const [prediction, setPrediction] = useState({
    category: 'electrical',
    priority: 'medium',
    confidence: '0',
    department: 'Electrician'
  });

  // Simulate AI prediction based on description
  const analyzeDescription = (text) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('fan') || lowerText.includes('light') || lowerText.includes('power') || 
        lowerText.includes('socket') || lowerText.includes('electr') || lowerText.includes('switch')) {
      setPrediction({
        category: 'electrical',
        priority: 'high',
        confidence: '96',
        department: 'Electrician'
      });
    } else if (lowerText.includes('water') || lowerText.includes('pipe') || lowerText.includes('leak') || 
               lowerText.includes('tap') || lowerText.includes('plumb') || lowerText.includes('drain')) {
      setPrediction({
        category: 'plumbing',
        priority: 'high',
        confidence: '93',
        department: 'Plumber'
      });
    } else if (lowerText.includes('hostel') || lowerText.includes('warden') || lowerText.includes('room') || 
               lowerText.includes('bed') || lowerText.includes('mess') || lowerText.includes('canteen')) {
      setPrediction({
        category: 'hostel',
        priority: 'medium',
        confidence: '88',
        department: 'Warden'
      });
    } else if (lowerText.includes('clean') || lowerText.includes('garden') || lowerText.includes('furniture') || 
               lowerText.includes('floor') || lowerText.includes('wall') || lowerText.includes('paint')) {
      setPrediction({
        category: 'maintenance',
        priority: 'low',
        confidence: '85',
        department: 'Maintenance'
      });
    } else {
      setPrediction({
        category: 'other',
        priority: 'medium',
        confidence: '79',
        department: 'General Services'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'description') {
      analyzeDescription(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add AI prediction to form data
      const complaintData = {
        ...formData,
        aiClassification: {
          category: prediction.category,
          priority: prediction.priority,
          confidence: prediction.confidence,
          department: prediction.department
        }
      };
      
      const response = await api.post('/complaints', complaintData);
      console.log('Complaint created:', response.data);
      
      toast.success('Complaint submitted successfully!');
      
      // Redirect to status page after 2 seconds
      setTimeout(() => {
        navigate('/complaint-status');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating complaint:', error);
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="complaint-container">
          <h2>
            <i className="fas fa-robot" style={{ color: '#0b2f4e', marginRight: '10px' }}></i> 
            Raise Service Request
          </h2>
          <p style={{ color: '#5f7d95', marginBottom: '2rem' }}>
            Describe your issue - AI will automatically classify and route it
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief title of the issue"
                required
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="hostel">Hostel</option>
                <option value="maintenance">Maintenance</option>
                <option value="canteen">Canteen</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Location</label>
              <select name="location" value={formData.location} onChange={handleChange}>
                <option value="hostel-a">Hostel Block A</option>
                <option value="hostel-b">Hostel Block B</option>
                <option value="hostel-c">Hostel Block C</option>
                <option value="academic">Academic Block</option>
                <option value="library">Library</option>
                <option value="canteen">Canteen</option>
                <option value="sports">Sports Complex</option>
              </select>
            </div>

            <div className="form-group">
              <label>Room / Office Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                placeholder="e.g., Room 204, Office 101"
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description"
                rows="5" 
                placeholder="Describe your issue in detail..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            {formData.description && (
              <div className="ml-prediction">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                  <i className="fas fa-magic" style={{ color: '#0b2f4e', fontSize: '1.2rem' }}></i>
                  <strong style={{ color: '#0b2f4e' }}>AI Analysis Result</strong>
                  <span style={{ background: '#0b2f4e', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem' }}>
                    scikit-learn · NLTK
                  </span>
                </div>
                <div>
                  <span className="prediction-badge">
                    <i className={`fas fa-${prediction.category === 'electrical' ? 'bolt' : 
                      prediction.category === 'plumbing' ? 'water' :
                      prediction.category === 'hostel' ? 'bed' :
                      prediction.category === 'maintenance' ? 'brush' : 'tag'}`}>
                    </i> Department: {prediction.department}
                  </span>
                  <span className="prediction-badge">
                    <i className="fas fa-flag"></i> Priority: {prediction.priority.charAt(0).toUpperCase() + prediction.priority.slice(1)}
                  </span>
                  <span className="prediction-badge">
                    <i className="fas fa-chart-line"></i> Confidence: {prediction.confidence}%
                  </span>
                </div>
              </div>
            )}
            
            <div className="btn-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : (
                  <>
                    <i className="fas fa-paper-plane"></i> Submit Complaint
                  </>
                )}
              </button>
              <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewComplaint;