const express = require('express');
const router = express.Router();
const passport = require('../config/googleAuth');
const jwt = require('jsonwebtoken');

// Initiate Google OAuth
router.get('/', (req, res, next) => {
  console.log('Starting Google authentication...');
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account' // Force account selection for faster flow
  })(req, res, next);
});

// Google OAuth callback
router.get('/callback',
  (req, res, next) => {
    console.log('Google callback received');
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:3000/login?error=Authentication+failed',
    session: false 
  }),
  (req, res) => {
    const startTime = Date.now();
    console.log('Google callback processing...');
    
    try {
      const user = req.user;
      
      if (!user) {
        console.error('No user data received from Google');
        return res.redirect('http://localhost:3000/login?error=No+user+data+received');
      }
      
      if (user.needsRegistration) {
        console.log('New user needs registration:', user.email);
        return res.redirect(`http://localhost:3000/login?message=This+Google+account+is+not+registered.+Please+sign+up+first.&email=${encodeURIComponent(user.email)}`);
      }
      
      console.log('Existing user found:', user.email, 'Role:', user.role);
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET || 'your-secret-key', 
        { expiresIn: '30d' }
      );
      
      // Determine redirect path based on role
      let redirectPath = '/dashboard';
      if (user.role === 'admin') {
        redirectPath = '/admin-dashboard';
      } else if (user.role === 'staff') {
        redirectPath = '/staff-dashboard';
      }
      
      // Prepare user data for frontend
      const userData = encodeURIComponent(JSON.stringify({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo || ''
      }));
      
      const totalTime = Date.now() - startTime;
      console.log(`Google auth completed in ${totalTime}ms`);
      
      // Redirect to frontend success page
      res.redirect(`http://localhost:3000/auth/success?token=${token}&user=${userData}&redirect=${redirectPath}`);
      
    } catch (error) {
      console.error('Error in Google callback:', error);
      res.redirect('http://localhost:3000/login?error=Server+error+during+authentication');
    }
  }
);

// Error handler for Google OAuth failures
router.get('/error', (req, res) => {
  console.error('Google OAuth error');
  res.redirect('http://localhost:3000/login?error=Google+authentication+failed');
});

module.exports = router;