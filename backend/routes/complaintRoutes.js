const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Routes
router.post('/', complaintController.createComplaint);
router.get('/my-complaints', complaintController.getMyComplaints);
router.get('/stats', authorize('admin'), complaintController.getStats);
router.get('/assigned-to-me', authorize('staff'), complaintController.getAssignedToMe);
router.get('/:id', complaintController.getComplaintById);
router.patch('/:id/status', complaintController.updateStatus);
router.patch('/:id/assign', authorize('admin'), complaintController.assignComplaint);
router.post('/:id/comments', complaintController.addComment);
router.get('/', authorize('admin'), complaintController.getAllComplaints);

module.exports = router;