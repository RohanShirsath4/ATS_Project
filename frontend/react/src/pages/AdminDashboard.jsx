import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('employees');
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [lateEmployees, setLateEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab, dateFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      switch (activeTab) {
        case 'employees':
          const employeesRes = await axios.get('/api/admin/employees');
          setEmployees(employeesRes.data.employees);
          break;
        
        case 'attendance':
          const attendanceRes = await axios.get(`/api/admin/attendance?date=${dateFilter}`);
          setAttendance(attendanceRes.data.records);
          break;
        
        case 'leaves':
          const leavesRes = await axios.get('/api/admin/leaves');
          setLeaveRequests(leavesRes.data.leaves);
          break;
        
        case 'late':
          const lateRes = await axios.get(`/api/admin/late-employees?date=${dateFilter}`);
          setLateEmployees(lateRes.data.lateEmployees);
          break;
        
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      await axios.put(`/api/admin/leaves/${leaveId}`, { status });
      setMessage(`Leave request ${status}`);
      const leavesRes = await axios.get('/api/admin/leaves');
      setLeaveRequests(leavesRes.data.leaves);
    } catch (error) {
      console.error('Error updating leave status:', error);
      setMessage(error.response?.data?.message || 'Failed to update leave status');
    }
  };

  const renderEmployeesTab = () => (
    <div>
      <h4>All Employees</h4>
      {employees.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Join Date</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr key={employee._id}>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{new Date(employee.joiningDate).toLocaleDateString()}</td>
                <td>{employee.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No employees found.</p>
      )}
    </div>
  );

  const renderAttendanceTab = () => (
    <div>
      <h4>Attendance Records</h4>
      <div className="mb-3">
        <label htmlFor="dateFilter" className="form-label">Select Date:</label>
        <input
          type="date"
          className="form-control"
          id="dateFilter"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ width: '200px' }}
        />
      </div>
      
      {attendance.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map(record => (
              <tr key={record._id}>
                <td>{record.user.name}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
                <td>{record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : '-'}</td>
                <td>{record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : '-'}</td>
                <td>
                  <span className={`badge ${record.status === 'present' ? 'bg-success' : record.status === 'late' ? 'bg-warning' : 'bg-danger'}`}>
                    {record.status}
                  </span>
                </td>
                <td>{record.hoursWorked || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found for selected date.</p>
      )}
    </div>
  );

  const renderLeavesTab = () => (
    <div>
      <h4>Leave Requests</h4>
      {message && (
        <div className="alert alert-info" role="alert">{message}</div>
      )}
      {leaveRequests.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Applied On</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map(leave => (
              <tr key={leave._id}>
                <td>{leave.user.name}</td>
                <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                <td>{leave.reason}</td>
                <td>{new Date(leave.appliedOn).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${getStatusBadge(leave.status)}`}>
                    {leave.status}
                  </span>
                </td>
                <td>
                  {leave.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-success btn-sm me-1"
                        onClick={() => handleLeaveAction(leave._id, 'approved')}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleLeaveAction(leave._id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No leave requests found.</p>
      )}
    </div>
  );

  const renderLateEmployeesTab = () => (
    <div>
      <h4>Late Employees</h4>
      <div className="mb-3">
        <label htmlFor="lateDateFilter" className="form-label">Select Date:</label>
        <input
          type="date"
          className="form-control"
          id="lateDateFilter"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={{ width: '200px' }}
        />
      </div>
      
      {lateEmployees.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Check-In Time</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {lateEmployees.map(record => (
              <tr key={record._id}>
                <td>{record.user.name}</td>
                <td>{new Date(record.checkIn).toLocaleTimeString()}</td>
                <td>{new Date(record.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No late employees found for selected date.</p>
      )}
    </div>
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      default:
        return 'bg-warning';
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <ul className="nav nav-tabs mt-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveTab('employees')}
          >
            Employees
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'leaves' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaves')}
          >
            Leave Requests
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'late' ? 'active' : ''}`}
            onClick={() => setActiveTab('late')}
          >
            Late Employees
          </button>
        </li>
      </ul>
      
      <div className="tab-content mt-3">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            {activeTab === 'employees' && renderEmployeesTab()}
            {activeTab === 'attendance' && renderAttendanceTab()}
            {activeTab === 'leaves' && renderLeavesTab()}
            {activeTab === 'late' && renderLateEmployeesTab()}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;