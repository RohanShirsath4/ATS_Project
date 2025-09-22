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
import { redirect } from 'react-router-dom';

const Leave = () => {
  const { currentUser } = useAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    leaveType: 'casual'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [myLeaves, setMyLeaves] = useState([]);

  // const [showDetailsModal, setShowDetailsModal] = useState(false);
  // const [selectedLeave, setSelectedLeave] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchLeaveRequests();
    }, 15000);

    const onVisibilityChange = () => {
      if (!document.hidden) {
        fetchLeaveRequests();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);



 
  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      // const result = await axios.get('/api/leave/');
       const res = await axios.get('/api/leave/records');
       console.log(res.data)
      setLeaveRequests(res.data.summary);
 
      calculateStats(res.data.records);
    } catch (error) {
      // console.error(error);
      setMessage('Error loading leave requests',error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLeaves = async () => {
  try {
    const res = await axios.get('/api/leave/my-requests');
    setMyLeaves(res.data); // expects an array
  } catch (error) {
    console.error('Failed to load my leaves', error);
  }
};
fetchMyLeaves()

 

  const calculateStats = (Leaves) => {
    const stats = {
      total: Leaves.length,
      pending: Leaves.filter(leave => leave.status === 'pending').length,
      approved: Leaves.filter(leave => leave.status === 'approved').length,
      rejected: Leaves.filter(leave => leave.status === 'rejected').length
    };
    setStats(stats);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setMessage('Start date cannot be after end date');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('');
      
      await axios.post('/api/leave/apply', formData);
      setMessage('Leave application submitted successfully!');
      setShowForm(false);
      setFormData({ 
        startDate: '', 
        endDate: '', 
        reason: '',
        leaveType: 'casual'
      });
      fetchLeaveRequests();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error submitting leave application');
    } finally {
      setLoading(false);
    }
  };

  // const viewLeaveDetails = (leave) => {
  //   setSelectedLeave(leave);
  //   setShowDetailsModal(true);
  // };

  const cancelLeave = async (leaveId) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`/api/leave/${leaveId}`);
      setMessage('Leave request cancelled successfully!');
      fetchLeaveRequests();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error cancelling leave request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      case 'pending':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getLeaveTypeBadge = (type) => {
    switch (type) {
      case 'casual':
        return 'primary';
      case 'sick':
        return 'info';
      case 'vacation':
        return 'success';
      case 'emergency':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;  
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && leaveRequests.length === 0) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading leave data...</p>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h1 className="display-5 fw-bold mb-0">Leave Management</h1>
              <p className="lead mb-0">Apply for leave and track your requests</p>
            </div>
            <div>
              <Button 
                variant="outline-secondary"
                onClick={fetchLeaveRequests && fetchLeaveRequests }
                
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {message && (
        <Alert variant={message.includes('success') ? 'success' : 'danger'} dismissible onClose={() => setMessage('')}>
          {message}
        </Alert>
      )}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm text-center">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-file-text text-primary" style={{ fontSize: '2rem' }}></i>
              </div>
              <h3 className="text-primary">{stats.total}</h3>
              <p className="text-muted mb-0">Total Leaves</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm text-center">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-clock-history text-warning" style={{ fontSize: '2rem' }}></i>
              </div>
              <h3 className="text-warning">{stats.pending}</h3>
              <p className="text-muted mb-0">Pending</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm text-center">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-check-circle text-success" style={{ fontSize: '2rem' }}></i>
              </div>
              <h3 className="text-success">{stats.approved}</h3>
              <p className="text-muted mb-0">Approved</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} className="mb-3">
          <Card className="h-100 border-0 shadow-sm text-center">
            <Card.Body>
              <div className="mb-2">
                <i className="bi bi-x-circle text-danger" style={{ fontSize: '2rem' }}></i>
              </div>
              <h3 className="text-danger">{stats.rejected}</h3>
              <p className="text-muted mb-0">Rejected</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
<Row className="mb-5">
  <Col>
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-secondary text-white">
        <h5 className="mb-0">
          <i className="bi bi-list-ul me-2"></i>
          My Leave Requests
        </h5>
      </Card.Header>
      <Card.Body>
        {myLeaves.length === 0 ? (
          <p>No leave requests found.</p>
        ) : (
          <Table striped bordered responsive>
            <thead>
              <tr>
                {/* <th>Type</th> */}
                <th>Start</th>
                <th>End</th>
                <th>Days</th>
                <th>Status</th>
                <th>Applied On</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.map((leave) => (
                <tr key={leave._id}>
                  {/* <td>
                    <Badge bg={getLeaveTypeBadge(leave.leaveType)}>
                      {leave.leaveType}
                    </Badge>
                  </td> */}
                  <td>{formatDate(leave.startDate)}</td>
                  <td>{formatDate(leave.endDate)}</td>
                  <td>{calculateLeaveDays(leave.startDate, leave.endDate)}</td>
                  <td>
                    <Badge bg={getStatusBadge(leave.status)}>
                      {leave.status}
                    </Badge>
                  </td>
                  <td>{formatDate(leave.appliedOn)}</td>
                  <td>{leave.reason}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  </Col>
</Row>

      <Row className="mb-4">
        <Col>
          <Button 
            variant="dark" 
            onClick={() => setShowForm(!showForm)}
            className="me-2"
          >
            <i className={`bi ${showForm ? 'bi-x-circle' : 'bi-plus-circle'} me-2`}></i>
            {showForm ? 'Cancel' : 'Apply for Leave'}
          </Button>
          
          {currentUser.role === 'admin' && (
            <Button 
              variant="outline-info" 
              as="a" 
              href="/admin#leaves"
            >
              <i className="bi bi-gear me-2"></i>
              Manage Leaves (Admin)
            </Button>
          )}
        </Col>
      </Row>
      {showForm && (
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-dark text-white">
                <h5 className="mb-0">
                  <i className="bi bi-pencil-square me-2"></i>
                  New Leave Application
                </h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Leave Type</Form.Label>
                        <Form.Select
                          name="leaveType"
                          value={formData.leaveType}
                          onChange={handleChange}
                          required
                        >
                          <option value="casual">Casual Leave</option>
                          <option value="sick">Sick Leave</option>
                          <option value="vacation">Vacation</option>
                          <option value="emergency">Emergency</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Duration: {formData.startDate && formData.endDate ? `${calculateLeaveDays(formData.startDate, formData.endDate)} days` : 'Select dates'}
                        </Form.Label>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={formData.endDate}
                          onChange={handleChange}
                          min={formData.startDate || new Date().toISOString().split('T')[0]}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Reason</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="Please provide a reason for your leave"
                      required
                    />
                  </Form.Group>
                  
                  <Button 
                    variant="dark" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Submit Application
                      </>
                    )}
                  </Button>


                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Leave;