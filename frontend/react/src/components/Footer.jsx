import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="py-4" style={{ backgroundColor: '#6b5b95', color: 'white' }}>
      <Container>
        <Row className="align-items-center">
          <Col md={6}>

            <h5 className="text-uppercase mb-0">Attendance Management System</h5>

            <p className="mb-0">
              Empowering employee attendance and productivity with simple tools.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <div className="d-flex justify-content-md-end justify-content-center align-items-center gap-3">
             
              <div className="d-flex gap-3 mb-2">
                <a
                  href="mailto:rohanshirsath004@gmail.com"
                  className="text-white text-decoration-none"
                  title="Email"
                >
                  <i className="bi bi-envelope-fill" style={{ fontSize: '1.5rem' }}></i>
                </a>
                <a
                  href="https://linkedin.com/in/rohanshirsath"
                  className="text-white text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                >
                  <i className="bi bi-linkedin" style={{ fontSize: '1.5rem' }}></i>
                </a>
                <a
                  href="https://github.com/RohanShirsath4"
                  className="text-white text-decoration-none"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                >
                  <i className="bi bi-github" style={{ fontSize: '1.5rem' }}></i>
                </a>
              </div>
            </div>
            <div className="text-muted small">
              <p className="mb-0">This project created by <strong>Rohan</strong></p>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
