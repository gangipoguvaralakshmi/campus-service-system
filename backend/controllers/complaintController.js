const Complaint = require('../models/Complaint');
const User = require('../models/User');

// @desc    Create new complaint
// @route   POST /api/complaints
exports.createComplaint = async (req, res) => {
  try {
    console.log('Creating complaint with data:', req.body);
    
    // Add user ID from auth middleware
    const complaintData = {
      title: req.body.title,
      category: req.body.category,
      location: req.body.location,
      roomNumber: req.body.roomNumber || '',
      description: req.body.description,
      raisedBy: req.user.id,
    };

    // Handle priority from aiClassification
    if (req.body.aiClassification && req.body.aiClassification.priority) {
      complaintData.priority = req.body.aiClassification.priority.toLowerCase();
    } else {
      complaintData.priority = 'medium';
    }

    // Add aiClassification if it exists
    if (req.body.aiClassification) {
      complaintData.aiClassification = req.body.aiClassification;
    }

    console.log('Processed complaint data:', complaintData);

    const complaint = await Complaint.create(complaintData);
    
    res.status(201).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints for current user
// @route   GET /api/complaints/my-complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ raisedBy: req.user.id })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints (admin only)
// @route   GET /api/complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('raisedBy', 'name email registrationId')
      .populate('assignedTo', 'name email department')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Get all complaints error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('raisedBy', 'name email registrationId')
      .populate('assignedTo', 'name email department');
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    
    // Check if user owns complaint or is admin/staff
    if (complaint.raisedBy._id.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    
    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
exports.updateStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    
    const complaint = await Complaint.findById(req.params.id)
      .populate('raisedBy', 'name email')
      .populate('assignedTo', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    
    // Check if user is authorized (staff assigned or admin)
    if (req.user.role !== 'admin' && complaint.assignedTo?._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this complaint' });
    }
    
    const oldStatus = complaint.status;
    
    // Update status
    complaint.status = status;
    if (status === 'resolved') {
      complaint.resolvedAt = Date.now();
      complaint.resolutionNotes = resolutionNotes || '';
    }
    
    await complaint.save();
    
    // ===== SEND EMAIL NOTIFICATION TO STUDENT =====
    try {
      const emailService = require('../services/emailService');
      await emailService.sendStatusUpdateNotification(
        complaint.raisedBy.email,
        complaint.raisedBy.name,
        complaint,
        oldStatus,
        status
      );
      console.log('Status update email sent to:', complaint.raisedBy.email);
    } catch (emailError) {
      console.error('Failed to send status update email:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign complaint to staff
// @route   PATCH /api/complaints/:id/assign
exports.assignComplaint = async (req, res) => {
  try {
    const { staffId } = req.body;
    
    if (!staffId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Staff ID is required' 
      });
    }

    const complaint = await Complaint.findById(req.params.id)
      .populate('raisedBy', 'name email');
    
    if (!complaint) {
      return res.status(404).json({ 
        success: false, 
        message: 'Complaint not found' 
      });
    }
    
    // Check if staff exists
    const staff = await User.findById(staffId);
    if (!staff || staff.role !== 'staff') {
      return res.status(404).json({ 
        success: false, 
        message: 'Staff member not found' 
      });
    }
    
    complaint.assignedTo = staffId;
    complaint.status = 'assigned';
    await complaint.save();
    
    // Populate the assignedTo field before sending response
    await complaint.populate('assignedTo', 'name email department');
    
    // ===== SEND EMAIL NOTIFICATION TO STAFF =====
    try {
      const emailService = require('../services/emailService');
      await emailService.sendAssignmentNotification(
        staff.email,
        staff.name,
        complaint
      );
      console.log('Assignment notification email sent to:', staff.email);
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError);
      // Don't fail the request if email fails
    }
    
    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Get complaint statistics (admin only)
// @route   GET /api/complaints/stats
exports.getStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'pending' });
    const assigned = await Complaint.countDocuments({ status: 'assigned' });
    const inProgress = await Complaint.countDocuments({ status: 'in-progress' });
    const resolved = await Complaint.countDocuments({ status: 'resolved' });
    
    // Get counts by category
    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    // Get counts by priority
    const byPriority = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        assigned,
        inProgress,
        resolved,
        byCategory,
        byPriority
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to complaint
// @route   POST /api/complaints/:id/comments
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }
    
    // Check if user owns complaint or is admin/staff
    if (complaint.raisedBy.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'staff') {
      return res.status(403).json({ success: false, message: 'Not authorized to comment' });
    }
    
    const comment = {
      text,
      postedBy: req.user.id,
      createdAt: Date.now()
    };
    
    // Initialize comments array if it doesn't exist
    if (!complaint.comments) {
      complaint.comments = [];
    }
    
    complaint.comments.push(comment);
    await complaint.save();
    
    // Populate the postedBy field before sending response
    await complaint.populate('comments.postedBy', 'name role');
    
    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get complaints assigned to current staff
// @route   GET /api/complaints/assigned-to-me
exports.getAssignedToMe = async (req, res) => {
  try {
    const complaints = await Complaint.find({ 
      assignedTo: req.user.id 
    })
    .populate('raisedBy', 'name email registrationId')
    .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Get assigned complaints error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};