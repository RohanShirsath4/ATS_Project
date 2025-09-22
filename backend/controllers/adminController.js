const User = require('../models/User');
const Attendance = require('../models/Attendence');
const Leave = require('../models/Leave');

exports.getEmployees = async (req, res) => {
    try {
        const { page = 1, limit = 30 } = req.query;
        const employees = await User.find({ role: 'employee' })
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const count = await User.countDocuments({ role: 'employee' });
        res.json({
            employees,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalEmployees: count
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const { date, page = 1, limit = 30 } = req.query;
        let query = {};
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            query.date = { $gte: startDate, $lte: endDate };
        }
        const records = await Attendance.find(query)
            .populate('user', 'name email')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const count = await Attendance.countDocuments(query);
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
exports.getLateEmployees = async (req, res) => {
    try {
        const { date } = req.query;
        const queryDate = date ? new Date(date) : new Date();
        queryDate.setHours(0, 0, 0, 0);

        const nextDay = new Date(queryDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const lateRecords = await Attendance.find({
            date: { $gte: queryDate, $lt: nextDay },
            status: 'late'
        }).populate('user', 'name email');

        res.json({ date: queryDate.toDateString(), lateEmployees: lateRecords });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getLeaves = async (req, res) => {
    try {
        const { status, page = 1, limit = 30 } = req.query;
        let query = {};
        if (status) {
            query.status = status;
        }
        const leaves = await Leave.find(query)
            .populate('user', 'name email')
            .sort({ appliedOn: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const count = await Leave.countDocuments(query);
        res.json({
            leaves,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalLeaves: count
        });
    } catch (error) {
        res.status(500).json({ message: 'server error' });
    }
};

exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const leaveId = req.params.id;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const leave = await Leave.findByIdAndUpdate(
            leaveId,
            { status },
            { new: true }
        ).populate('user', 'name email');
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }
        res.json({ message: `Leave request ${status}`, leave });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
