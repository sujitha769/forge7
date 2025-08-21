import React from 'react';

const Profile = () => {
  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row">
        {/* Profile Information Section */}
        <div className="col-12 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>
                Profile Information
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name:</label>
                    <p className="text-muted mb-0">Jane Doe</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Phone:</label>
                    <p className="text-muted mb-0">-</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Address:</label>
                    <p className="text-muted mb-0">-</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Emergency Contact:</label>
                    <p className="text-muted mb-0">-</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email:</label>
                    <p className="text-muted mb-0">alapatipranavi@gmail.com</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Date of Birth:</label>
                    <p className="text-muted mb-0">-</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments Section */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Upcoming Appointments</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="mb-1 fw-bold">Dr. Smith</h6>
                    <p className="text-muted mb-1 small">City Medical Center</p>
                    <p className="text-muted mb-1 small">Consultation</p>
                    <p className="text-muted mb-0 small">2024-12-15 at 10:00 AM</p>
                  </div>
                  <span className="badge bg-success">Confirmed</span>
                </div>
              </div>
              <hr />
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="mb-1 fw-bold">Dr. Johnson</h6>
                    <p className="text-muted mb-1 small">General Hospital</p>
                    <p className="text-muted mb-1 small">Follow-up</p>
                    <p className="text-muted mb-0 small">2024-12-20 at 2:30 PM</p>
                  </div>
                  <span className="badge bg-warning text-dark">Pending</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Prescriptions Section */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Active Prescriptions</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="mb-1 fw-bold">Amoxicillin</h6>
                    <p className="text-muted mb-0 small">500mg twice daily</p>
                  </div>
                  <span className="badge bg-primary">Active</span>
                </div>
              </div>
              <hr />
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="mb-1 fw-bold">Ibuprofen</h6>
                    <p className="text-muted mb-0 small">200mg as needed</p>
                  </div>
                  <span className="badge bg-primary">Active</span>
                </div>
              </div>
              <hr />
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 className="mb-1 fw-bold">Lisinopril</h6>
                    <p className="text-muted mb-0 small">10mg once daily</p>
                  </div>
                  <span className="badge bg-primary">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
