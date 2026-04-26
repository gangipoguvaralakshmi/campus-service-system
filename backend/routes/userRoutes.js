const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  updateNotifications,
  getNotifications,
  deleteAccount,
  getStaff
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/notifications', getNotifications);
router.put('/notifications', updateNotifications);
router.delete('/account', deleteAccount);
router.get('/staff', authorize('admin'), getStaff);

module.exports = router;