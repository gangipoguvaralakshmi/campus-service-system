import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
 
const injectStyles = () => {
  if (document.getElementById('login-styles')) return;
  const s = document.createElement('style');
  s.id = 'login-styles';
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
 
    *, *::before, *::after { box-sizing: border-box; }
 
    @keyframes cardIn {
      from { opacity:0; transform:translateY(32px) scale(0.97); }
      to   { opacity:1; transform:translateY(0) scale(1); }
    }
    @keyframes panelIn {
      from { opacity:0; transform:translateX(-24px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes formIn {
      from { opacity:0; transform:translateX(24px); }
      to   { opacity:1; transform:translateX(0); }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse {
      0%,100% { transform:scale(1); opacity:0.7; }
      50%     { transform:scale(1.18); opacity:0.2; }
    }
    @keyframes countUp {
      from { opacity:0; transform:translateY(8px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes orb {
      0%,100% { transform:translate(0,0); }
      33%      { transform:translate(20px,-15px); }
      66%      { transform:translate(-15px,12px); }
    }
    @keyframes lineGrow {
      from { width: 0; }
      to   { width: 100%; }
    }
 
    .login-wrap {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #dde8f0 0%, #c8dcea 50%, #d8e9f4 100%);
      font-family: 'DM Sans', sans-serif;
      position: relative;
      overflow: hidden;
    }
    .login-wrap::before {
      content: '';
      position: absolute;
      width: 500px; height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(11,47,78,0.1) 0%, transparent 70%);
      top: -150px; left: -100px;
      animation: orb 12s ease-in-out infinite;
    }
    .login-wrap::after {
      content: '';
      position: absolute;
      width: 400px; height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,217,102,0.18) 0%, transparent 70%);
      bottom: -100px; right: -80px;
      animation: orb 10s ease-in-out 2s infinite reverse;
    }
 
    .login-card {
      display: flex;
      width: 100%;
      max-width: 860px;
      min-height: 540px;
      background: white;
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 0 40px 100px -15px rgba(11,47,78,0.25), 0 0 0 1px rgba(255,255,255,0.9);
      position: relative;
      z-index: 1;
      animation: cardIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
    }
 
    .left-panel {
      width: 42%;
      flex-shrink: 0;
      background: #0B2F4E;
      padding: 2.4rem 2rem;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      animation: panelIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both;
    }
    .left-panel::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px);
      pointer-events: none;
    }
    .left-panel::after {
      content: '';
      position: absolute;
      width: 220px; height: 220px;
      border-radius: 50%;
      background: rgba(255,217,102,0.06);
      bottom: -60px; right: -60px;
      pointer-events: none;
    }
 
    .uni-logo-wrap {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }
    .uni-logo-icon {
      width: 46px; height: 46px;
      background: #FFD966;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 6px 20px rgba(255,217,102,0.35);
      position: relative;
    }
    .uni-logo-icon::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 18px;
      border: 2px solid rgba(255,217,102,0.3);
      animation: pulse 2.5s ease-in-out infinite;
    }
 
    .divider-line {
      height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 1.6rem 0;
      position: relative;
      overflow: hidden;
    }
    .divider-line::after {
      content: '';
      position: absolute;
      left: 0; top: 0;
      height: 100%;
      background: linear-gradient(90deg, transparent, #FFD966, transparent);
      animation: lineGrow 2s ease 0.8s both;
      width: 100%;
    }
 
    .stat-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-bottom: 1.6rem;
    }
    .stat-card {
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 0.9rem 0.85rem;
      transition: background 0.2s;
      animation: countUp 0.5s ease both;
    }
    .stat-card:hover { background: rgba(255,255,255,0.1); }
    .stat-card:nth-child(1) { animation-delay: 0.4s; }
    .stat-card:nth-child(2) { animation-delay: 0.5s; }
    .stat-card:nth-child(3) { animation-delay: 0.6s; }
    .stat-card:nth-child(4) { animation-delay: 0.7s; }
 
    .feature-row {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      animation: fadeUp 0.4s ease both;
    }
    .feature-row:nth-child(1) { animation-delay: 0.8s; }
    .feature-row:nth-child(2) { animation-delay: 0.9s; }
    .feature-row:nth-child(3) { animation-delay: 1.0s; }
 
    .right-panel {
      flex: 1;
      padding: 2.4rem 2.2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      animation: formIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both;
    }
 
    .form-field { animation: fadeUp 0.4s ease both; }
    .form-field:nth-child(1) { animation-delay: 0.3s; }
    .form-field:nth-child(2) { animation-delay: 0.4s; }
    .form-field:nth-child(3) { animation-delay: 0.5s; }
    .form-field:nth-child(4) { animation-delay: 0.6s; }
    .form-field:nth-child(5) { animation-delay: 0.65s; }
    .form-field:nth-child(6) { animation-delay: 0.7s; }
    .form-field:nth-child(7) { animation-delay: 0.75s; }
 
    .login-input {
      width: 100%;
      padding: 0.75rem 0.9rem 0.75rem 2.8rem;
      background: #f6f9fc;
      border: 1.5px solid #e2eaf1;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      color: #0B2F4E;
      outline: none;
      transition: border-color 0.22s, box-shadow 0.22s, background 0.22s;
    }
    .login-input::placeholder { color: #a0b8c8; }
    .login-input:focus {
      border-color: #FFD966;
      background: #fffdf0;
      box-shadow: 0 0 0 3px rgba(255,217,102,0.2);
    }
 
    .btn-signin {
      width: 100%;
      padding: 0.85rem;
      background: #0B2F4E;
      color: white;
      border: none;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
      position: relative;
      overflow: hidden;
    }
    .btn-signin::after {
      content: '';
      position: absolute; inset: 0;
      background: linear-gradient(120deg, transparent 20%, rgba(255,217,102,0.2) 50%, transparent 80%);
      background-size: 200%;
      opacity: 0;
      transition: opacity 0.3s;
    }
    .btn-signin:hover:not(:disabled) {
      background: #0d3a5e;
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(11,47,78,0.28);
    }
    .btn-signin:hover:not(:disabled)::after { opacity:1; animation: shimmer 1.2s infinite; }
    .btn-signin:active:not(:disabled) { transform: translateY(0); }
    .btn-signin:disabled { opacity:0.6; cursor:not-allowed; }
 
    .btn-google {
      width: 100%;
      padding: 0.75rem;
      background: white;
      border: 1.5px solid #e2eaf1;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.88rem;
      font-weight: 500;
      color: #3a3a3a;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 0.6rem;
      transition: border-color 0.22s, box-shadow 0.22s, transform 0.18s;
    }
    .btn-google:hover:not(:disabled) {
      border-color: #FFD966;
      box-shadow: 0 0 0 3px rgba(255,217,102,0.18);
      transform: translateY(-1px);
    }
    .btn-google:disabled { opacity:0.6; cursor:not-allowed; }
 
    .demo-pill {
      display: inline-flex; align-items: center; gap: 0.35rem;
      padding: 4px 12px 4px 8px;
      border-radius: 99px;
      font-size: 0.72rem; font-weight: 700;
      text-transform: uppercase; letter-spacing: 0.04em;
      cursor: pointer; border: none;
      transition: transform 0.15s, box-shadow 0.15s;
      font-family: 'DM Sans', sans-serif;
    }
    .demo-pill:hover { transform: translateY(-1px); }
 
    @media (max-width: 640px) {
      .login-card { flex-direction: column; }
      .left-panel { width: 100%; min-height: unset; padding: 1.6rem; }
      .stat-grid { grid-template-columns: repeat(4, 1fr); }
    }
  `;
  document.head.appendChild(s);
};
 
const SVGIcon = ({ d, size = 16, color = '#8aa3b8', strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
 
const STATS = [
  { value: '12K+', label: 'Students',  icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { value: '400+', label: 'Faculty',   icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { value: '30+',  label: 'Programs',  icon: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z' },
  { value: '95%',  label: 'Placement', icon: 'M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3' },
];
 
const FEATURES = [
  { icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', text: 'Secure role-based access' },
  { icon: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7', text: 'Centralized academic records' },
  { icon: 'M18 8h1a4 4 0 0 1 0 8h-1 M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z M6 1v3 M10 1v3 M14 1v3', text: 'AI-powered support system' },
];
 
const DEMO_ACCOUNTS = [
  { role: 'Admin',   email: 'admin@rgukt.in',   pass: 'admin123',    color: '#e84a4a', bg: '#fff0f0' },
  { role: 'Staff',   email: 'staff@rgukt.in',   pass: 'staff123',    color: '#0d8f7b', bg: '#edfaf7' },
  { role: 'Student', email: 'student@rgukt.in', pass: 'password123', color: '#1a6fbf', bg: '#eef5ff' },
];
 
export default function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [gLoading, setGLoading] = useState(false);
  
  const location = useLocation();
 
  useEffect(() => { 
    injectStyles(); 
    
    // Check for messages from Google login
    const params = new URLSearchParams(location.search);
    const message = params.get('message');
    const email = params.get('email');
    
    if (message) {
      toast.error(message);
      if (email) {
        toast(`Email: ${email}`, { icon: '📧' });
      }
      // Remove the query parameters from URL without refreshing
      window.history.replaceState({}, document.title, '/login');
    }
  }, [location]);
 
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const { data } = await api.post('/auth/login', { email, password });
    
    // Save token
    localStorage.setItem('token', data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    
    toast.success('Login successful!');
    
    // HARD REDIRECT based on role
    console.log('User role:', data.user.role);
    
    if (data.user.role === 'admin') {
      console.log('Redirecting to admin dashboard');
      window.location.href = '/admin-dashboard';
    } else if (data.user.role === 'staff') {
      console.log('Redirecting to staff dashboard');
      window.location.href = '/staff-dashboard';
    } else {
      console.log('Redirecting to student dashboard');
      window.location.href = '/dashboard';
    }
  }catch (err) {
    const message = err.response?.data?.message 
      || err.response?.data?.error 
      || 'Invalid email or password. Please try again.';
    toast.error(message);

  } finally { 
    setLoading(false); 
  }
};
 
  const handleGoogle = () => {
    setGLoading(true);
   window.location.href = 'https://campus-service-system.onrender.com/api/auth/google';
  };
 
  return (
    <div className="login-wrap">
      <div className="login-card">
 
        {/* ═══ LEFT — University branding ═══ */}
        <div className="left-panel">
 
          {/* Logo */}
          <div className="uni-logo-wrap">
            <div className="uni-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#0B2F4E">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:'white', fontSize:'1.05rem', lineHeight:1.1 }}>RGUKT</div>
              <div style={{ color:'rgba(255,217,102,0.8)', fontSize:'0.68rem', fontWeight:300, letterSpacing:'0.08em', textTransform:'uppercase' }}>Student Portal</div>
            </div>
          </div>
 
          {/* Tagline */}
          <div style={{ marginBottom:'0.5rem' }}>
            <h1 style={{
              fontFamily:"'Syne',sans-serif", fontWeight:800,
              color:'white', fontSize:'1.55rem', lineHeight:1.2,
              margin:0, letterSpacing:'-0.02em'
            }}>
              Rajiv Gandhi University<br/>
              <span style={{ color:'#FFD966' }}>of Knowledge &</span><br/>
              Technologies
            </h1>
          </div>
          <p style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.8rem', fontWeight:300, margin:'0 0 0.5rem', lineHeight:1.5 }}>
            Empowering the next generation of innovators and leaders.
          </p>
 
          <div className="divider-line" />
 
          {/* Stats */}
          <div className="stat-grid">
            {STATS.map(({ value, label, icon }) => (
              <div className="stat-card" key={label}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.35rem' }}>
                  <SVGIcon d={icon} size={13} color="#FFD966" />
                  <span style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</span>
                </div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:'white', fontSize:'1.3rem' }}>{value}</div>
              </div>
            ))}
          </div>
 
          {/* Features */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', marginTop:'auto' }}>
            {FEATURES.map(({ icon, text }) => (
              <div className="feature-row" key={text}>
                <div style={{
                  width:26, height:26, borderRadius:'8px',
                  background:'rgba(255,217,102,0.12)',
                  border:'1px solid rgba(255,217,102,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
                }}>
                  <SVGIcon d={icon} size={13} color="#FFD966" />
                </div>
                <span style={{ color:'rgba(255,255,255,0.65)', fontSize:'0.78rem', fontWeight:300 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
 
        {/* ═══ RIGHT — Login form ═══ */}
        <div className="right-panel">
 
          <div className="form-field" style={{ marginBottom:'1.6rem' }}>
            <h2 style={{
              fontFamily:"'Syne',sans-serif", fontWeight:800,
              color:'#0B2F4E', fontSize:'1.5rem', margin:'0 0 0.25rem',
              letterSpacing:'-0.02em'
            }}>Welcome back</h2>
            <p style={{ color:'#8aa3b8', fontSize:'0.85rem', margin:0, fontWeight:300 }}>
              Sign in to access your portal
            </p>
          </div>
 
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-field" style={{ marginBottom:'1rem' }}>
              <label style={{ display:'block', marginBottom:'0.35rem', color:'#0B2F4E', fontWeight:600, fontSize:'0.82rem', letterSpacing:'0.01em' }}>
                Email
              </label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <SVGIcon d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" />
                </span>
                <input className="login-input" type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@rgukt.in" required />
              </div>
            </div>
 
            {/* Password */}
            <div className="form-field" style={{ marginBottom:'1.4rem' }}>
              <label style={{ display:'block', marginBottom:'0.35rem', color:'#0B2F4E', fontWeight:600, fontSize:'0.82rem', letterSpacing:'0.01em' }}>
                Password
              </label>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:'0.85rem', top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                  <SVGIcon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </span>
                <input className="login-input" type={showPass ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password" required style={{ paddingRight:'2.8rem' }} />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{
                  position:'absolute', right:'0.8rem', top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', padding:0,
                  transition:'color 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.color='#0B2F4E'}
                  onMouseLeave={e => e.currentTarget.style.color='#a0b8c8'}
                >
                  <SVGIcon size={16} d={showPass
                    ? "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22"
                    : "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
                  } color="#a0b8c8" />
                </button>
              </div>
            </div>
 
            <div className="form-field" style={{ marginBottom:'0.75rem' }}>
              <button className="btn-signin" type="submit" disabled={loading}>
                {loading
                  ? <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                      <span style={{ width:14, height:14, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite' }} />
                      Signing in…
                    </span>
                  : 'Sign In →'}
              </button>
            </div>
          </form>
 
          <div className="form-field" style={{ display:'flex', alignItems:'center', gap:'0.75rem', margin:'0.25rem 0 0.75rem' }}>
            <div style={{ flex:1, height:1, background:'#e2eaf1' }} />
            <span style={{ color:'#a0b8c8', fontSize:'0.78rem' }}>or</span>
            <div style={{ flex:1, height:1, background:'#e2eaf1' }} />
          </div>
 
          <div className="form-field" style={{ marginBottom:'1rem' }}>
            <button className="btn-google" onClick={handleGoogle} disabled={gLoading}>
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width:16, height:16 }} />
              {gLoading ? 'Redirecting…' : 'Continue with Google'}
            </button>
          </div>
 
          <div className="form-field" style={{ textAlign:'center', marginBottom:'1.2rem' }}>
            <span style={{ color:'#a0b8c8', fontSize:'0.82rem' }}>No account? </span>
            <Link to="/register" style={{ color:'#0B2F4E', fontWeight:700, fontSize:'0.82rem', textDecoration:'none', borderBottom:'2px solid #FFD966', paddingBottom:'1px' }}>
              Sign up
            </Link>
          </div>
 
          {/* Demo — compact pill row */}
          <div className="form-field" style={{
            background:'#f6f9fc',
            border:'1.5px dashed #d4e2ec',
            borderRadius:'14px',
            padding:'0.85rem 1rem'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.6rem' }}>
              <span style={{ background:'#FFD966', width:18, height:18, borderRadius:'5px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <SVGIcon d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" size={10} color="#0B2F4E" strokeWidth={2.5} />
              </span>
              <span style={{ color:'#0B2F4E', fontWeight:700, fontSize:'0.73rem', letterSpacing:'0.05em', textTransform:'uppercase' }}>Quick Login</span>
              <span style={{ color:'#a0b8c8', fontSize:'0.7rem', marginLeft:'auto' }}>click to autofill</span>
            </div>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              {DEMO_ACCOUNTS.map(({ role, email: e, pass, color, bg }) => (
                <button key={role} className="demo-pill"
                  style={{ background:bg, color, border:`1.5px solid ${color}30` }}
                  onClick={() => { setEmail(e); setPassword(pass); }}
                  onMouseEnter={el => el.currentTarget.style.boxShadow=`0 4px 14px ${color}30`}
                  onMouseLeave={el => el.currentTarget.style.boxShadow='none'}
                  type="button"
                >
                  <span style={{ width:6, height:6, borderRadius:'50%', background:color, display:'inline-block', flexShrink:0 }} />
                  {role}
                </button>
              ))}
            </div>
          </div>
 
        </div>
      </div>
    </div>
  );
}