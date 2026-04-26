const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Cache for user lookups to reduce database calls
const userCache = new Map();
const CACHE_TTL = 60000; // 1 minute

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    // Check cache first
    if (userCache.has(id)) {
      return done(null, userCache.get(id));
    }
    
    const user = await User.findById(id).lean().maxTimeMS(5000);
    if (user) {
      userCache.set(id, user);
      setTimeout(() => userCache.delete(id), CACHE_TTL);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Configure Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log('Google auth started for:', profile.emails[0].value);
      
      // Use lean() for faster query
      const user = await User.findOne({ email: profile.emails[0].value })
        .select('_id name email role photo')
        .lean()
        .maxTimeMS(5000);
      
      if (!user) {
        console.log('New user needs registration');
        return done(null, { 
          needsRegistration: true,
          email: profile.emails[0].value,
          name: profile.displayName,
          photo: profile.photos[0]?.value || null
        });
      }
      
      // Cache the user
      userCache.set(user._id.toString(), user);
      
      console.log('Existing user found:', user.email);
      return done(null, user);
      
    } catch (error) {
      console.error('Google auth error:', error);
      return done(error, null);
    }
  }
));

module.exports = passport;