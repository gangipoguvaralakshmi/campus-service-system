import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import api from '../services/api';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
// eslint-disable-next-line no-unused-vars
import { Pie, Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching analytics stats...');
      
      const response = await api.get('/complaints/stats');
      console.log('Stats response:', response.data);
      
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError('Failed to load statistics');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || 'Failed to load analytics');
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for category chart
  const getCategoryChartData = () => {
    if (!stats?.byCategory || stats.byCategory.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          label: 'Number of Complaints',
          data: [0],
          backgroundColor: ['#ccc'],
        }]
      };
    }

    return {
      labels: stats.byCategory.map(item => 
        item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unknown'
      ),
      datasets: [
        {
          label: 'Number of Complaints',
          data: stats.byCategory.map(item => item.count || 0),
          backgroundColor: [
            '#0b2f4e',
            '#ffd966',
            '#c44536',
            '#27ae60',
            '#f39c12',
            '#3498db'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for priority chart
  const getPriorityChartData = () => {
    if (!stats?.byPriority || stats.byPriority.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [{
          data: [1],
          backgroundColor: ['#ccc'],
        }]
      };
    }

    return {
      labels: stats.byPriority.map(item => 
        item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Unknown'
      ),
      datasets: [
        {
          data: stats.byPriority.map(item => item.count || 0),
          backgroundColor: [
            '#c44536', // high - red
            '#f39c12', // medium - orange
            '#27ae60', // low - green
            '#3498db', // urgent - blue
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Complaints by Category',
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Complaints by Priority',
      },
    },
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="loader">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', color: '#c44536', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#c44536' }}>Error Loading Analytics</h3>
            <p style={{ color: '#5f7d95', marginBottom: '2rem' }}>{error}</p>
            <button className="btn-primary" onClick={fetchStats}>
              <i className="fas fa-sync"></i> Try Again
            </button>
            <button 
              className="btn-outline" 
              style={{ marginLeft: '1rem' }}
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
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
        <div className="admin-header">
          <h2><i className="fas fa-chart-scatter" style={{ color: '#0b2f4e' }}></i> Administration Analytics</h2>
          <span className="badge-future">
            <i className="fas fa-rocket"></i> Future Scope: Deep Learning + IoT
          </span>
        </div>
        
        {/* Stats Cards */}
        <div className="grid-4">
          <div className="metric">
            <h6>Total Complaints</h6>
            <div className="big">{stats?.total || 0}</div>
            <span>All time</span>
          </div>
          <div className="metric">
            <h6>Pending</h6>
            <div className="big">{stats?.pending || 0}</div>
            <span style={{ color: '#c44536' }}>Awaiting action</span>
          </div>
          <div className="metric">
            <h6>In Progress</h6>
            <div className="big">{stats?.inProgress || 0}</div>
            <span style={{ color: '#f39c12' }}>Being worked on</span>
          </div>
          <div className="metric">
            <h6>Resolved</h6>
            <div className="big">{stats?.resolved || 0}</div>
            <span style={{ color: '#27ae60' }}>Completed</span>
          </div>
        </div>

        {/* Charts Row */}
        <div className="chart-row">
          <div className="chart-card">
            <h4 style={{ color: '#0b2f4e', marginBottom: '1rem' }}>
              <i className="fas fa-chart-bar"></i> Complaints by Category
            </h4>
            <div style={{ height: '300px' }}>
              <Bar data={getCategoryChartData()} options={barOptions} />
            </div>
          </div>
          
          <div className="chart-card">
            <h4 style={{ color: '#0b2f4e', marginBottom: '1rem' }}>
              <i className="fas fa-chart-pie"></i> Priority Distribution
            </h4>
            <div style={{ height: '300px' }}>
              <Doughnut data={getPriorityChartData()} options={pieOptions} />
            </div>
          </div>
        </div>

        {/* Department Performance */}
        {stats?.byCategory && stats.byCategory.length > 0 && (
          <div className="card" style={{ marginTop: '2rem' }}>
            <h4 style={{ color: '#0b2f4e', marginBottom: '1.5rem' }}>
              <i className="fas fa-tachometer-alt"></i> Department Performance
            </h4>
            <div className="dept-stats">
              {stats.byCategory.map((item, index) => (
                <div key={item._id || index}>
                  <div className="dept-item">
                    <span>
                      <i className={`fas fa-${
                        item._id === 'electrical' ? 'bolt' :
                        item._id === 'plumbing' ? 'water' :
                        item._id === 'hostel' ? 'bed' :
                        item._id === 'maintenance' ? 'brush' :
                        item._id === 'canteen' ? 'utensils' : 'tag'
                      }`} style={{ marginRight: '8px' }}></i>
                      {item._id ? item._id.charAt(0).toUpperCase() + item._id.slice(1) : 'Other'}
                    </span>
                    <span>{item.count || 0} complaints</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: stats.total > 0 ? `${((item.count || 0) / stats.total * 100).toFixed(1)}%` : '0%',
                        background: index === 0 ? '#0b2f4e' : 
                                   index === 1 ? '#ffd966' :
                                   index === 2 ? '#c44536' :
                                   index === 3 ? '#27ae60' : '#3498db'
                      }}
                    ></div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#5f7d95', marginTop: '0.2rem' }}>
                    {stats.total > 0 ? ((item.count || 0) / stats.total * 100).toFixed(1) : 0}% of total
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Performance Metrics */}
        <div className="row-split" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h4 style={{ color: '#0b2f4e', marginBottom: '1rem' }}>
              <i className="fas fa-robot"></i> AI Performance
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#27ae60' }}>94%</div>
                <div style={{ color: '#5f7d95' }}>Accuracy</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0b2f4e' }}>2.3m</div>
                <div style={{ color: '#5f7d95' }}>Avg Response</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f39c12' }}>87%</div>
                <div style={{ color: '#5f7d95' }}>Satisfaction</div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h4 style={{ color: '#0b2f4e', marginBottom: '1rem' }}>
              <i className="fas fa-microchip"></i> Smart Campus Index
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexDirection: 'column' }}>
              <div style={{ width: '100%' }}>
                <div className="progress-bar" style={{ height: '20px', background: '#eef4f8' }}>
                  <div className="progress-fill" style={{ width: '82%', height: '20px' }}></div>
                </div>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0b2f4e' }}>82/100</span>
            </div>
            <p style={{ color: '#5f7d95', marginTop: '1rem' }}>
              <i className="fas fa-chart-line"></i> +12% from last month
            </p>
          </div>
        </div>

        {/* Future Scope Section */}
        <div className="iot-section" style={{ marginTop: '2rem' }}>
          <div>
            <h3 style={{ color: '#0b2f4e' }}>
              <i className="fas fa-microchip"></i> IoT Integration (Future Scope)
            </h3>
            <p style={{ color: '#2e4c64', marginTop: '0.5rem' }}>
              Automatic fault detection · Smart sensors · Real-time alerts · Predictive maintenance
            </p>
          </div>
          <div>
            <span style={{ background: '#0b2f4e', color: 'white', padding: '0.5rem 1.2rem', borderRadius: '30px' }}>
              Coming Soon
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          <button 
            className="btn-primary" 
            style={{ marginLeft: '1rem' }}
            onClick={fetchStats}
          >
            <i className="fas fa-sync"></i> Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;