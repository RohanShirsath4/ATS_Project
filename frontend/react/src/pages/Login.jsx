import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      const result = await login(email, password);
      
      if (result.success) {
        // Redirect based on user role
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/attendance');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Failed to login');
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

      <div className="col-md-6 col-lg-4 col-xl-3">
        <div 
          className="card shadow-lg border-0"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 45px rgba(0, 0, 0, 0.1)',
            maxHeight: '600px'
          }}
        >
          <div className="card-body p-4">
        
            
            <h5 className="text-center mb-3 fw-bold" style={{ color: '#4a4a8a' }}>
                 Login
            </h5>
            
            {error && (
              <div className="alert alert-danger border-0 shadow-sm" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-medium" style={{ color: '#555' }}>
                  <i className="bi bi-envelope me-2"></i>Email Address
                </label>
                <input
                  type="email"
                  className="form-control border-0 shadow-sm"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    padding: '10px 14px'
                  }}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="password" className="form-label fw-medium" style={{ color: '#555' }}>
                  <i className="bi bi-lock me-2"></i>Password
                </label>
                <input
                  type="password"
                  className="form-control border-0 shadow-sm"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    backgroundColor: '#f8f9fa',
                    borderRadius: '10px',
                    padding: '10px 14px'
                  }}
                  placeholder="Enter your password"
                />
              </div>
              
              <button 
                type="submit" 
                className="btn w-100 border-0 shadow-sm"
                style={{ 
                  background: 'linear-gradient(135deg, #6b5b95, #4a4a8a)',
                  borderRadius: '10px',
                  padding: '10px',
                  fontWeight: '600',
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
                    Signing In...
                  </>
                ) : (
                  <>
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </>
                )}
              </button>
            </form>
            
            <div className="text-center mt-3">
              <p className="text-muted mb-0">
                Don't have an account? 
                <Link 
                  to="/register" 
                  className="text-decoration-none fw-medium ms-1"
                  style={{ color: '#6b5b95' }}
                >
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;