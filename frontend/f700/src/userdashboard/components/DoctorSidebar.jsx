import React from 'react';
import { Link } from 'react-router-dom';

const DoctorSidebar = () => {
  return (
    <div
      className="d-flex flex-column bg-light border-start vh-100 p-3"
      style={{ width: '250px', position: 'fixed', top: '56px', right: 0 }}
    >
      <h5 className="mb-4">Doctor</h5>

      <Link to="/doctor/overview" className="nav-link text-dark mb-2">📊 Overview</Link>
      <Link to="/doctor/appointments" className="nav-link text-dark mb-2">📅 Appointments</Link>
      <Link to="/doctor/patients" className="nav-link text-dark mb-2">👥 Patients</Link>
      <Link to="/doctor/prescriptions" className="nav-link text-dark mb-2">💊 Prescriptions</Link>
      <Link to="/doctor/settings" className="nav-link text-dark mb-2">⚙️ Settings</Link>
    </div>
  );
};

export default DoctorSidebar;


