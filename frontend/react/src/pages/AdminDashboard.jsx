import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'

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
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-people-fill me-2" style={{ color: '#6b5b95', fontSize: '1.5rem' }}></i>
        <h4 className="mb-0 fw-bold" style={{ color: '#6b5b95' }}>All Employees</h4>
        <span className="badge bg-primary ms-3">{employees.length} Total</span>
      </div>
      {employees.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th className="border-0 fw-semibold">
                  <i className="bi bi-person me-2"></i>Name
                </th>
                <th className="border-0 fw-semibold">
                  <i className="bi bi-envelope me-2"></i>Email
                </th>
                <th className="border-0 fw-semibold">
                  <i className="bi bi-calendar me-2"></i>Join Date
                </th>
                <th className="border-0 fw-semibold">
                  <i className="bi bi-person-badge me-2"></i>Role
                </th>
              </tr>
            </thead>
            <tbody>
              {employees.map(employee => (
                <tr key={employee._id} className="border-0">
                  <td className="border-0">
                    <div className="d-flex align-items-center">
                      <div 
                        className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3"
                        style={{ width: '40px', height: '40px' }}
                      >
                        <i className="bi bi-person text-white"></i>
                      </div>
                      <span className="fw-medium">{employee.name}</span>
                    </div>
                  </td>
                  <td className="border-0 text-muted">{employee.email}</td>
                  <td className="border-0">
                    <span className="badge bg-light text-dark">
                      {new Date(employee.joiningDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="border-0">
                    <span className={`badge ${employee.role === 'admin' ? 'bg-danger' : 'bg-success'}`}>
                      {employee.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="text-muted mt-3">No employees found.</p>
        </div>
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
    <div className="admin-dashboard flex-grow-1 d-flex flex-column mt-5"
    style={{backgroundColor:'#6b5b95'}}>
      <div className="mb-5">
        <div className="d-flex align-items-center mb-4">
          <div>
            <h1 className="display-5 fw-bold mb-1"  >
              Admin Dashboard
            </h1>
            <p className="text-muted mb-0">Manage your organization's attendance and leave system</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <ul className="nav nav-pills nav-fill bg-light p-2 rounded-3 shadow-sm">
          <li className="nav-item">
            <button 
              className={`nav-link border-0 fw-medium ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
              style={{
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === 'employees' ? '#6b5b95' : 'transparent',
                color: activeTab === 'employees' ? 'white' : '#6b5b95'
              }}
            >
              <i className="bi bi-people me-2"></i>
              Employees
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link border-0 fw-medium ${activeTab === 'attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('attendance')}
              style={{
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === 'attendance' ? '#6b5b95' : 'transparent',
                color: activeTab === 'attendance' ? 'white' : '#6b5b95'
              }}
            >
              <i className="bi bi-calendar-check me-2"></i>
              Attendance
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link border-0 fw-medium ${activeTab === 'leaves' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaves')}
              style={{
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === 'leaves' ? '#6b5b95' : 'transparent',
                color: activeTab === 'leaves' ? 'white' : '#6b5b95'
              }}
            >
              <i className="bi bi-calendar-event me-2"></i>
              Leave Requests
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link border-0 fw-medium ${activeTab === 'late' ? 'active' : ''}`}
              onClick={() => setActiveTab('late')}
              style={{
                borderRadius: '10px',
                transition: 'all 0.3s ease',
                backgroundColor: activeTab === 'late' ? '#6b5b95' : 'transparent',
                color: activeTab === 'late' ? 'white' : '#6b5b95'
              }}
            >
              <i className="bi bi-clock-history me-2"></i>
              Late Employees
            </button>
          </li>
        </ul>
      </div>
      <div className="tab-content flex-grow-1">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading data...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3 shadow-sm p-4" style={{ minHeight: '500px' }}>
            {activeTab === 'employees' && renderEmployeesTab()}
            {activeTab === 'attendance' && renderAttendanceTab()}
            {activeTab === 'leaves' && renderLeavesTab()}
            {activeTab === 'late' && renderLateEmployeesTab()}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;