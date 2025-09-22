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
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={handleLinkClick}>
          ATS
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={navExpanded}
          aria-label="Toggle navigation"
          onClick={handleToggle}
        >
          <span className="navbar-toggler-icon"></span>
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
                    <Link className="nav-link" to="/admin" onClick={handleLinkClick}>
                      Admin Dashboard
                    </Link>
                  </li>
                )}

                {currentUser.role === 'employee' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/attendance" onClick={handleLinkClick}>
                        Attendance
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/leave" onClick={handleLinkClick}>
                        Leave Management
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Welcome, {currentUser.name} ({currentUser.role})
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-light btn-sm"
                    onClick={() => {
                      handleLogout();
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" onClick={handleLinkClick}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register" onClick={handleLinkClick}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
