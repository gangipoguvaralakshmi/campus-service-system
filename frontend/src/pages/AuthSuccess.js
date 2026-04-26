import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthSuccess = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const redirect = params.get('redirect');

    if (token && userStr) {
      try {
        // Save token immediately
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Show success toast
        toast.success('Login successful!');
        
        // Hard redirect immediately
        window.location.href = redirect || '/dashboard';
      } catch (error) {
        console.error('Auth error:', error);
        window.location.href = '/login';
      }
    } else {
      window.location.href = '/login';
    }
  }, [location]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #dde8f0 0%, #c8dcea 50%, #d8e9f4 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #0B2F4E',
          borderTopColor: '#FFD966',
          borderRadius: '50%',
          margin: '0 auto 1rem',
          animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ color: '#0B2F4E' }}>Completing authentication...</h3>
        <p style={{ color: '#5f7d95' }}>Please wait...</p>
      </div>
      
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthSuccess;