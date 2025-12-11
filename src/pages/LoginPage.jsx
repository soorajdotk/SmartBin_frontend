import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#008080' }}>
          Welcome Back
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '24px', color: '#6c757d', fontSize: '14px' }}>
          Sign in to your account
        </p>

        {/* remove demo notice once fully ready */}
        <div className="demo-notice">
          <strong>Note:</strong> OTP based Login available.
        </div>
     
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              autoComplete="off"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="demo-pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="off"
              placeholder="Enter your password"
            />
          </div>

          {/* Remember Me */}
          <div style={{ width: "100%", marginTop: "10px",marginBottom:"3px",marginLeft: "10px" , display: "flex" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                style={{ cursor: "pointer" }}
              />
              <span style={{ fontSize: "14px", fontWeight: "500", color: "#333" }}>Remember Me</span>
            </label>
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'right', marginTop: '6px', fontSize: '14px' }}>
          <Link to="/forgot-password">Forgot Password?</Link>
        </p>
         
        <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '16px' }}>
          Don't have an account?{' '}
          <Link to="/register">Create one here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
