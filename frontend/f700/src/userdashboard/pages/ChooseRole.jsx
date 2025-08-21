import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRole = () => {
  const navigate = useNavigate();

  const registeredRole = localStorage.getItem('role');
  const choose = (role) => {
    // Only allow choosing the role that was registered
    if (registeredRole && registeredRole !== role) {
      alert(`This account is registered as ${registeredRole}. Please choose ${registeredRole}.`);
      return;
    }
    localStorage.setItem('role', role);
    if (role === 'doctor') navigate('/doctor/overview');
    else navigate('/profile');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '560px' }}>
        <h3 className="text-center mb-3">Continue as</h3>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <button className="btn btn-outline-primary w-100 py-3" onClick={() => choose('doctor')} disabled={registeredRole === 'client'}>Doctor</button>
          </div>
          <div className="col-12 col-md-6">
            <button className="btn btn-primary w-100 py-3" onClick={() => choose('client')} disabled={registeredRole === 'doctor'}>Patient</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseRole;


