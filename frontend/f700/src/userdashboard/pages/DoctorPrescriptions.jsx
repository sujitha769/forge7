import React, { useState } from 'react';

const DoctorPrescriptions = () => {
  const [enteredId, setEnteredId] = useState('');
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  // Add Prescription form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ prescription: '', formulation: 'Tablet', dosage: '', diseaseName: '', prescribedBy: '' });
  const [saving, setSaving] = useState(false);

  const fetchPrescriptions = async (userId) => {
    const pr = await fetch(`http://localhost:5700/prescriptions/${encodeURIComponent(userId)}`);
    if (pr.ok) {
      const items = await pr.json();
      // If backend includes status, prefer only active
      const filtered = Array.isArray(items) ? items.filter(i => !i.status || i.status === 'active') : [];
      setPrescriptions(filtered);
    } else {
      setPrescriptions([]);
    }
  };

  const handleSearch = async () => {
    const userId = (enteredId || '').trim();
    if (!userId) {
      setError('Please enter a Client/User ID');
      setClient(null);
      setPrescriptions([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      setClient(null);
      setPrescriptions([]);
      const res = await fetch(`http://localhost:5700/user/profile-by-id/${encodeURIComponent(userId)}`);
      if (res.status === 404) {
        setError('No data found for this Client/User ID');
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch client');
      const data = await res.json();

      // Enforce client-only: if role is not 'client', show message and abort
      if ((data.role || '').toLowerCase() !== 'client') {
        setError('The entered ID belongs to a doctor. Please enter a Client/User ID.');
        alert('This ID belongs to a doctor. Please enter a Client/User ID.');
        return;
      }

      setClient(data);
      await fetchPrescriptions(userId);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateBillTotal = () => prescriptions.length * 25.5;

  const handleOpenForm = () => {
    if (!client) return;
    setForm({ prescription: '', formulation: 'Tablet', dosage: '', diseaseName: '', prescribedBy: '' });
    setShowForm(true);
  };

  const handleSavePrescription = async () => {
    if (!client) return;
    if (!form.prescription.trim() || !form.dosage.trim()) {
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
      await fetchPrescriptions(client.userId);
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
                      <label className="form-label fw-bold">Date of Birth:</label>
                      <p className="mb-0">{client.dateOfBirth || '-'}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Emergency Contact:</label>
                      <p className="mb-0">{client.emergencyContact || '-'}</p>
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

      {client && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Prescriptions</h5>
                <button className="btn btn-primary btn-sm" onClick={handleOpenForm}>
                  <i className="fas fa-plus me-2"></i>
                  Add Prescription
                </button>
              </div>
              <div className="card-body p-0">
                {prescriptions.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-pills fs-1 text-muted mb-3"></i>
                    <p className="text-muted">No prescriptions found for this client</p>
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
                          <th>Prescribed by (Doc/Hospital)</th>
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
                        <p className="mb-0"><strong>Total Items:</strong> {prescriptions.length}</p>
                      </div>
                      <div className="col-md-6 text-end">
                        <p className="mb-0"><strong>Bill Total:</strong> ${calculateBillTotal().toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Prescription</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Prescription</label>
                  <input className="form-control" value={form.prescription} onChange={e => setForm({ ...form, prescription: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Formulation</label>
                  <input className="form-control" value={form.formulation} onChange={e => setForm({ ...form, formulation: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Dosage</label>
                  <input className="form-control" value={form.dosage} onChange={e => setForm({ ...form, dosage: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Disease Name</label>
                  <input className="form-control" value={form.diseaseName} onChange={e => setForm({ ...form, diseaseName: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Prescribed by</label>
                  <input className="form-control" value={form.prescribedBy} onChange={e => setForm({ ...form, prescribedBy: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleSavePrescription} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
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




