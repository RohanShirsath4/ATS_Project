 const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const adminController = require('../controllers/adminController');

router.use(auth, adminAuth);
router.get('/employees', adminController.getEmployees);
router.get('/attendance', adminController.getAttendance);
router.get('/late-employees', adminController.getLateEmployees);
router.get('/leaves', adminController.getLeaves);
router.put('/leaves/:id', adminController.updateLeaveStatus);

module.exports = router;
