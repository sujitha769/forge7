import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'patient' // Default to patient
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5700/user/loginuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Enforce role match: selected role must equal registered role
        const registeredRole = (data.role || '').toLowerCase();
        const selectedRole = (formData.role || '').toLowerCase();
        if (registeredRole && selectedRole && registeredRole !== selectedRole) {
          // Show popup and stop login
          alert(`You're registered as ${registeredRole}. Please select "${registeredRole}" to log in.`);
          // Optionally auto-correct the selection to the registered role
          setFormData(prev => ({ ...prev, role: registeredRole }));
          return;
        }

        localStorage.setItem('logintoken', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', registeredRole || selectedRole);
        
        // Navigate based on role
        const finalRole = registeredRole || selectedRole;
        if (finalRole === 'doctor') {
          navigate('/doctor-overview');
        } else {
          navigate('/profile');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="card shadow-sm" style={{ width: '400px' }}>
        <div className="card-body p-4">
          <h3 className="text-center mb-4">Login</h3>
          
          {/* Role Selection */}
          <div className="mb-4">
            <label className="form-label fw-bold">Login as:</label>
            <div className="d-flex gap-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="patient"
                  value="patient"
                  checked={formData.role === 'patient'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="patient">
                  Patient
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="doctor"
                  value="doctor"
                  checked={formData.role === 'doctor'}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="doctor">
                  Doctor
                </label>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-dark w-100"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="text-center mt-3">
            <p className="mb-0">
              Don't have an account?{' '}
              <a href="/register" className="text-decoration-none">Register here</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
