import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationsForm, setNotificationsForm] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    prescriptionUpdates: true,
    reportNotifications: true
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) return;

        const response = await fetch(`http://localhost:5700/user/profile/${encodeURIComponent(username)}`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setProfileForm({
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            address: userData.address || ''
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:5700/user/update-profile/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setShowProfileModal(false);
        alert('Profile updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:5700/user/change-password/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword
        })
      });

      if (response.ok) {
        setShowSecurityModal(false);
        setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully!');
      } else {
        throw new Error('Failed to change password');
      }
    } catch (error) {
      alert('Error changing password: ' + error.message);
    }
  };

  const handleNotificationsSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:5700/user/update-notifications/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationsForm)
      });

      if (response.ok) {
        setShowNotificationsModal(false);
        alert('Notification settings updated successfully!');
      } else {
        throw new Error('Failed to update notifications');
      }
    } catch (error) {
      alert('Error updating notifications: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="mb-4">
        <h3 className="mb-1">Account Settings</h3>
        <p className="text-muted mb-0">Manage your account preferences and security settings</p>
      </div>

      <div className="row">
        {/* Profile Settings */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="text-center mb-3">
                <i className="fas fa-user-circle fa-3x text-primary"></i>
              </div>
              <h5 className="card-title text-center">Profile Settings</h5>
              <p className="card-text text-muted text-center">
                Update your personal information and preferences.
              </p>
              <button 
                className="btn btn-outline-primary mt-auto"
                onClick={() => setShowProfileModal(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="text-center mb-3">
                <i className="fas fa-shield-alt fa-3x text-success"></i>
              </div>
              <h5 className="card-title text-center">Security</h5>
              <p className="card-text text-muted text-center">
                Manage your password and security settings.
              </p>
              <button 
                className="btn btn-outline-success mt-auto"
                onClick={() => setShowSecurityModal(true)}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-md-4 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="text-center mb-3">
                <i className="fas fa-bell fa-3x text-warning"></i>
              </div>
              <h5 className="card-title text-center">Notifications</h5>
              <p className="card-text text-muted text-center">
                Configure how you receive notifications.
              </p>
              <button 
                className="btn btn-outline-warning mt-auto"
                onClick={() => setShowNotificationsModal(true)}
              >
                Notification Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-user-edit me-2"></i>
                  Edit Profile
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <form onSubmit={handleProfileSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-key me-2"></i>
                  Change Password
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowSecurityModal(false)}></button>
              </div>
              <form onSubmit={handleSecuritySubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowSecurityModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-key me-2"></i>
                    Change Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-bell me-2"></i>
                  Notification Settings
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowNotificationsModal(false)}></button>
              </div>
              <form onSubmit={handleNotificationsSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="emailNotifications"
                        checked={notificationsForm.emailNotifications}
                        onChange={(e) => setNotificationsForm({...notificationsForm, emailNotifications: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="emailNotifications">
                        Email Notifications
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="smsNotifications"
                        checked={notificationsForm.smsNotifications}
                        onChange={(e) => setNotificationsForm({...notificationsForm, smsNotifications: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="smsNotifications">
                        SMS Notifications
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="appointmentReminders"
                        checked={notificationsForm.appointmentReminders}
                        onChange={(e) => setNotificationsForm({...notificationsForm, appointmentReminders: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="appointmentReminders">
                        Appointment Reminders
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="prescriptionUpdates"
                        checked={notificationsForm.prescriptionUpdates}
                        onChange={(e) => setNotificationsForm({...notificationsForm, prescriptionUpdates: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="prescriptionUpdates">
                        Prescription Updates
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="reportNotifications"
                        checked={notificationsForm.reportNotifications}
                        onChange={(e) => setNotificationsForm({...notificationsForm, reportNotifications: e.target.checked})}
                      />
                      <label className="form-check-label" htmlFor="reportNotifications">
                        Report Notifications
                      </label>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowNotificationsModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-warning">
                    <i className="fas fa-save me-2"></i>
                    Save Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
