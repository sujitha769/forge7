import React, { useState } from 'react';

// Minimal placeholder form to unblock routing. We can expand later to multi-step.
const DoctorRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    role: 'doctor'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5700/user/adduser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, username: formData.email.split('@')[0] })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      alert('Doctor registered! Please login.');
      window.location.href = '/login';
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '560px' }}>
        <h3 className="mb-3 text-center">Doctor Registration</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Phone</label>
              <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-control" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Address</label>
            <input className="form-control" name="address" value={formData.address} onChange={handleChange} />
          </div>
          <button className="btn btn-primary w-100" type="submit">Complete Registration</button>
        </form>
      </div>
    </div>
  );
};

export default DoctorRegister;


