import React, { useState } from 'react';

// Three-step Doctor registration with final Review page before submission
const DoctorRegister = () => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    role: 'doctor',
    // Personal
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    // Professional
    licenseNumber: '',
    specialization: '',
    yearsOfExperience: '',
    currentHospitalClinic: ''
  });

  const [docs, setDocs] = useState({
    license: null,
    degree: null,
    govId: null
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        role: formData.role,
        username: formData.email ? formData.email.split('@')[0] : undefined,
        // Keep professional data for future use (backend may ignore for now)
        doctorProfile: {
          licenseNumber: formData.licenseNumber,
          specialization: formData.specialization,
          yearsOfExperience: formData.yearsOfExperience,
          currentHospitalClinic: formData.currentHospitalClinic,
          documents: {
            licenseProvided: !!docs.license,
            degreeProvided: !!docs.degree,
            govIdProvided: !!docs.govId
          }
        }
      };

      const res = await fetch('http://localhost:5700/user/adduser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      alert('Doctor registered successfully!');
      window.location.href = '/login';
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '840px' }}>
      <div className="card shadow-sm">
        <div className="card-body p-4 p-md-5">
          <h3 className="mb-1">Doctor Registration</h3>
          <p className="text-muted mb-4">Step {step} of 4</p>

          {error && (
            <div className="alert alert-danger" role="alert">{error}</div>
          )}

          {step === 1 && (
            <>
              <h6 className="mb-3">Personal Information</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Password</label>
                  <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Date of Birth</label>
                  <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input className="form-control" name="address" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button className="btn btn-primary" onClick={next}>Continue</button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h6 className="mb-3">Professional Information</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Medical License Number</label>
                  <input className="form-control" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Specialization</label>
                  <select className="form-select" name="specialization" value={formData.specialization} onChange={handleChange}>
                    <option value="">Select specialization</option>
                    <option>Cardiology</option>
                    <option>Dermatology</option>
                    <option>Orthopedics</option>
                    <option>Pediatrics</option>
                    <option>General Medicine</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Years of Experience</label>
                  <input className="form-control" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Current Hospital/Clinic</label>
                  <input className="form-control" name="currentHospitalClinic" value={formData.currentHospitalClinic} onChange={handleChange} />
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={back}>Back</button>
                <button className="btn btn-primary" onClick={next}>Continue</button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h6 className="mb-3">Document Verification</h6>
              <p className="text-muted">Please upload the required documents for verification</p>
              <div className="mb-3">
                <label className="form-label">Medical License Document *</label>
                <input type="file" className="form-control" onChange={(e) => setDocs({ ...docs, license: e.target.files?.[0] || null })} />
                <div className="form-text">Upload your medical license (PDF, JPG, PNG)</div>
              </div>
              <div className="mb-3">
                <label className="form-label">Medical Degree Certificate *</label>
                <input type="file" className="form-control" onChange={(e) => setDocs({ ...docs, degree: e.target.files?.[0] || null })} />
                <div className="form-text">Upload your medical degree certificate</div>
              </div>
              <div className="mb-4">
                <label className="form-label">Government ID *</label>
                <input type="file" className="form-control" onChange={(e) => setDocs({ ...docs, govId: e.target.files?.[0] || null })} />
                <div className="form-text">Upload your government-issued ID</div>
              </div>

              <div className="border rounded p-3 mb-3 bg-light">
                <h6 className="mb-3">Documents Status:</h6>
                <div className="d-flex flex-column gap-1 small">
                  <div className="d-flex justify-content-between"><span>Medical License:</span><span>{docs.license ? 'Provided' : 'Required'}</span></div>
                  <div className="d-flex justify-content-between"><span>Medical Certificate:</span><span>{docs.degree ? 'Provided' : 'Required'}</span></div>
                  <div className="d-flex justify-content-between"><span>Government ID:</span><span>{docs.govId ? 'Provided' : 'Required'}</span></div>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-outline-secondary" onClick={back}>Back</button>
                <button className="btn btn-primary" onClick={next} disabled={!docs.license || !docs.degree || !docs.govId}>Continue</button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h6 className="mb-3">Review Details</h6>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <div className="border rounded p-3 h-100">
                    <h6 className="mb-3">Personal</h6>
                    <p className="mb-1"><strong>Name:</strong> {formData.name || '-'}</p>
                    <p className="mb-1"><strong>Email:</strong> {formData.email || '-'}</p>
                    <p className="mb-1"><strong>Phone:</strong> {formData.phone || '-'}</p>
                    <p className="mb-1"><strong>Date of Birth:</strong> {formData.dateOfBirth || '-'}</p>
                    <p className="mb-0"><strong>Address:</strong> {formData.address || '-'}</p>
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <div className="border rounded p-3 h-100">
                    <h6 className="mb-3">Professional</h6>
                    <p className="mb-1"><strong>License No.:</strong> {formData.licenseNumber || '-'}</p>
                    <p className="mb-1"><strong>Specialization:</strong> {formData.specialization || '-'}</p>
                    <p className="mb-1"><strong>Experience:</strong> {formData.yearsOfExperience || '-'}</p>
                    <p className="mb-0"><strong>Hospital/Clinic:</strong> {formData.currentHospitalClinic || '-'}</p>
                  </div>
                </div>
                <div className="col-12">
                  <div className="border rounded p-3">
                    <h6 className="mb-3">Documents</h6>
                    <p className="mb-1"><strong>Medical License:</strong> {docs.license ? docs.license.name : 'Not uploaded'}</p>
                    <p className="mb-1"><strong>Medical Certificate:</strong> {docs.degree ? docs.degree.name : 'Not uploaded'}</p>
                    <p className="mb-0"><strong>Government ID:</strong> {docs.govId ? docs.govId.name : 'Not uploaded'}</p>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button className="btn btn-outline-secondary" onClick={back} disabled={submitting}>Back</button>
                <button className="btn btn-dark" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Complete Registration'}
                </button>
              </div>
              <p className="text-muted small mt-2">After completion you will be redirected to login.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorRegister;


