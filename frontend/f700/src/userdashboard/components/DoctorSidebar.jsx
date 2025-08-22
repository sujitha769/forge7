import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const DoctorSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div
      className="d-flex flex-column bg-light border-start vh-100 p-3"
      style={{ width: '250px', position: 'fixed', top: '80px', right: 0, zIndex: 1 }}
    >
      <h5 className="mb-4">Doctor</h5>

      <Link to="/doctor/overview" className={`nav-link mb-2 ${currentPath === '/doctor/overview' ? 'text-primary fw-bold' : 'text-dark'}`}>📊 Overview</Link>
      <Link to="/doctor/appointments" className={`nav-link mb-2 ${currentPath === '/doctor/appointments' ? 'text-primary fw-bold' : 'text-dark'}`}>📅 Appointments</Link>
      <Link to="/doctor/prescriptions" className={`nav-link mb-2 ${currentPath === '/doctor/prescriptions' ? 'text-primary fw-bold' : 'text-dark'}`}>💊 Prescriptions</Link>
      <Link to="/doctor/refer" className={`nav-link mb-2 ${currentPath === '/doctor/refer' ? 'text-primary fw-bold' : 'text-dark'}`}>👥 Refer</Link>
      <Link to="/doctor/settings" className={`nav-link mb-2 ${currentPath === '/doctor/settings' ? 'text-primary fw-bold' : 'text-dark'}`}>⚙️ Settings</Link>
    </div>
  );
};

export default DoctorSidebar;



