const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Update user profile
// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, contactNumber } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update fields
    if (name) user.name = name;
    if (contactNumber) user.contactNumber = contactNumber;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        contactNumber: user.contactNumber,
        registrationId: user.registrationId
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user.id).select('+password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update notification preferences
// @route   PUT /api/users/notifications
exports.updateNotifications = async (req, res) => {
  try {
    const { emailNotifications, smsNotifications, complaintUpdates, marketingEmails } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Add notification preferences to user schema if not exists
    if (!user.notifications) {
      user.notifications = {};
    }
    
    user.notifications = {
      emailNotifications: emailNotifications ?? user.notifications?.emailNotifications ?? true,
      smsNotifications: smsNotifications ?? user.notifications?.smsNotifications ?? false,
      complaintUpdates: complaintUpdates ?? user.notifications?.complaintUpdates ?? true,
      marketingEmails: marketingEmails ?? user.notifications?.marketingEmails ?? false
    };
    
    await user.save();
    
    res.status(200).json({
      success: true,
      notifications: user.notifications
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get notification preferences
// @route   GET /api/users/notifications
exports.getNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const notifications = user.notifications || {
      emailNotifications: true,
      smsNotifications: false,
      complaintUpdates: true,
      marketingEmails: false
    };
    
    res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all staff members
// @route   GET /api/users/staff
// @desc    Get all staff members
// @route   GET /api/users/staff
exports.getStaff = async (req, res) => {
  try {
    console.log('Fetching staff members...');
    
    const staff = await User.find({ role: 'staff' })
      .select('name email department contactNumber registrationId');
    
    console.log(`Found ${staff.length} staff members:`, staff);
    
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
