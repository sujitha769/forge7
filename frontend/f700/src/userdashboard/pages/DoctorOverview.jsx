import React, { useEffect, useState } from "react";

const DoctorOverview = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem('username');
    if (!username) {
      setError('Not logged in');
      setLoading(false);
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5700/user/profile/${username}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid" style={{ paddingLeft: "20px", paddingRight: "20px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Doctor Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, Dr. {user?.name || 'User'}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="fas fa-calendar-alt fs-2 text-primary"></i>
              </div>
              <h4 className="card-title mb-1">Today's Appointments</h4>
              <h2 className="text-primary mb-0">8</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="fas fa-users fs-2 text-success"></i>
              </div>
              <h4 className="card-title mb-1">Total Patients</h4>
              <h2 className="text-success mb-0">3</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="fas fa-file-medical fs-2 text-warning"></i>
              </div>
              <h4 className="card-title mb-1">Total Prescriptions</h4>
              <h2 className="text-warning mb-0">5</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center">
              <div className="d-flex align-items-center justify-content-center mb-3">
                <i className="fas fa-stethoscope fs-2 text-info"></i>
              </div>
              <h4 className="card-title mb-1">Specialization</h4>
              <h6 className="text-info mb-0">General Medicine</h6>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Profile */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Professional Profile</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name:</label>
                    <p className="mb-0">Dr. {user?.name || '-'}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Specialization:</label>
                    <p className="mb-0">General Medicine</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">License:</label>
                    <p className="mb-0 text-muted">-</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email:</label>
                    <p className="mb-0">{user?.email || '-'}</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Hospital:</label>
                    <p className="mb-0">City Medical Center</p>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Experience:</label>
                    <p className="mb-0 text-muted">- years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Schedule and Recent Patients */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Today's Schedule</h5>
            </div>
            <div className="card-body">
              <div className="mb-3 p-3 border rounded">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-1 fw-bold">John Doe</h6>
                  <span className="badge bg-success text-white">Confirmed</span>
                </div>
                <p className="mb-1 text-muted">Consultation</p>
                <p className="mb-1 small">ID: P001</p>
                <p className="mb-0 small">Time: 10:00 AM</p>
              </div>
              <div className="p-3 border rounded">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-1 fw-bold">Jane Smith</h6>
                  <span className="text-muted small">Pending</span>
                </div>
                <p className="mb-1 text-muted">Follow-up</p>
                <p className="mb-1 small">ID: P002</p>
                <p className="mb-0 small">Time: 2:30 PM</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Recent Patients</h5>
            </div>
            <div className="card-body" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <div className="mb-3 p-3 border rounded">
                <h6 className="mb-1 fw-bold">John Doe</h6>
                <p className="mb-1 text-muted">Hypertension</p>
                <p className="mb-1 small">ID: P001</p>
                <p className="mb-0 small">Date: 2024-12-01</p>
              </div>
              <div className="p-3 border rounded">
                <h6 className="mb-1 fw-bold">Jane Smith</h6>
                <p className="mb-1 text-muted">Migraine</p>
                <p className="mb-1 small">ID: P002</p>
                <p className="mb-0 small">Date: 2024-11-28</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorOverview;
