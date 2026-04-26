const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true
  },
  category: {
    type: String,
    enum: ["electrical", "plumbing", "hostel", "maintenance", "canteen", "other"],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  roomNumber: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    trim: true
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "in-progress", "resolved", "rejected"],
    default: "pending"
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium"
  },
  raisedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  aiClassification: {
    category: String,
    confidence: String,
    priority: String,
    department: String
  },
  resolvedAt: Date,
  resolutionNotes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Remove any pre-save hooks completely
// Let's handle priority conversion in the controller instead

module.exports = mongoose.model('Complaint', complaintSchema);