const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ["student", "staff", "admin"],
    default: "student"
  },
  registrationId: {
    type: String,
    sparse: true,
  },
  department: {
    type: String,
    enum: ["electrical", "plumbing", "hostel", "maintenance", "canteen", "other"],
    default: "other"
  },
  contactNumber: {
    type: String,
    required: [true, 'Please provide a contact number']
  },
  photo: {
    type: String,
    default: null
  },
  notifications: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    complaintUpdates: { type: Boolean, default: true },
    marketingEmails: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("User", userSchema);

