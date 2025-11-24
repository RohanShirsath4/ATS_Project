import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Alert, 
  Table, 
  Badge,
  Spinner,
  Modal,
  Form
} from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Attendance = () => {
  const { currentUser } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const refetchRecords = async () => {
    try {
      const recordsRes = await axios.get('/api/attendance/records?limit=30');
      setAttendanceRecords(recordsRes.data.records);
    } catch (error) {
      console.error('Background refetch records failed:', error);
    }
  };

  const refetchToday = async () => {
    try {
      const todayRes = await axios.get('/api/attendance/today');
      setTodayAttendance(todayRes.data);
    } catch (error) {
      console.error("Background refetch today's attendance failed:", error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      
      const [todayRes, recordsRes] = await Promise.all([
        axios.get('/api/attendance/today'),
        axios.get('/api/attendance/records?limit=30')
      ]);
      setTodayAttendance(todayRes.data);
      setAttendanceRecords(recordsRes.data.records);
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setMessage('Error loading attendance data');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    try {
      setMessage('');
      const res = await axios.post('/api/attendance/mark');
      setTodayAttendance(res.data.attendance);
      setMessage('Attendance marked successfully!');
      setAttendanceRecords(prev => [
        res.data.attendance,
        ...prev.filter(r => r._id !== res.data.attendance._id)
      ]);
      refetchRecords();
      refetchToday();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error marking attendance');
   
      refetchRecords();
      refetchToday();
    }
  };

  const markCheckout = async () => {
    try {
      setMessage('');
      const res = await axios.post('/api/attendance/checkout');
      setTodayAttendance(res.data.attendance);
      setMessage('Check-out marked successfully!');
      setAttendanceRecords(prev => prev.map(r => r._id === res.data.attendance._id ? res.data.attendance : r));
      refetchRecords();
      refetchToday();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error marking check-out');
      refetchRecords();
      refetchToday();
    }
  };
 const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return 'success';
      case 'late':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading attendance data...</p>
      </Container>
    );
  }

  return (
    <Container className=' h-100 '>
      <Row className="mb-4">
        <Col>
          <h1 className="display-5 fw-bold mt-5">Attendance Management</h1>
          <p className="lead">Track and manage your attendance records</p>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.includes('success') ? 'success' : 'danger'} dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-calendar-check me-2"></i>
                Today's Attendance
              </h5>
            </Card.Header>
            <Card.Body className="text-center py-4">
              {todayAttendance ? (
                <div>
                  <div className="mb-3">
                    <Badge bg={getStatusBadge(todayAttendance.status)} className="p-2 fs-6">
                      Status: {todayAttendance.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <Row className="text-start">
                    <Col sm={6}>
                      <p><strong>Check-in:</strong></p>
                      <p className="fs-5">{formatTime(todayAttendance.checkIn)}</p>
                    </Col>
                    <Col sm={6}>
                      <p><strong>Check-out:</strong></p>
                      <p className="fs-5">{formatTime(todayAttendance.checkOut) || '-'}</p>
                    </Col>
                  </Row>
                  
                  {todayAttendance.hoursWorked ? (
                    <div className="mt-3">
                      <p><strong>Hours Worked:</strong></p>
                      <p className="fs-4 text-primary">{todayAttendance.hoursWorked} hours</p>
                    </div>
                  ) : null}     
                  {!todayAttendance.checkOut && (
                    <Button 
                      variant="warning" 
                      className="mt-3"
                      onClick={markCheckout}
                    >
                      {/* <i className="bi bi-box-arrow-right me-2"></i> */}
                      Mark Check-out
                    </Button>
                  )}
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <i className="bi bi-clock text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-2 text-muted">You haven't marked attendance today</p>
                  </div>
                  <Button 
                    variant="dark" 
                    size="lg"
                    onClick={markAttendance}
                  >
                    Mark Attendance
                  </Button>
                
                  <p className="text-muted mt-2 small">
                    Attendance will be automatically marked as "Late" after 8:00 AM
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Attendance Summary
              </h5>
            </Card.Header>
            <Card.Body>
              <Row className="text-center h-100">
                <Col xs={6} className='border-end pe-3'>
                  <div className="">
                    <h3 className="text-success fs-1 mt-5">
                      {attendanceRecords.filter(r => r.status === 'present').length}
                    </h3>
                    <small className="text-muted fs-3 mt-2 d-inline-block">Present</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className=" ">
                    <h3 className="text-warning fs-1 mt-5">
                      {attendanceRecords.filter(r => r.status === 'late').length}
                    </h3>
                    <small className="text-muted  fs-3 mt-2 d-inline-block">Late</small>
                  </div>
                </Col>
              </Row>
              <hr />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-secondary text-white">
              <h5 className="mb-0">
                <i className="bi bi-clock-history me-2"></i>
                Attendance History
              </h5>
            </Card.Header>
            <Card.Body>
              {attendanceRecords.length > 0 ? (
                <Table responsive striped hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Status</th>
                      <th>Hours Worked</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map(record => (
                      <tr key={record._id}>
                        <td>{formatDate(record.date)}</td>
                        <td>{formatTime(record.checkIn)}</td>
                        <td>{formatTime(record.checkOut)}</td>
                        <td>
                          <Badge bg={getStatusBadge(record.status)}>
                            {record.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td>{record.hoursWorked || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  {/* <i className="bi bi-inbox text-muted" style={{ fontSize: '3rem' }}></i> */}
                  <p className="mt-2 text-muted">No attendance records found.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-earmark-text me-2"></i>
            Attendance Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
            />
          </Form.Group>

          {reportData.length > 0 && (
            <div className="mt-4">
              <h6>Attendance for {new Date(reportDate).toLocaleDateString()}</h6>
              <Table striped size="sm">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Status</th>
                    <th>Check-In</th>
                    <th>Check-Out</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.user?.name || 'N/A'}</td>
                      <td>
                        <Badge bg={getStatusBadge(item.status)}>
                          {item.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td>{formatTime(item.checkIn)}</td>
                      <td>{formatTime(item.checkOut)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Attendance;