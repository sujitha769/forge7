import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Badge } from 'react-bootstrap';

const DoctorSettings = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    phone: '',
    bio: '',
    location: '',
    education: ''
  });
  
  const [availabilityData, setAvailabilityData] = useState({
    monday: { start: '09:00', end: '17:00', available: true, maxPatients: 10 },
    tuesday: { start: '09:00', end: '17:00', available: true, maxPatients: 10 },
    wednesday: { start: '09:00', end: '17:00', available: true, maxPatients: 10 },
    thursday: { start: '09:00', end: '17:00', available: true, maxPatients: 10 },
    friday: { start: '09:00', end: '17:00', available: true, maxPatients: 10 },
    saturday: { start: '09:00', end: '13:00', available: false, maxPatients: 5 },
    sunday: { start: '09:00', end: '17:00', available: false, maxPatients: 0 }
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    prescriptionUpdates: true,
    patientMessages: true,
    systemUpdates: false
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: 'light',
    fontSize: 'medium',
    colorScheme: 'default',
    sidebarCollapsed: false
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:5700/user/profile/${encodeURIComponent(username)}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          specialization: data.specialization || '',
          experience: data.experience || '',
          phone: data.phone || '',
          bio: data.bio || '',
          location: data.location || '',
          education: data.education || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:5700/user/update-profile/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setShowProfileModal(false);
      } else {
        setMessage({ type: 'danger', text: 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error updating profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleAvailabilitySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:5700/user/update-availability/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(availabilityData)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Availability updated successfully!' });
        setShowAvailabilityModal(false);
      } else {
        setMessage({ type: 'danger', text: 'Failed to update availability' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error updating availability' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'danger', text: 'New passwords do not match' });
      return;
    }
    
    setLoading(true);
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:5700/user/change-password/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully!' });
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'danger', text: 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error changing password' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:5700/user/update-notifications/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationSettings)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Notification settings updated successfully!' });
        setShowNotificationsModal(false);
      } else {
        setMessage({ type: 'danger', text: 'Failed to update notification settings' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error updating notification settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:5700/user/update-theme/${encodeURIComponent(username)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeSettings)
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Theme settings updated successfully!' });
        setShowThemeModal(false);
        // Apply theme changes immediately
        document.body.className = `theme-${themeSettings.theme}`;
      } else {
        setMessage({ type: 'danger', text: 'Failed to update theme settings' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'Error updating theme settings' });
    } finally {
      setLoading(false);
    }
  };

  const toggleDayAvailability = (day) => {
    setAvailabilityData(prev => ({
      ...prev,
      [day]: { ...prev[day], available: !prev[day].available }
    }));
  };

  const getStatusBadge = (available) => {
    return available ? 
      <Badge bg="success">Active</Badge> : 
      <Badge bg="secondary">Inactive</Badge>;
  };

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <h3 className="mb-4">Account Settings</h3>
      
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}
      
      <div className="row">
        <div className="col-lg-8">
          {/* Professional Information Section */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title fw-bold mb-2">Professional Information</h5>
                  <p className="text-muted mb-0">Update your professional details and credentials.</p>
                </div>
                <Badge bg="primary" className="fs-6">Core Profile</Badge>
              </div>
              <button 
                className="btn btn-outline-primary px-4"
                onClick={() => setShowProfileModal(true)}
              >
                <i className="fas fa-edit me-2"></i>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Availability Section */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title fw-bold mb-2">Availability</h5>
                  <p className="text-muted mb-0">Manage your appointment schedule and availability.</p>
                </div>
                <div className="text-end">
                  <Badge bg="info" className="fs-6">Schedule</Badge>
                  <div className="small text-muted mt-1">
                    {Object.values(availabilityData).filter(day => day.available).length} days active
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-outline-info px-4"
                onClick={() => setShowAvailabilityModal(true)}
              >
                <i className="fas fa-calendar-alt me-2"></i>
                Set Availability
              </button>
            </div>
          </div>

          {/* Security Section */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title fw-bold mb-2">Security</h5>
                  <p className="text-muted mb-0">Change password and security settings.</p>
                </div>
                <Badge bg="warning" className="fs-6">Security</Badge>
              </div>
              <button 
                className="btn btn-outline-warning px-4"
                onClick={() => setShowPasswordModal(true)}
              >
                <i className="fas fa-lock me-2"></i>
                Change Password
              </button>
            </div>
          </div>

          {/* Notifications Section - NEW FEATURE */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title fw-bold mb-2">Notifications</h5>
                  <p className="text-muted mb-0">Customize your notification preferences.</p>
                </div>
                <Badge bg="success" className="fs-6">Smart</Badge>
              </div>
              <button 
                className="btn btn-outline-success px-4"
                onClick={() => setShowNotificationsModal(true)}
              >
                <i className="fas fa-bell me-2"></i>
                Manage Notifications
              </button>
            </div>
          </div>

          {/* Theme & Appearance - NEW FEATURE */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="card-title fw-bold mb-2">Theme & Appearance</h5>
                  <p className="text-muted mb-0">Personalize your dashboard experience.</p>
                </div>
                <Badge bg="secondary" className="fs-6">Custom</Badge>
              </div>
              <button 
                className="btn btn-outline-secondary px-4"
                onClick={() => setShowThemeModal(true)}
              >
                <i className="fas fa-palette me-2"></i>
                Customize Theme
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quick Stats */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Quick Stats</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Active Days:</span>
                <Badge bg="success">{Object.values(availabilityData).filter(day => day.available).length}</Badge>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Hours/Week:</span>
                <Badge bg="info">
                  {Object.values(availabilityData)
                    .filter(day => day.available)
                    .reduce((total, day) => {
                      const start = new Date(`2000-01-01 ${day.start}`);
                      const end = new Date(`2000-01-01 ${day.end}`);
                      return total + (end - start) / (1000 * 60 * 60);
                    }, 0).toFixed(1)}h
                </Badge>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Notifications:</span>
                <Badge bg="warning">
                  {Object.values(notificationSettings).filter(setting => setting).length}/6
                </Badge>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3">Quick Actions</h6>
              <div className="d-grid gap-2">
                <button className="btn btn-sm btn-outline-primary">
                  <i className="fas fa-download me-2"></i>
                  Export Profile
                </button>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="fas fa-print me-2"></i>
                  Print Schedule
                </button>
                <button className="btn btn-sm btn-outline-info">
                  <i className="fas fa-share me-2"></i>
                  Share Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-user-edit me-2"></i>Edit Professional Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleProfileSubmit}>
          <Modal.Body>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    required
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Specialization</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.specialization}
                    onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
                    placeholder="e.g., Cardiology, Neurology"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Years of Experience</Form.Label>
                  <Form.Control
                    type="number"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                    min="0"
                    max="50"
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    placeholder="City, State"
                  />
                </Form.Group>
              </div>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={profileData.bio}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                placeholder="Tell patients about your expertise and approach..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Education</Form.Label>
              <Form.Control
                type="text"
                value={profileData.education}
                onChange={(e) => setProfileData({...profileData, education: e.target.value})}
                placeholder="e.g., MD from Harvard Medical School"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Availability Modal */}
      <Modal show={showAvailabilityModal} onHide={() => setShowAvailabilityModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-calendar-alt me-2"></i>Set Weekly Availability</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAvailabilitySubmit}>
          <Modal.Body>
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Set your weekly schedule. Patients will only be able to book appointments during your active hours.
            </div>
            {Object.entries(availabilityData).map(([day, schedule]) => (
              <div key={day} className="row align-items-center mb-3 p-3 border rounded">
                <div className="col-md-2">
                  <Form.Check
                    type="checkbox"
                    label={day.charAt(0).toUpperCase() + day.slice(1)}
                    checked={schedule.available}
                    onChange={() => toggleDayAvailability(day)}
                  />
                </div>
                <div className="col-md-3">
                  <Form.Control
                    type="time"
                    value={schedule.start}
                    onChange={(e) => setAvailabilityData(prev => ({
                      ...prev,
                      [day]: { ...prev[day], start: e.target.value }
                    }))}
                    disabled={!schedule.available}
                  />
                </div>
                <div className="col-md-3">
                  <Form.Control
                    type="time"
                    value={schedule.end}
                    onChange={(e) => setAvailabilityData(prev => ({
                      ...prev,
                      [day]: { ...prev[day], end: e.target.value }
                    }))}
                    disabled={!schedule.available}
                  />
                </div>
                <div className="col-md-2">
                  <Form.Control
                    type="number"
                    placeholder="Max"
                    value={schedule.maxPatients}
                    onChange={(e) => setAvailabilityData(prev => ({
                      ...prev,
                      [day]: { ...prev[day], maxPatients: parseInt(e.target.value) || 0 }
                    }))}
                    disabled={!schedule.available}
                    min="1"
                    max="20"
                  />
                </div>
                <div className="col-md-2">
                  {getStatusBadge(schedule.available)}
                </div>
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAvailabilityModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Availability'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Password Change Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-lock me-2"></i>Change Password</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handlePasswordSubmit}>
          <Modal.Body>
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Password must be at least 6 characters long and should include a mix of letters, numbers, and symbols.
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                minLength="6"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
                minLength="6"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Changing...' : 'Change Password'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Notifications Modal - NEW FEATURE */}
      <Modal show={showNotificationsModal} onHide={() => setShowNotificationsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-bell me-2"></i>Notification Preferences</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleNotificationSubmit}>
          <Modal.Body>
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Choose how you want to be notified about important events and updates.
            </div>
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="d-flex justify-content-between align-items-center mb-3 p-2 border rounded">
                <div>
                  <Form.Label className="mb-0 fw-bold">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Form.Label>
                  <div className="small text-muted">
                    {key === 'emailNotifications' && 'Receive notifications via email'}
                    {key === 'smsNotifications' && 'Receive notifications via SMS'}
                    {key === 'appointmentReminders' && 'Get reminded about upcoming appointments'}
                    {key === 'prescriptionUpdates' && 'Notifications about prescription changes'}
                    {key === 'patientMessages' && 'Alerts for new patient messages'}
                    {key === 'systemUpdates' && 'System maintenance and update notifications'}
                  </div>
                </div>
                <Form.Check
                  type="switch"
                  checked={value}
                  onChange={(e) => setNotificationSettings(prev => ({
                    ...prev,
                    [key]: e.target.checked
                  }))}
                />
              </div>
            ))}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNotificationsModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Notifications'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Theme Modal - NEW FEATURE */}
      <Modal show={showThemeModal} onHide={() => setShowThemeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><i className="fas fa-palette me-2"></i>Theme & Appearance</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleThemeSubmit}>
          <Modal.Body>
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              Customize your dashboard appearance for a personalized experience.
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Theme</Form.Label>
              <Form.Select
                value={themeSettings.theme}
                onChange={(e) => setThemeSettings({...themeSettings, theme: e.target.value})}
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="auto">Auto (System)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Font Size</Form.Label>
              <Form.Select
                value={themeSettings.fontSize}
                onChange={(e) => setThemeSettings({...themeSettings, fontSize: e.target.value})}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Color Scheme</Form.Label>
              <Form.Select
                value={themeSettings.colorScheme}
                onChange={(e) => setThemeSettings({...themeSettings, colorScheme: e.target.value})}
              >
                <option value="default">Default</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="purple">Purple</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                label="Collapse Sidebar by Default"
                checked={themeSettings.sidebarCollapsed}
                onChange={(e) => setThemeSettings({...themeSettings, sidebarCollapsed: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowThemeModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Theme'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default DoctorSettings;




