
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const leaveController = require('../controllers/leaveController');

router.post('/apply', auth, leaveController.applyLeave);
router.get('/records', auth, leaveController.getLeaveRecords);
router.get('/my-requests', auth, leaveController.getMyLeaveRequests);

module.exports = router;
