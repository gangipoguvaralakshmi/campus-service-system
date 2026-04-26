import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// SVG icon render functions — avoids JSX-in-array object error
const FIcon0 = () => (
  <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
    <rect x="8" y="4" width="28" height="36" rx="4" fill="#e8f0fe" stroke="#0B2F4E" strokeWidth="2"/>
    <line x1="14" y1="14" x2="30" y2="14" stroke="#0B2F4E" strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="20" x2="30" y2="20" stroke="#0B2F4E" strokeWidth="2" strokeLinecap="round"/>
    <line x1="14" y1="26" x2="22" y2="26" stroke="#0B2F4E" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="36" cy="36" r="8" fill="#FFD966"/>
    <path d="M32 36l3 3 5-5" stroke="#0B2F4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const FIcon1 = () => (
  <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
    <circle cx="24" cy="18" r="10" fill="#e8f5e9" stroke="#0B2F4E" strokeWidth="2"/>
    <circle cx="24" cy="15" r="3" fill="#0B2F4E"/>
    <path d="M20 22c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#0B2F4E" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M14 38c0-5.5 4.5-8 10-8s10 2.5 10 8" stroke="#FFD966" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="38" cy="12" r="5" fill="#0B2F4E"/>
    <line x1="36" y1="12" x2="40" y2="12" stroke="#FFD966" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="38" y1="10" x2="38" y2="14" stroke="#FFD966" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const FIcon2 = () => (
  <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
    <circle cx="24" cy="24" r="14" fill="#fff3e0" stroke="#0B2F4E" strokeWidth="2"/>
    <polyline points="24,14 24,24 30,28" stroke="#0B2F4E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="24" r="2.5" fill="#FFD966"/>
    <circle cx="38" cy="10" r="5" fill="#FFD966"/>
    <line x1="36" y1="10" x2="40" y2="10" stroke="#0B2F4E" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="38" y1="8" x2="38" y2="12" stroke="#0B2F4E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);
const FIcon3 = () => (
  <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
    <path d="M10 20c0-7.7 6.3-14 14-14s14 6.3 14 14c0 5-2.6 9.3-6.5 11.8L30 38H18l-1.5-6.2C12.6 29.3 10 25 10 20z" fill="#e8f0fe" stroke="#0B2F4E" strokeWidth="2"/>
    <path d="M20 24l2.5 2.5L28 20" stroke="#FFD966" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="18" y1="38" x2="30" y2="38" stroke="#0B2F4E" strokeWidth="2" strokeLinecap="round"/>
    <line x1="20" y1="42" x2="28" y2="42" stroke="#0B2F4E" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const WIcon0 = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0B2F4E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const WIcon1 = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0B2F4E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);
const WIcon2 = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0B2F4E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);
const WIcon3 = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0B2F4E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const FEATURE_ICONS = [FIcon0, FIcon1, FIcon2, FIcon3];
const WHY_ICONS = [WIcon0, WIcon1, WIcon2, WIcon3];

const FEATURES = [
  { num: '500+', label: 'Tickets/month', text: 'Quick Complaint',   desc: 'Register issues instantly' },
  { num: '98%',  label: 'Accuracy',      text: 'AI Classification', desc: 'Smart auto-routing'       },
  { num: '24h',  label: 'Resolution',    text: 'Live Tracking',     desc: 'Real-time status updates' },
  { num: '24/7', label: 'Availability',  text: '24/7 Support',      desc: 'Always here to help'      }
];

const WHY = [
  { title: 'Fast Resolution',     desc: 'Complaints resolved within 24 hours'   },
  { title: 'Secure and Private',  desc: 'Your data is always protected'          },
  { title: 'Mobile Friendly',     desc: 'Access from any device, anytime'        },
  { title: 'Analytics Dashboard', desc: 'Track performance metrics in real-time' }
];

// Carousel images - beautiful campus images
const carouselImages = [
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
];

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', fontFamily: "'DM Sans','Segoe UI',sans-serif", background: '#0B2F4E' }}>

      {/* Fullscreen Carousel Background with Improved Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 }}>
        {carouselImages.map((img, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url('${img}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
              transform: 'scale(1.05)',
            }}
          />
        ))}
        
        {/* Improved gradient overlay for better text visibility */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(11,47,78,0.92) 0%, rgba(11,47,78,0.8) 50%, rgba(11,47,78,0.92) 100%)',
          zIndex: 1
        }} />

        {/* Carousel navigation arrows */}
        <button
          onClick={prevSlide}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 15,
            background: '#FFD966',
            border: 'none',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0B2F4E',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFD966'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 15,
            background: '#FFD966',
            border: 'none',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0B2F4E',
            fontSize: '24px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#FFD966'; e.currentTarget.style.transform = 'translateY(-50%) scale(1)'; }}
        >
          ›
        </button>

        {/* Slide indicators */}
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 15,
          display: 'flex',
          gap: '12px',
        }}>
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '30px' : '12px',
                height: '12px',
                borderRadius: '6px',
                border: 'none',
                background: currentSlide === index ? '#FFD966' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,217,102,0.03)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,217,102,0.03)', zIndex: 2, pointerEvents: 'none' }} />

      {/* NAVBAR */}
      <nav style={{ position: 'relative', zIndex: 20, padding: '1.2rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(11,47,78,0.3)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,217,102,0.2)', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <i className="fas fa-robot" style={{ color: '#FFD966', fontSize: '2rem' }}></i>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ffffff' }}>
            ServCampus<span style={{ color: '#FFD966' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" style={{ padding: '0.65rem 1.8rem', borderRadius: '50px', background: '#FFD966', color: '#0B2F4E', textDecoration: 'none', fontWeight: '700', transition: 'all 0.3s', boxShadow: '0 4px 14px rgba(255,217,102,0.3)', fontSize: '0.95rem' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#FFD966'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >Login</Link>
          <Link to="/register" style={{ padding: '0.65rem 1.8rem', borderRadius: '50px', background: 'transparent', color: '#ffffff', textDecoration: 'none', fontWeight: '600', border: '2px solid #FFD966', transition: 'all 0.3s', fontSize: '0.95rem' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#FFD966'; e.currentTarget.style.color = '#0B2F4E'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >Register</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '3rem 5%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4rem', flexWrap: 'wrap' }}>

        {/* Left */}
        <div style={{ flex: '1 1 500px' }}>

          {/* Badge */}
          <div style={{ background: 'rgba(255,217,102,0.15)', padding: '0.5rem 1.1rem', borderRadius: '40px', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.8rem', border: '1px solid rgba(255,217,102,0.3)', backdropFilter: 'blur(5px)' }}>
            <i className="fas fa-robot" style={{ color: '#FFD966', fontSize: '0.9rem' }}></i>
            <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.04em' }}>AI-POWERED · CAMPUS SERVICE</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: '800', marginBottom: '1.5rem', lineHeight: 1.15, color: '#ffffff' }}>
            Smart Campus Service
            <span style={{ color: '#FFD966', display: 'block' }}> Management</span>
          </h1>

          {/* Subtext */}
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '2.5rem', color: 'rgba(255,255,255,0.9)', maxWidth: '520px' }}>
            Join thousands of students and staff members who are already using our AI-powered campus service management system.
          </p>

          {/* Feature Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2.5rem' }}>
            {FEATURES.map((f, i) => {
              const Icon = FEATURE_ICONS[i];
              return (
                <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,217,102,0.2)', backdropFilter: 'blur(5px)', transition: 'transform 0.25s, box-shadow 0.25s, background 0.25s', cursor: 'default' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,217,102,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,217,102,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon />
                    </div>
                    <span style={{ color: '#FFD966', fontSize: '0.65rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: 'right' }}>{f.label}</span>
                  </div>
                  <div style={{ fontSize: '1.7rem', fontWeight: '800', color: '#ffffff', lineHeight: 1, marginBottom: '0.2rem' }}>{f.num}</div>
                  <div style={{ color: '#FFD966', fontWeight: '700', fontSize: '0.82rem', marginBottom: '0.1rem' }}>{f.text}</div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.72rem', margin: 0 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            {[
              { number: '1000+', text: 'Active Users'     },
              { number: '98%',   text: 'Satisfaction Rate' },
              { number: '24/7',  text: 'Support'           }
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#FFD966' }}>{stat.number}</div>
                <div style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.1rem', fontWeight: '500' }}>{stat.text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card */}
        <div style={{ flex: '1 1 400px', background: 'rgba(255,255,255,0.05)', borderRadius: '28px', padding: '2.2rem', boxShadow: '0 15px 35px rgba(0,0,0,0.2)', border: '1px solid rgba(255,217,102,0.2)', backdropFilter: 'blur(10px)' }}>
          <div style={{ background: '#FFD966', width: 'fit-content', padding: '0.45rem 1.6rem', borderRadius: '30px', marginBottom: '1.6rem', boxShadow: '0 4px 14px rgba(255,217,102,0.25)' }}>
            <span style={{ color: '#0B2F4E', fontWeight: '700', fontSize: '0.95rem' }}>Why Choose Us?</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {WHY.map((item, i) => {
              const WIcon = WHY_ICONS[i];
              return (
                <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', padding: '0.85rem 1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,217,102,0.15)', transition: 'background 0.2s, transform 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,217,102,0.1)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  <div style={{ width: '40px', height: '40px', flexShrink: 0, background: '#FFD966', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(255,217,102,0.25)' }}>
                    <WIcon />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.92rem', color: '#ffffff', fontWeight: '700', marginBottom: '0.1rem' }}>{item.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem' }}>{item.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <Link to="/register" style={{ display: 'block', marginTop: '1.8rem', padding: '1rem', background: '#FFD966', color: '#0B2F4E', textDecoration: 'none', borderRadius: '14px', fontWeight: '700', fontSize: '1rem', transition: 'all 0.3s', textAlign: 'center', boxShadow: '0 8px 24px rgba(255,217,102,0.3)', letterSpacing: '0.02em' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#FFD966'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Get Started Now →
          </Link>
        </div>

      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;