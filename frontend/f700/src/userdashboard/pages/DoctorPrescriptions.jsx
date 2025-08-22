import React, { useState, useEffect } from 'react';

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

  // Test render
  console.log('DoctorPrescriptions rendering...');

  const handleSearch = async () => {
    if (!enteredId.trim()) {
      setError('Please enter a Client/User ID');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const res = await fetch(`http://localhost:5700/user/profile-by-id/${encodeURIComponent(enteredId)}`);
      
      if (res.status === 404) {
        setError('No data found for this Client/User ID');
        setClient(null);
        setPrescriptions([]);
        return;
      }
      
      if (!res.ok) throw new Error('Failed to fetch client');
      
      const data = await res.json();
      
      if (data.role !== 'client') {
        setError('The entered ID belongs to a doctor. Please enter a Client/User ID.');
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

      {/* Client Search */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">Client Search</h5>
            </div>
            <div className="card-body">
              <div className="row align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Enter Client/User ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. KmKFXLXYt8"
                    value={enteredId}
                    onChange={(e) => setEnteredId(e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <button className="btn btn-primary w-100" onClick={handleSearch} disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Searching...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-search me-2"></i>
                        Search Client
                      </>
                    )}
                  </button>
                </div>
                <div className="col-md-6">
                  <div className="alert alert-info mb-0">
                    Enter the exact User ID shown on the client's profile page. Doctor IDs are not allowed.
                  </div>
                </div>
              </div>
              {error && (
                <div className="alert alert-danger mt-3 mb-0">{error}</div>
              )}
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

      {/* Client Information */}
      {client && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0">
                <h5 className="mb-0">Client Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Name:</label>
                      <p className="mb-0">{client.name || '-'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Email:</label>
                      <p className="mb-0">{client.email || '-'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">User ID:</label>
                      <p className="mb-0">{client.userId || '-'}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Phone:</label>
                      <p className="mb-0">{client.phone || '-'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Address:</label>
                      <p className="mb-0">{client.address || '-'}</p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-bold">Role:</label>
                      <p className="mb-0">{client.role || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Prescriptions */}
      {client && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Active Prescriptions</h5>
                <button className="btn btn-primary btn-sm" onClick={handleOpenForm}>
                  <i className="fas fa-plus me-2"></i>
                  Add Prescription
                </button>
              </div>
              <div className="card-body p-0">
                {prescriptions.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-pills fs-1 text-muted mb-3"></i>
                    <p className="text-muted">No active prescriptions found for this client</p>
                    <button className="btn btn-outline-primary" onClick={handleOpenForm}>
                      <i className="fas fa-plus me-2"></i>
                      Add First Prescription
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Prescription</th>
                          <th>Formulation</th>
                          <th>Dosage</th>
                          <th>Disease Name</th>
                          <th>Prescribed by</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prescriptions.map((p) => (
                          <tr key={p._id}>
                            <td><strong>{p.prescription}</strong></td>
                            <td>{p.formulation}</td>
                            <td>{p.dosage}</td>
                            <td>{p.diseaseName}</td>
                            <td>{p.prescribedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {prescriptions.length > 0 && (
                  <div className="card-footer bg-white border-0">
                    <div className="row">
                      <div className="col-md-6">
                        <p className="mb-0"><strong>Total Active Prescriptions:</strong> {prescriptions.length}</p>
                      </div>
                      <div className="col-md-6 text-end">
                        <button className="btn btn-success btn-sm" onClick={handleOpenForm}>
                          <i className="fas fa-plus me-2"></i>
                          Add Another Prescription
                        </button>
                      </div>
                    </div>
                  </div>
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
                  <i className="fas fa-plus me-2"></i>
                  Add New Prescription
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Prescription Name *</label>
                      <input 
                        className="form-control" 
                        placeholder="e.g., Amoxicillin 500mg"
                        value={form.prescription} 
                        onChange={e => setForm({ ...form, prescription: e.target.value })} 
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
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
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Dosage *</label>
                      <input 
                        className="form-control" 
                        placeholder="e.g., 1 tablet twice daily"
                        value={form.dosage} 
                        onChange={e => setForm({ ...form, dosage: e.target.value })} 
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Disease/Condition</label>
                      <input 
                        className="form-control" 
                        placeholder="e.g., Bacterial infection"
                        value={form.diseaseName} 
                        onChange={e => setForm({ ...form, diseaseName: e.target.value })} 
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Prescribed by (Doctor/Hospital)</label>
                  <input 
                    className="form-control" 
                    placeholder="e.g., Dr. Smith, City Hospital"
                    value={form.prescribedBy} 
                    onChange={e => setForm({ ...form, prescribedBy: e.target.value })} 
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
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




