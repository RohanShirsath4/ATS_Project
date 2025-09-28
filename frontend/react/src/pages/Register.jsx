import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);

      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);

      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: 'linear-gradient(135deg, #6b5b95 0%, #4a4a8a 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          animation: 'float 6s ease-in-out infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-30%',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite reverse'
        }}
      />

      <div className="col-11 col-sm-8 col-md-6 col-lg-5 col-xl-4">
        <div
          className="card shadow-lg border-0"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)'
          }}
        >
          <div className="card-body p-3">
            <h5 className="text-center mb-2 fw-semibold" style={{ color: ' #4a4a8a' }}>
              Create Account
            </h5>

            {error && (
              <div className="alert alert-danger border-0 shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="name" className="form-label fw-medium small" style={{ color: '#555' }}>
                  <i className="bi bi-person me-1"></i>Full Name
                </label>
                <input
                  type="text"
                  className="form-control border-0 shadow-sm"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="email" className="form-label fw-medium small" style={{ color: '#555' }}>
                  <i className="bi bi-envelope me-1"></i>Email Address
                </label>
                <input
                  type="email"
                  className="form-control border-0 shadow-sm"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="password" className="form-label fw-medium small" style={{ color: '#555' }}>
                  <i className="bi bi-lock me-1"></i>Password
                </label>
                <input
                  type="password"
                  className="form-control border-0 shadow-sm"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Create a password"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="confirmPassword" className="form-label fw-medium small" style={{ color: '#555' }}>
                  <i className="bi bi-lock-fill me-1"></i>Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control border-0 shadow-sm"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.9rem'
                  }}
                  placeholder="Confirm your password"
                />
              </div>

              <div className="mb-2">
                <label htmlFor="role" className="form-label fw-medium small" style={{ color: '#555' }}>
                  <i className="bi bi-person-badge me-1"></i>Role
                </label>
                <select
                  className="form-select border-0 shadow-sm"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="btn w-100 border-0 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #6b5b95, #4a4a8a)',
                  borderRadius: '8px',
                  padding: '8px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease'
                }}
                disabled={loading}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 15px 35px rgba(107, 91, 149, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 5px 15px rgba(107, 91, 149, 0.3)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bi bi-person-plus me-2"></i>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-2">
              <p className="text-muted mb-0 small">
                Already have an account?
                <Link
                  to="/login"
                  className="text-decoration-none fw-medium ms-1"
                  style={{ color: '#6b5b95' }}
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
