const Leave = require('../models/Leave');
const User = require('../models/User');
const  sendEmail  = require('../utils/emailService');

exports.applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const userId = req.userId;

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'Start date cannot be after end date' });
    }
    
    const overlappingLeave = await Leave.findOne({
      user: userId,
      $or: [
        { startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } },
        { startDate: { $gte: new Date(startDate) }, endDate: { $lte: new Date(endDate) } }
      ],
      status: { $ne: 'rejected' }
    });
    
    if (overlappingLeave) {
      return res.status(400).json({ message: 'You already have a leave request for these dates' });
    }
    const leave = new Leave({
      user: userId,
      startDate,
      endDate,
      reason
    });
    
    await leave.save();
    await leave.populate('user', 'name email');
    const adminUsers = await User.find({ role: 'admin' });
    for (const admin of adminUsers) {
      await sendEmail(
        admin.email,
        'New Leave Request',
        `Employee ${leave.user.name} has applied for leave from ${startDate} to ${endDate}. Reason: ${reason}`
        
    );
    }
    
    res.status(201).json({ message: 'Leave application submitted successfully', leave });
  } catch (error) {
    //  console.error(">>>>>>>>>> /apply route:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLeaveRecords = async (req, res) => {
  try {
    const userId = req.userId;
    const { page = 1, limit = 30 } = req.query;
 
    const records = await Leave.find({ user: userId })
      .sort({ appliedOn: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Leave.countDocuments({ user: userId });
    const [pendingCount, approvedCount, rejectedCount] = await Promise.all([
      Leave.countDocuments({ user: userId, status: 'pending' }),
      Leave.countDocuments({ user: userId, status: 'approved' }),
      Leave.countDocuments({ user: userId, status: 'rejected' }),
    ]);

    res.json({
      records,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalRecords: count,
      summary: {
        total: count,
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
      },
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getMyLeaveRequests = async (req, res) => {
    const userId = req.userId;
    const leaves = await Leave.find({ user: userId }).sort({ appliedOn: -1 });
    res.json(leaves);
 
};

 
