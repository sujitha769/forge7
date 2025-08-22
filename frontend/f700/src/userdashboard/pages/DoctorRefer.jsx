import React, { useState, useEffect } from 'react';

const DoctorRefer = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [referralForm, setReferralForm] = useState({
    patientName: '',
    patientId: '',
    specialty: '',
    reason: '',
    urgency: 'normal'
  });

  useEffect(() => {
    // Simulate loading referrals data
    setTimeout(() => {
      setReferrals([
        { id: 1, patientName: 'John Doe', specialty: 'Cardiology', date: '2025-01-15', status: 'Pending', fromDoctor: 'Dr. Smith' },
        { id: 2, patientName: 'Jane Smith', specialty: 'Neurology', date: '2025-01-16', status: 'Completed', fromDoctor: 'Dr. Johnson' }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Simulate searching for doctors
  const handleSearchDoctors = () => {
    if (searchQuery.trim()) {
      // Simulate API call to find doctors
      const mockDoctors = [
        { id: 1, name: 'Dr. Sarah Wilson', specialty: 'Cardiology', hospital: 'City General Hospital' },
        { id: 2, name: 'Dr. Michael Brown', specialty: 'Neurology', hospital: 'Medical Center' },
        { id: 3, name: 'Dr. Emily Davis', specialty: 'Orthopedics', hospital: 'Regional Hospital' }
      ].filter(doctor => 
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(mockDoctors);
    } else {
      setSearchResults([]);
    }
  };

  const handleSendReferral = (doctor) => {
    setSelectedDoctor(doctor);
    setShowSendModal(true);
  };

  const handleReferralSubmit = (e) => {
    e.preventDefault();
    // Simulate sending referral
    const newReferral = {
      id: Date.now(),
      patientName: referralForm.patientName,
      specialty: referralForm.specialty,
      date: new Date().toISOString().split('T')[0],
      status: 'Sent',
      toDoctor: selectedDoctor.name,
      reason: referralForm.reason,
      urgency: referralForm.urgency
    };
    setReferrals(prev => [newReferral, ...prev]);
    setShowSendModal(false);
    setReferralForm({
      patientName: '',
      patientId: '',
      specialty: '',
      reason: '',
      urgency: 'normal'
    });
    alert('Referral sent successfully!');
  };

  const handleAcceptReferral = (referralId) => {
    setReferrals(prev => 
      prev.map(ref => 
        ref.id === referralId 
          ? { ...ref, status: 'Accepted' }
          : ref
      )
    );
    alert('Referral accepted!');
  };

  const handleRejectReferral = (referralId) => {
    setReferrals(prev => 
      prev.map(ref => 
        ref.id === referralId 
          ? { ...ref, status: 'Rejected' }
          : ref
      )
    );
    alert('Referral rejected!');
  };

  if (loading) {
    return (
      <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4">Referral Management</h2>
          
          {/* Doctor Search Section */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Search for Doctors</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Search doctors by name or specialty..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button 
                      className="btn btn-primary" 
                      type="button"
                      onClick={handleSearchDoctors}
                    >
                      <i className="fas fa-search me-2"></i>Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-3">
                  <h6>Search Results:</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Doctor Name</th>
                          <th>Specialty</th>
                          <th>Hospital</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.map((doctor) => (
                          <tr key={doctor.id}>
                            <td>{doctor.name}</td>
                            <td>{doctor.specialty}</td>
                            <td>{doctor.hospital}</td>
                            <td>
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleSendReferral(doctor)}
                              >
                                <i className="fas fa-paper-plane me-1"></i>Send Referral
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Referrals Table */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Referral Management</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Patient Name</th>
                      <th>Specialty</th>
                      <th>Referral Date</th>
                      <th>Status</th>
                      <th>From/To Doctor</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals.map((referral) => (
                      <tr key={referral.id}>
                        <td>{referral.patientName}</td>
                        <td>{referral.specialty}</td>
                        <td>{referral.date}</td>
                        <td>
                          <span className={`badge ${
                            referral.status === 'Completed' ? 'bg-success' : 
                            referral.status === 'Accepted' ? 'bg-info' :
                            referral.status === 'Rejected' ? 'bg-danger' :
                            referral.status === 'Sent' ? 'bg-warning' : 'bg-secondary'
                          }`}>
                            {referral.status}
                          </span>
                        </td>
                        <td>{referral.fromDoctor || referral.toDoctor}</td>
                        <td>
                          {referral.status === 'Pending' && (
                            <>
                              <button 
                                className="btn btn-sm btn-success me-1"
                                onClick={() => handleAcceptReferral(referral.id)}
                              >
                                <i className="fas fa-check"></i> Accept
                              </button>
                              <button 
                                className="btn btn-sm btn-danger me-1"
                                onClick={() => handleRejectReferral(referral.id)}
                              >
                                <i className="fas fa-times"></i> Reject
                              </button>
                            </>
                          )}
                          <button className="btn btn-sm btn-outline-primary me-1">
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-success me-1">
                            <i className="fas fa-edit"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {referrals.length === 0 && (
                <div className="text-center py-4">
                  <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                  <p className="text-muted">No referrals found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Send Referral Modal */}
      {showSendModal && selectedDoctor && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Send Referral to {selectedDoctor.name}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSendModal(false)}
                ></button>
              </div>
              <form onSubmit={handleReferralSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Patient Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={referralForm.patientName}
                      onChange={(e) => setReferralForm(prev => ({ ...prev, patientName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Patient ID</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={referralForm.patientId}
                      onChange={(e) => setReferralForm(prev => ({ ...prev, patientId: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Specialty</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={referralForm.specialty}
                      onChange={(e) => setReferralForm(prev => ({ ...prev, specialty: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason for Referral</label>
                    <textarea 
                      className="form-control" 
                      rows="3"
                      value={referralForm.reason}
                      onChange={(e) => setReferralForm(prev => ({ ...prev, reason: e.target.value }))}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Urgency Level</label>
                    <select 
                      className="form-select"
                      value={referralForm.urgency}
                      onChange={(e) => setReferralForm(prev => ({ ...prev, urgency: e.target.value }))}
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSendModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Send Referral
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {showSendModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default DoctorRefer;
