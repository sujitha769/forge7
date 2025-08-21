import React from 'react';

const DoctorOverview = () => {
  return (
    <div className="container mt-4" style={{ marginRight: '260px' }}>
      <h4 className="mb-3">Overview</h4>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card shadow-sm"><div className="card-body"><h6 className="mb-1">Today Appointments</h6><div className="display-6">0</div></div></div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm"><div className="card-body"><h6 className="mb-1">Patients</h6><div className="display-6">0</div></div></div>
        </div>
        <div className="col-md-4">
          <div className="card shadow-sm"><div className="card-body"><h6 className="mb-1">Prescriptions</h6><div className="display-6">0</div></div></div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;


