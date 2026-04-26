import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    registrationId: '',
    contactNumber: '',
    department: '',
    photo: null
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        toast.error('Please upload an image file');
        return;
      }

      setFormData({
        ...formData,
        photo: file
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.contactNumber) {
      toast.error('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.contactNumber)) {
      toast.error('Please enter a valid 10-digit contact number');
      return false;
    }

    if (formData.role === 'staff' && !formData.department) {
      toast.error('Please select a department for staff');
      return false;
    }

    return true;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  
  try {
    const { confirmPassword, ...registrationData } = formData;
    
    console.log('1. Registering user:', registrationData);
    
    const response = await api.post('/auth/register', registrationData);
    console.log('2. Registration response:', response.data);
    
    const { token, user } = response.data;
    
    // Save token to localStorage
    localStorage.setItem('token', token);
    console.log('3. Token saved to localStorage:', token);
    
    // Set authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('4. Authorization header set');
    
    toast.success('Registration successful!');
    console.log('5. Toast shown');
    
    console.log('6. User role:', user.role);
    
    // Small delay to ensure state updates
    setTimeout(() => {
      // Redirect based on role
      if (user.role === 'admin') {
        console.log('7. Redirecting to admin dashboard');
        window.location.href = '/admin-dashboard';
      } else if (user.role === 'staff') {
        console.log('7. Redirecting to staff dashboard');
        window.location.href = '/staff-dashboard';
      } else {
        console.log('7. Redirecting to student dashboard');
        window.location.href = '/dashboard';
      }
    }, 100);
    
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    toast.error(error.response?.data?.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(145deg, #f0f7fc 0%, #e4edf5 100%)',
      padding: '2rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1200px',
        background: 'white',
        borderRadius: '40px',
        boxShadow: '0 25px 50px -10px rgba(11,47,78,0.15)',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}>
          {/* Left Panel - Image/Info Section */}
          <div style={{
            flex: '1 1 40%',
            background: '#0B2F4E',
            padding: '3rem',
            color: 'white',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '0.5rem 1rem',
                borderRadius: '40px',
                display: 'inline-block',
                fontSize: '0.9rem'
              }}>
                <i className="fas fa-robot" style={{ marginRight: '8px' }}></i> JOIN OUR COMMUNITY
              </span>
            </div>
            
            <h1 style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '2.5rem',
              lineHeight: 1.2,
              marginBottom: '1.5rem'
            }}>
              Create Your<br />Account<span style={{ color: '#FFD966' }}> Today</span>
            </h1>
            
            <p style={{ opacity: 0.9, lineHeight: 1.6, marginBottom: '2rem', fontSize: '1.1rem' }}>
              Join thousands of students and staff members who are already using our AI-powered campus service management system.
            </p>
            
            <ul style={{
              listStyle: 'none',
              marginBottom: '2rem'
            }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#FFD966', fontSize: '1.2rem' }}></i>
                <span>Quick complaint registration</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#FFD966', fontSize: '1.2rem' }}></i>
                <span>AI-powered classification</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#FFD966', fontSize: '1.2rem' }}></i>
                <span>Real-time status tracking</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <i className="fas fa-check-circle" style={{ color: '#FFD966', fontSize: '1.2rem' }}></i>
                <span>24/7 support system</span>
              </li>
            </ul>
            
            <div style={{ marginTop: 'auto' }}>
              <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>
                <i className="fas fa-shield-alt"></i> Your information is secure with us
              </p>
            </div>
          </div>

          {/* Right Panel - Registration Form */}
          <div style={{
            flex: '1 1 60%',
            background: 'white',
            padding: '3rem'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ color: '#0B2F4E', fontSize: '2rem', marginBottom: '0.5rem' }}>
                Sign Up
              </h2>
              <p style={{ color: '#5f7d95' }}>Fill in your details to create an account</p>
            </div>
            
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}>
                {/* Photo Upload Field - Full Width */}
                <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                  <label>Profile Photo</label>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem',
                    marginTop: '0.5rem',
                    flexWrap: 'wrap'
                  }}>
                    {/* Photo Preview */}
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: '#f0f7fc',
                      border: '3px solid #FFD966',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      {photoPreview ? (
                        <img 
                          src={photoPreview} 
                          alt="Preview" 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover' 
                          }} 
                        />
                      ) : (
                        <i className="fas fa-user" style={{ fontSize: '3rem', color: '#0B2F4E', opacity: 0.3 }}></i>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div>
                      <input
                        type="file"
                        id="photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById('photo').click()}
                        style={{
                          background: 'white',
                          border: '2px solid #0B2F4E',
                          color: '#0B2F4E',
                          padding: '0.8rem 2rem',
                          borderRadius: '50px',
                          fontSize: '1rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#0B2F4E';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'white';
                          e.target.style.color = '#0B2F4E';
                        }}
                      >
                        <i className="fas fa-camera" style={{ marginRight: '0.5rem' }}></i>
                        Choose Photo
                      </button>
                      <p style={{ fontSize: '0.8rem', color: '#5f7d95', marginTop: '0.5rem' }}>
                        Max size: 5MB. Supported: JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                </div>

                {/* Name Field */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Full Name <span style={{ color: '#c44536' }}>*</span></label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Email Field */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Email <span style={{ color: '#c44536' }}>*</span></label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Contact Number Field */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Contact Number <span style={{ color: '#c44536' }}>*</span></label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Role Selection */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>I am registering as: <span style={{ color: '#c44536' }}>*</span></label>
                  <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={formData.role === 'student'}
                        onChange={handleChange}
                      /> Student
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="radio"
                        name="role"
                        value="staff"
                        checked={formData.role === 'staff'}
                        onChange={handleChange}
                      /> Staff
                    </label>
                  </div>
                </div>

                {/* Registration/Employee ID */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>
                    {formData.role === 'student' ? 'Registration/Roll Number' : 'Employee ID'}
                    {formData.role === 'staff' && <span style={{ color: '#c44536' }}> *</span>}
                  </label>
                  <input
                    type="text"
                    name="registrationId"
                    value={formData.registrationId}
                    onChange={handleChange}
                    placeholder={formData.role === 'student' ? 'Enter your roll number (optional)' : 'Enter your employee ID'}
                    required={formData.role === 'staff'}
                    style={{ width: '100%' }}
                  />
                  {formData.role === 'student' && (
                    <small style={{ color: '#5f7d95' }}>Optional for students</small>
                  )}
                </div>

                {/* Department (for staff only) */}
                {formData.role === 'staff' && (
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Department <span style={{ color: '#c44536' }}>*</span></label>
                    <select name="department" value={formData.department} onChange={handleChange} required style={{ width: '100%' }}>
                      <option value="">Select Department</option>
                      <option value="electrical">Electrical</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="hostel">Hostel</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="canteen">Canteen</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                )}

                {/* Password */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Password <span style={{ color: '#c44536' }}>*</span></label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 6 characters"
                    minLength="6"
                    required
                    style={{ width: '100%' }}
                  />
                </div>

                {/* Confirm Password */}
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Confirm Password <span style={{ color: '#c44536' }}>*</span></label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    minLength="6"
                    required
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '2rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    padding: '1rem',
                    fontSize: '1.1rem',
                    background: '#0B2F4E',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = '#FFD966';
                      e.target.style.color = '#0B2F4E';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = '#0B2F4E';
                      e.target.style.color = 'white';
                    }
                  }}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i> Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i> Sign Up
                    </>
                  )}
                </button>
              </div>
            </form>

           {/* Login Link */}
<div style={{ textAlign: 'center', marginTop: '2rem' }}>
  <p style={{ color: '#5f7d95' }}>
    Already have an account?{' '}
    <Link to="/login" style={{ color: '#0b2f4e', fontWeight: '600', textDecoration: 'none' }}>
      Login here
    </Link>
  </p>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;