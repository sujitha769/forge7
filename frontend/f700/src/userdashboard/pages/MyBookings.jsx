import React from 'react';

const bookings = [
  {
    id: 'b1',
    doctorName: 'Dr. Smith',
    hospital: 'City Medical Center',
    purpose: 'Consultation',
    date: '2024-12-15',
    time: '10:00 AM',
    status: 'Confirmed'
  },
  {
    id: 'b2',
    doctorName: 'Dr. Johnson',
    hospital: 'General Hospital',
    purpose: 'Follow-up',
    date: '2024-12-20',
    time: '2:30 PM',
    status: 'Pending'
  }
];

const StatusBadge = ({ status }) => {
  const isConfirmed = status.toLowerCase() === 'confirmed';
  const badgeClass = isConfirmed ? 'bg-dark text-white' : 'bg-light text-dark border';
  return (
    <span className={`badge ${badgeClass}`} style={{ padding: '8px 12px', borderRadius: '12px' }}>
      {status}
    </span>
  );
};

const BookingCard = ({ booking }) => {
  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="mb-1 fw-bold">{booking.doctorName}</h6>
            <p className="text-muted mb-1">{booking.hospital}</p>
            <p className="text-muted mb-3">{booking.purpose}</p>
            <div className="d-flex align-items-center gap-4 text-muted">
              <div className="d-flex align-items-center">
                <i className="bi bi-calendar-event me-2"></i>
                <span>{booking.date}</span>
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-clock me-2"></i>
                <span>{booking.time}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>
      </div>
    </div>
  );
};

const MyBookings = () => {
  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#ffffff' }}>
      <div className="card border-0">
        <div className="card-body p-3 p-md-4">
          <h5 className="mb-4">My Bookings</h5>
          {bookings.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;



