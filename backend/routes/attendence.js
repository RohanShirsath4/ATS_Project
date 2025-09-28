const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const {
  markAttendance,
  checkoutAttendance,
  getAttendanceRecords,
  getTodayAttendance
} = require('../controllers/attendenceController');

router.post('/mark', auth, markAttendance);
router.post('/checkout', auth, checkoutAttendance);
router.get('/records', auth, getAttendanceRecords);
router.get('/today', auth,getTodayAttendance);

module.exports = router;
