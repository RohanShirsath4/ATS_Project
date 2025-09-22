const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  checkIn: {
    type: Date,
    default: Date.now
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'late'],
    default: 'present'
  },
  hoursWorked: {
    type: Number,
    default: 0
  }
});
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);