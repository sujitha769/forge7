import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RegisterChoice = () => {
  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '560px' }}>
        <h3 className="text-center mb-3">Create your account</h3>
        <p className="text-center text-muted mb-4">Choose how you want to register</p>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <button
              className="btn btn-outline-primary w-100 py-3"
              onClick={() => navigate('/register-doctor')}
            >
              Register as Doctor
            </button>
          </div>
          <div className="col-12 col-md-6">
            <button
              className="btn btn-primary w-100 py-3"
              onClick={() => navigate('/register-client')}
            >
              Register as Client
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <span className="me-2">Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterChoice;


