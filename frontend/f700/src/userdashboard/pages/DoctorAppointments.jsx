import React, { useState } from "react";

const DoctorAppointments = () => {
  // Sample appointment data for the next 7 days (present month and current dates)
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: "John Doe",
      patientId: "KmKFXLXYt8",
      date: "2025-01-22",
      time: "10:00 AM",
      status: "completed",
      type: "Consultation",
      notes: "Hypertension follow-up"
    },
    {
      id: 2,
      patientName: "Jane Smith",
      patientId: "aBcDeFgHi9",
      date: "2025-01-22",
      time: "2:30 PM",
      status: "pending",
      type: "Follow-up",
      notes: "Migraine treatment"
    },
    {
      id: 3,
      patientName: "Mike Johnson",
      patientId: "xYz123AbC4",
      date: "2025-01-23",
      time: "9:00 AM",
      status: "upcoming",
      type: "Initial Consultation",
      notes: "New patient"
    },
    {
      id: 4,
      patientName: "Sarah Wilson",
      patientId: "P004",
      date: "2025-01-24",
      time: "11:30 AM",
      status: "upcoming",
      type: "Check-up",
      notes: "Annual physical"
    },
    {
      id: 5,
      patientName: "David Brown",
      patientId: "P005",
      date: "2025-01-25",
      time: "3:00 PM",
      status: "upcoming",
      type: "Consultation",
      notes: "Diabetes management"
    },
    {
      id: 6,
      patientName: "Emily Davis",
      patientId: "P006",
      date: "2025-01-26",
      time: "10:30 AM",
      status: "upcoming",
      type: "Follow-up",
      notes: "Post-surgery check"
    },
    {
      id: 7,
      patientName: "Robert Taylor",
      patientId: "P007",
      date: "2025-01-27",
      time: "1:00 PM",
      status: "upcoming",
      type: "Emergency",
      notes: "Urgent consultation"
    },
    {
      id: 8,
      patientName: "Lisa Anderson",
      patientId: "P008",
      date: "2025-01-28",
      time: "4:15 PM",
      status: "upcoming",
      type: "Consultation",
      notes: "Chronic pain management"
    }
  ]);

  const [showCalendar, setShowCalendar] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    patientId: "",
    date: "",
    time: "",
    status: "upcoming",
    type: "Consultation",
    notes: ""
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <span className="badge bg-success">Completed</span>;
      case "pending":
        return <span className="badge bg-warning text-dark">Pending</span>;
      case "upcoming":
        return <span className="badge bg-primary">Upcoming</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const groupAppointmentsByDate = () => {
    const grouped = {};
    appointments.forEach(appointment => {
      const date = appointment.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(appointment);
    });
    return grouped;
  };

  const groupedAppointments = groupAppointmentsByDate();

  const handleAddAppointment = async () => {
    if (!form.patientName.trim() || !form.patientId.trim() || !form.date.trim() || !form.time.trim()) {
      alert("Please fill patient name, ID, date and time.");
      return;
    }
    try {
      setSaving(true);
      const newItem = { ...form, id: Date.now() };
      setAppointments(prev => [...prev, newItem]);
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const renderCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed
    const firstDay = new Date(year, month, 1);
    const startingWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    for (let i = 0; i < startingWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    const apptsByDay = appointments.reduce((acc, a) => {
      const d = new Date(a.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(a);
      }
      return acc;
    }, {});

    return (
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white border-0">
          <h5 className="mb-0">
            <i className="fas fa-calendar-alt me-2"></i>
            {today.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
          </h5>
        </div>
        <div className="card-body">
          <div className="row row-cols-7 g-2">
            {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((w) => (
              <div key={w} className="col"><div className="text-center fw-bold small">{w}</div></div>
            ))}
          </div>
          <div className="row row-cols-7 g-2 mt-1">
            {cells.map((day, idx) => (
              <div key={idx} className="col">
                <div className="border rounded p-2" style={{ minHeight: 90 }}>
                  <div className="small fw-bold mb-1">{day || ''}</div>
                  {day && apptsByDay[day] && apptsByDay[day].slice(0,3).map((a) => (
                    <div key={a.id} className="small text-truncate">
                      • {a.time} - {a.patientName}
                    </div>
                  ))}
                  {day && apptsByDay[day] && apptsByDay[day].length > 3 && (
                    <div className="small text-muted">+{apptsByDay[day].length - 3} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid" style={{ paddingLeft: "20px", paddingRight: "20px", paddingTop: "70px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Appointments</h2>
          <p className="text-muted mb-0">Manage your appointments and schedule for the next 7 days</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-primary btn-sm" onClick={() => setShowForm(true)}>
            <i className="fas fa-plus me-2"></i>
            Add Appointment
          </button>
          <button className="btn btn-outline-secondary btn-sm" onClick={() => setShowCalendar(s => !s)}>
            <i className="fas fa-calendar-alt me-2"></i>
            {showCalendar ? 'List View' : 'Calendar View'}
          </button>
        </div>
      </div>

      {/* Optional Calendar */}
      {showCalendar && renderCalendar()}

      {/* Status Summary */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-success mb-1">{appointments.filter(a => a.status === 'completed').length}</h4>
              <p className="text-muted mb-0">Completed</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-warning mb-1">{appointments.filter(a => a.status === 'pending').length}</h4>
              <p className="text-muted mb-0">Pending</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-primary mb-1">{appointments.filter(a => a.status === 'upcoming').length}</h4>
              <p className="text-muted mb-0">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <h4 className="text-info mb-1">{appointments.length}</h4>
              <p className="text-muted mb-0">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="mb-0">
                <i className="fas fa-calendar-check me-2 text-primary"></i>
                Upcoming 7 Days Appointments
              </h5>
            </div>
            <div className="card-body p-0">
              {Object.keys(groupedAppointments).length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times fs-1 text-muted mb-3"></i>
                  <p className="text-muted">No appointments scheduled for the next 7 days</p>
                </div>
              ) : (
                Object.keys(groupedAppointments).sort().map(date => (
                  <div key={date} className="border-bottom">
                    <div className="p-3 bg-light">
                      <h6 className="mb-0 text-primary fw-bold">
                        <i className="fas fa-calendar-day me-2"></i>
                        {formatDate(date)}
                      </h6>
                    </div>
                    {groupedAppointments[date].map(appointment => (
                      <div key={appointment.id} className="p-3 border-bottom">
                        <div className="row align-items-center">
                          <div className="col-md-3">
                            <div className="d-flex align-items-center">
                              <div className="me-3">
                                <i className="fas fa-user-circle fs-3 text-primary"></i>
                              </div>
                              <div>
                                <h6 className="mb-1 fw-bold">{appointment.patientName}</h6>
                                <small className="text-muted">ID: {appointment.patientId}</small>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div>
                              <p className="mb-1 fw-bold">{appointment.type}</p>
                              <small className="text-muted">{appointment.notes}</small>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="text-center">
                              <i className="fas fa-clock text-primary me-1"></i>
                              <span className="fw-bold">{appointment.time}</span>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="text-center">
                              {getStatusBadge(appointment.status)}
                            </div>
                          </div>
                          <div className="col-md-3">
                            <div className="d-flex gap-2 justify-content-end">
                              <button className="btn btn-outline-primary btn-sm" onClick={() => alert(JSON.stringify(appointment, null, 2))}>
                                <i className="fas fa-eye"></i>
                              </button>
                              <button className="btn btn-outline-success btn-sm" onClick={() => setForm(appointment) || setShowForm(true)}>
                                <i className="fas fa-edit"></i>
                              </button>
                              <button className="btn btn-outline-danger btn-sm" onClick={() => setAppointments(prev => prev.filter(a => a.id !== appointment.id))}>
                                <i className="fas fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{form.id ? 'Edit' : 'Add'} Appointment</h5>
                <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Patient Name</label>
                    <input className="form-control" value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Patient ID</label>
                    <input className="form-control" value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Date</label>
                    <input type="date" className="form-control" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Time</label>
                    <input type="time" className="form-control" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="upcoming">Upcoming</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Type</label>
                    <input className="form-control" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Notes</label>
                    <textarea className="form-control" rows="3" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}></textarea>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={handleAddAppointment} disabled={saving}>{saving ? 'Saving...' : (form.id ? 'Update' : 'Save')}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
