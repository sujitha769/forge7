import React, { useState, useEffect } from 'react';
import './DoctorPrescriptions.css';

const DoctorPrescriptions = () => {
  const [enteredId, setEnteredId] = useState('');
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    prescription: '', 
    formulation: 'Tablet', 
    dosage: '', 
    diseaseName: '', 
    prescribedBy: '' 
  });
  const [saving, setSaving] = useState(false);
  
  // Sample patient data
  const samplePatients = [
    { id: 'P001', name: 'John Doe' },
    { id: 'P002', name: 'Jane Smith' },
    { id: 'P003', name: 'Robert Johnson' }
  ];

  // Test render
  console.log('DoctorPrescriptions rendering...');

  const handleSearch = async () => {
    if (!enteredId.trim()) {
      setError('Please enter a Patient ID');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, use sample patient data if it matches a sample ID
      const samplePatient = samplePatients.find(p => p.id === enteredId);
      
      if (samplePatient) {
        // Create mock patient data for demo
        const mockPatient = {
          userId: samplePatient.id,
          name: samplePatient.name,
          email: `${samplePatient.name.toLowerCase().replace(' ', '.')}@example.com`,
          phone: '+1 (555) 123-4567',
          address: '123 Medical Drive, Healthcare City',
          role: 'client'
        };
        
        setClient(mockPatient);
        
        // Create mock prescriptions for demo
        if (samplePatient.id === 'P001') {
          setPrescriptions([
            { _id: '1', prescription: 'Amoxicillin', formulation: 'Tablet', dosage: '500mg twice daily for 7 days', diseaseName: 'Bacterial Infection', prescribedBy: 'Dr. Smith' },
            { _id: '2', prescription: 'Ibuprofen', formulation: 'Tablet', dosage: '400mg as needed for pain', diseaseName: 'Inflammation', prescribedBy: 'Dr. Johnson' }
          ]);
        } else if (samplePatient.id === 'P002') {
          setPrescriptions([
            { _id: '3', prescription: 'Lisinopril', formulation: 'Tablet', dosage: '10mg once daily', diseaseName: 'Hypertension', prescribedBy: 'Dr. Williams' }
          ]);
        } else {
          // P003 has no prescriptions
          setPrescriptions([]);
        }
        
        setLoading(false);
        return;
      }
      
      // If not a sample patient, try to fetch from API
      const res = await fetch(`http://localhost:5700/user/profile-by-id/${encodeURIComponent(enteredId)}`);
      
      if (res.status === 404) {
        setError('No patient found with this ID');
        setClient(null);
        setPrescriptions([]);
        return;
      }
      
      if (!res.ok) throw new Error('Failed to fetch patient data');
      
      const data = await res.json();
      
      if (data.role !== 'client') {
        setError('The entered ID belongs to a doctor. Please enter a Patient ID.');
        setClient(null);
        setPrescriptions([]);
        return;
      }
      
      setClient(data);
      
      // Fetch prescriptions
      const pr = await fetch(`http://localhost:5700/prescriptions/${encodeURIComponent(enteredId)}`);
      if (pr.ok) {
        const items = await pr.json();
        const filtered = Array.isArray(items) ? items.filter(i => !i.status || i.status === 'active') : [];
        setPrescriptions(filtered);
      } else {
        setPrescriptions([]);
      }
      
    } catch (e) {
      setError(e.message);
      setClient(null);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => {
    if (!client) return;
    setForm({ prescription: '', formulation: 'Tablet', dosage: '', diseaseName: '', prescribedBy: '' });
    setShowForm(true);
  };

  const handleSavePrescription = async () => {
    if (!client || !form.prescription.trim() || !form.dosage.trim()) {
      alert('Prescription name and dosage are required');
      return;
    }
    
    try {
      setSaving(true);
      const res = await fetch('http://localhost:5700/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: client.userId,
          prescription: form.prescription.trim(),
          formulation: form.formulation.trim(),
          dosage: form.dosage.trim(),
          diseaseName: form.diseaseName.trim() || undefined,
          prescribedBy: form.prescribedBy.trim() || undefined,
        }),
      });
      
      if (!res.ok) throw new Error('Failed to add prescription');
      
      setShowForm(false);
      setForm({ prescription: '', formulation: 'Tablet', dosage: '', diseaseName: '', prescribedBy: '' });
      
      // Refresh prescriptions
      const pr = await fetch(`http://localhost:5700/prescriptions/${encodeURIComponent(client.userId)}`);
      if (pr.ok) {
        const items = await pr.json();
        const filtered = Array.isArray(items) ? items.filter(i => !i.status || i.status === 'active') : [];
        setPrescriptions(filtered);
      }
      
      alert('Prescription added successfully!');
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid pt-3" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Prescriptions</h2>
          <p className="text-muted mb-0">Search by Client/User ID (from client profile)</p>
        </div>
      </div>

      {/* Patient Search */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Patient Search</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Enter Patient ID</label>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., P001"
                      value={enteredId}
                      onChange={(e) => setEnteredId(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleSearch} disabled={loading}>
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Searching...
                        </>
                      ) : (
                        <>Search Patient</>
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="alert alert-danger mt-2 mb-0">{error}</div>
                  )}
                </div>
                <div className="col-md-6">
                  <div className="card bg-light border-0">
                    <div className="card-body">
                      <h6 className="card-title">Available Patient IDs:</h6>
                      <div className="mb-2">
                        {samplePatients.map(patient => (
                          <button 
                            key={patient.id}
                            className="btn btn-sm btn-outline-primary me-2 mb-1"
                            onClick={() => {
                              setEnteredId(patient.id);
                              // Optional: auto-search when clicking a patient ID
                              // setTimeout(() => handleSearch(), 100);
                            }}
                          >
                            {patient.id} ({patient.name})
                          </button>
                        ))}
                      </div>
                      <small className="text-muted">Click on an ID to automatically fill the search field</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Found Success Message */}
      {client && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="alert alert-success d-flex align-items-center" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              <div>
                <strong>Client Found!</strong> {client.name} ({client.userId}) - {prescriptions.length} active prescription(s)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Information */}
      {client && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Patient Information</h5>
                <div className="badge bg-success">Patient Found</div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3 text-center mb-3 mb-md-0">
                    <div className="avatar-circle mx-auto mb-3">
                      <span className="avatar-text">{client.name.charAt(0)}</span>
                    </div>
                    <h5>{client.name}</h5>
                    <p className="text-muted mb-0">Patient ID: {client.userId}</p>
                  </div>
                  <div className="col-md-9">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="patient-info-card">
                          <div className="info-label">Email</div>
                          <div className="info-value">{client.email || '-'}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="patient-info-card">
                          <div className="info-label">Phone</div>
                          <div className="info-value">{client.phone || 'Not provided'}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="patient-info-card">
                          <div className="info-label">Address</div>
                          <div className="info-value">{client.address || 'Not provided'}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="patient-info-card">
                          <div className="info-label">Role</div>
                          <div className="info-value">{client.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescriptions */}
      {client && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Prescriptions</h5>
                <button className="btn btn-primary btn-sm" onClick={handleOpenForm}>
                  <i className="fas fa-plus me-2"></i>
                  Add New Prescription
                </button>
              </div>
              <div className="card-body">
                {prescriptions.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="mb-3">
                      <i className="fas fa-prescription fa-3x text-muted"></i>
                    </div>
                    <h5>No Active Prescriptions</h5>
                    <p className="text-muted">This patient doesn't have any active prescriptions yet.</p>
                    <button className="btn btn-primary add-prescription-btn py-3 px-4" onClick={handleOpenForm}>
                      <i className="fas fa-plus me-2"></i>
                      Add First Prescription
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="row">
                      {prescriptions.map((prescription, index) => (
                        <div className="col-md-6 mb-3" key={index}>
                          <div className="card prescription-card h-100">
                            <div className="card-body">
                              <div className="prescription-header">
                                <h6 className="prescription-title">{prescription.prescription}</h6>
                                <span className="badge bg-primary prescription-badge">{prescription.formulation}</span>
                              </div>
                              <div className="prescription-detail">
                                <div className="detail-label">Dosage:</div>
                                <div className="detail-value">{prescription.dosage}</div>
                              </div>
                              <div className="prescription-detail">
                                <div className="detail-label">Disease:</div>
                                <div className="detail-value">{prescription.diseaseName}</div>
                              </div>
                              <div className="prescription-detail">
                                <div className="detail-label">Prescribed By:</div>
                                <div className="detail-value">{prescription.prescribedBy}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="col-md-6 mb-3">
                        <div className="card h-100">
                          <button 
                            className="btn add-prescription-btn h-100 d-flex flex-column justify-content-center align-items-center" 
                            onClick={handleOpenForm}
                          >
                            <i className="fas fa-plus fa-2x mb-2"></i>
                            <span>Add Another Prescription</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div>
                        <small className="text-muted">
                          Showing {prescriptions.length} active prescriptions
                        </small>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Prescription Modal */}
      {showForm && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  <i className="fas fa-prescription-bottle-alt me-2"></i>
                  Add New Prescription
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <div className="prescription-form-container">
                  <div className="form-section-title">Medication Details</div>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Prescription Name *</label>
                      <input 
                        className="form-control" 
                        placeholder="e.g., Amoxicillin 500mg"
                        value={form.prescription} 
                        onChange={e => setForm({ ...form, prescription: e.target.value })} 
                        required
                      />
                      <small className="text-muted">Enter the name of the medication</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Formulation *</label>
                      <select 
                        className="form-select"
                        value={form.formulation} 
                        onChange={e => setForm({ ...form, formulation: e.target.value })}
                      >
                        <option value="Tablet">Tablet</option>
                        <option value="Capsule">Capsule</option>
                        <option value="Syrup">Syrup</option>
                        <option value="Injection">Injection</option>
                        <option value="Cream">Cream</option>
                        <option value="Drops">Drops</option>
                        <option value="Ointment">Ointment</option>
                        <option value="Inhaler">Inhaler</option>
                        <option value="Powder">Powder</option>
                        <option value="Other">Other</option>
                      </select>
                      <small className="text-muted">Select the form of medication</small>
                    </div>
                  </div>
                  
                  <div className="form-section-title">Dosage & Condition</div>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Dosage *</label>
                      <input 
                        className="form-control" 
                        placeholder="e.g., 1 tablet twice daily for 7 days"
                        value={form.dosage} 
                        onChange={e => setForm({ ...form, dosage: e.target.value })} 
                        required
                      />
                      <small className="text-muted">Include amount, frequency and duration</small>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold">Disease/Condition</label>
                      <input 
                        className="form-control" 
                        placeholder="e.g., Bacterial infection"
                        value={form.diseaseName} 
                        onChange={e => setForm({ ...form, diseaseName: e.target.value })} 
                      />
                      <small className="text-muted">What condition is being treated</small>
                    </div>
                  </div>
                  
                  <div className="form-section-title">Prescriber Information</div>
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Prescribed by (Doctor/Hospital)</label>
                      <input 
                        className="form-control" 
                        placeholder="e.g., Dr. Smith, City Hospital"
                        value={form.prescribedBy} 
                        onChange={e => setForm({ ...form, prescribedBy: e.target.value })} 
                      />
                      <small className="text-muted">Full name of the prescribing doctor</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowForm(false)}>
                  <i className="fas fa-times me-2"></i>Cancel
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSavePrescription} disabled={saving}>
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>Save Prescription
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorPrescriptions;




