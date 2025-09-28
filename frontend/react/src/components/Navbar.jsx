 import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [navExpanded, setNavExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setNavExpanded(false);
  };
  const handleToggle = () => {
    setNavExpanded(prev => !prev);
  };
  const handleLinkClick = () => {
    setNavExpanded(false);
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm"
     style={{ 
       backgroundColor: '#6b5b95',
       backdropFilter: 'blur(10px)',
       borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
     }}>
      <div className="container">
        <Link 
          className="navbar-brand fw-bold text-white d-flex align-items-center" 
          
          style={{ 
            fontSize: '1.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          <div 
            className="d-inline-flex align-items-center justify-content-center me-2"
            style={{
              width: '35px',
              height: '35px',
              background: 'linear-gradient(135deg, #ffffff, #f0f0f0)',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            <span style={{ 
              color: '#6b5b95', 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              fontFamily: 'Arial, sans-serif'
            }}>
              A
            </span>
          </div>
          <span style={{ letterSpacing: '1px' }}>ATS</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={navExpanded}
          aria-label="Toggle navigation"
          onClick={handleToggle}
          style={{
            color: 'white',
            border: 'none',
            boxShadow: 'none'
          }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div
          className={`collapse navbar-collapse${navExpanded ? ' show' : ''}`}
          id="navbarNav"
        >
          <ul className="navbar-nav me-auto">
            {currentUser && (
              <>
                {currentUser.role === 'admin' && (
                  <li className="nav-item">
                    <Link 
                      className="nav-link text-white fw-medium" 
                      to="/admin" 
                      onClick={handleLinkClick}
                      style={{
                        transition: 'all 0.3s ease',
                        borderRadius: '0.375rem',
                        padding: '0.5rem 1rem',
                        margin: '0 0.25rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'transparent';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                {currentUser.role === 'employee' && (
                  <>
                    <li className="nav-item">
                      <Link 
                        className="nav-link text-white fw-medium" 
                        to="/attendance" 
                        onClick={handleLinkClick}
                        style={{
                          transition: 'all 0.3s ease',
                          borderRadius: '0.375rem',
                          padding: '0.5rem 1rem',
                          margin: '0 0.25rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <i className="bi bi-calendar-check me-2"></i>
                        Attendance
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className="nav-link text-white fw-medium" 
                        to="/leave" 
                        onClick={handleLinkClick}
                        style={{
                          transition: 'all 0.3s ease',
                          borderRadius: '0.375rem',
                          padding: '0.5rem 1rem',
                          margin: '0 0.25rem'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'transparent';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <i className="bi bi-calendar-event me-2"></i>
                        Leave Management
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav align-items-center">
            {currentUser ? (
              <>
                <li className="nav-item me-3">
                  <span 
                    className="nav-link text-white-50 d-flex align-items-center"
                    style={{ fontSize: '0.9rem' }}
                  >
                    <i className="bi bi-person-circle me-2" style={{ fontSize: '1.2rem' }}></i>
                    Welcome, <strong className="text-white ms-1">{currentUser.name}</strong>
                    <span className="badge bg-light text-dark ms-2" style={{ fontSize: '0.7rem' }}>
                      {currentUser.role}
                    </span>
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    onClick={() => {
                      handleLogout();
                    }}
                    style={{
                      transition: 'all 0.3s ease',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.6)';
                      e.target.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={handleLinkClick}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={handleLinkClick}>
                    Register
                  </Link>
                </li> */}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
