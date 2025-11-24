 const Attendance = require('../models/Attendence');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');

// exports.markAttendance = async (req, res) => {
//    try {
//     const userId = req.userId;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const existingAttendance = await Attendance.findOne({
//       user: userId,
//       date: { $gte: today }
//     });

//     if (existingAttendance) {
//       return res.status(400).json({ message: 'Attendance already marked for today' });
//     }
//     const currentTime = new Date();
//     const lateTime = new Date();
//     lateTime.setHours(12, 0, 0, 0);
//     const status = currentTime > lateTime ? 'late' : 'present';
//     const attendance = new Attendance({
//       user: userId,
//       checkIn: currentTime,
//       status
//     });

//     await attendance.save();

//     if (status === 'late') {
//       const user = await User.findOne({ _id: userId });
//       if (!user || !user.email) {
//         console.error('User not found or email missing:', user);
//       } else {
//         console.log("sending email to:", user.email);
//         try {
//           await sendEmail(
//             user.email,
//             'Late Attendance Marked',
//             `You have been marked as late for ${currentTime.toDateString()}. Your check-in time was ${currentTime.toTimeString()}.`
//           );
//           console.log("email sent successfully");
//         } catch (err) {
//           console.log('failed to send email:', err);
//         }
//       }
//     } else {
//       console.log("no email sent", status);
//     }

//     res.json({ message: 'attendance marked successfully', attendance });
//   } catch (error) {
//     // console.log(" >>>>>>mark:", error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
exports.markAttendance = async (req, res) => {
   try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: { $gte: today }
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for today' });
    }
    const currentTime = new Date();
    const lateTime = new Date();
    lateTime.setHours(12, 0, 0, 0);
    const status = currentTime > lateTime ? 'late' : 'present';
    const attendance = new Attendance({
      user: userId,
      checkIn: currentTime,
      status
    });

    await attendance.save();

    if (status === 'late') {
      const user = await User.findOne({ _id: userId });
      if (!user || !user.email) {
        console.error('User not found or email missing:', user);
      } else {
        console.log("sending email to:", user.email);
        try {
          await sendEmail(
            user.email,
            'Late Attendance Marked',
            `You have been marked as late for ${currentTime.toDateString()}. Your check-in time was ${currentTime.toTimeString()}.`
          );
          console.log("email sent successfully");
        } catch (err) {
          console.log('failed to send email:', err);
        }
      }
    } else {
      console.log("no email sent", status);
    }

    res.json({ message: 'attendance marked successfully', attendance });
  } catch (error) {
    // console.log(" >>>>>>mark:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.checkoutAttendance = async (req, res) => {
try {
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: userId,
      date: { $gte: today }
    });
    
    if (!attendance) {
      return res.status(400).json({ message: 'please mark attendance first' });
    }
    if (attendance.checkOut) {
      return res.status(400).json({ message: 'check-out already marked for today' });
    }
    const checkOutTime = new Date();
    attendance.checkOut = checkOutTime;
    const checkInTime = new Date(attendance.checkIn);
    const hoursWorked = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    attendance.hoursWorked = hoursWorked.toFixed(2);
    await attendance.save();
    res.json({ message: 'check-out marked successfully', attendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAttendanceRecords = async (req, res) => {
try {
    const userId = req.userId;
    const { page = 1, limit = 30 } = req.query;
    const records = await Attendance.find({ user: userId })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Attendance.countDocuments({ user: userId });
    res.json({
      records,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalRecords: count
    });
  } catch (error) {
    res.status(500).json({ message: 'server error' });
  }
};


exports.getTodayAttendance = async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const userId = req.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const attendance = await Attendance.findOne({
      user: userId,
      date: { $gte: today, $lt: tomorrow }
    });

    if (!attendance) {
      return res.json(null);  
    }

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching today\'s attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
