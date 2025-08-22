import React, { useEffect, useState } from 'react';

const MyPrescriptions = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) throw new Error('Not logged in');
        
        const res = await fetch(`http://localhost:5700/user/profile/${encodeURIComponent(username)}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const profile = await res.json();
        setUser(profile);

        if (!profile.userId) return;
        
        const pr = await fetch(`http://localhost:5700/prescriptions/${encodeURIComponent(profile.userId)}`);
        if (pr.ok) {
          const items = await pr.json();
          setPrescriptions(items);
        } else if (pr.status === 404) {
          // No prescriptions found
          setPrescriptions([]);
        } else {
          throw new Error('Failed to fetch prescriptions');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Export prescriptions to CSV
  const handleExport = () => {
    if (prescriptions.length === 0) {
      alert('No prescriptions to export');
      return;
    }

    const csvContent = [
      // CSV Header
      ['Prescription', 'Formulation', 'Dosage', 'Disease', 'Prescribed By', 'Status', 'Date', 'Priority'].join(','),
      // CSV Data
      ...prescriptions.map(p => [
        `"${p.prescription || ''}"`,
        `"${p.formulation || ''}"`,
        `"${p.dosage || ''}"`,
        `"${p.diseaseName || ''}"`,
        `"${p.prescribedBy || ''}"`,
        `"${p.status || 'active'}"`,
        `"${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ''}"`,
        `"${p.priority || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `prescriptions_${user?.name || 'patient'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print prescriptions
  const handlePrint = () => {
    if (prescriptions.length === 0) {
      alert('No prescriptions to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Prescriptions - ${user?.name || 'Patient'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { color: #333; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .status-active { background-color: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px; }
            .status-completed { background-color: #cce5ff; color: #004085; padding: 4px 8px; border-radius: 4px; }
            .priority-high { background-color: #f8d7da; color: #721c24; padding: 4px 8px; border-radius: 4px; }
            .priority-medium { background-color: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 4px; }
            .priority-low { background-color: #d1ecf1; color: #0c5460; padding: 4px 8px; border-radius: 4px; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Prescriptions Report</h1>
            <p><strong>Patient:</strong> ${user?.name || 'Unknown'}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Total Prescriptions:</strong> ${prescriptions.length}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Prescription</th>
                <th>Formulation</th>
                <th>Dosage</th>
                <th>Disease</th>
                <th>Prescribed By</th>
                <th>Status</th>
                <th>Date</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              ${prescriptions.map(p => `
                <tr>
                  <td><strong>${p.prescription || '-'}</strong></td>
                  <td>${p.formulation || '-'}</td>
                  <td>${p.dosage || '-'}</td>
                  <td>${p.diseaseName || '-'}</td>
                  <td><strong>${p.prescribedBy || 'Dr. Unknown'}</strong></td>
                  <td>
                    <span class="status-${p.status || 'active'}">
                      ${p.status || 'active'}
                    </span>
                  </td>
                  <td>${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                  <td>
                    ${p.priority ? `<span class="priority-${p.priority}">${p.priority}</span>` : '-'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This report was generated on ${new Date().toLocaleString()}</p>
            <p>Please consult with your healthcare provider for any questions about your prescriptions.</p>
          </div>
          
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Report
            </button>
            <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
              Close
            </button>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your prescriptions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">My Prescriptions</h3>
          <p className="text-muted mb-0">
            Welcome back, {user?.name || 'Patient'}! Here are your prescription details.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-info fs-6">
            {prescriptions.length} Prescription{prescriptions.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {/* Prescriptions Display */}
      {!loading && prescriptions.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-pills fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No prescriptions found</h5>
          <p className="text-muted">
            You don't have any prescriptions yet. Contact your doctor to get started.
          </p>
        </div>
      )}

      {prescriptions.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-list me-2"></i>
                Prescription Details
              </h5>
              <div className="d-flex gap-2">
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={handleExport}
                  title="Export to CSV"
                >
                  <i className="fas fa-download me-2"></i>
                  Export
                </button>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handlePrint}
                  title="Print Report"
                >
                  <i className="fas fa-print me-2"></i>
                  Print
                </button>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Prescription</th>
                  <th>Formulation</th>
                  <th>Dosage</th>
                  <th>Disease</th>
                  <th>Prescribed By</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptions.map(p => (
                  <tr key={p._id}>
                    <td>
                      <div>
                        <strong>{p.prescription}</strong>
                        {p.priority === 'high' && <span className="badge bg-danger ms-2">High</span>}
                        {p.priority === 'medium' && <span className="badge bg-warning ms-2">Medium</span>}
                        {p.priority === 'low' && <span className="badge bg-success ms-2">Low</span>}
                      </div>
                    </td>
                    <td>
                      <span className="text-muted">
                        {p.formulation || '-'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark fw-normal">
                        {p.dosage}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted">
                        {p.diseaseName || '-'}
                      </span>
                    </td>
                    <td>
                      <div>
                        <strong>{p.prescribedBy || 'Dr. Unknown'}</strong>
                      </div>
                    </td>
                    <td>
                      {!p.status || p.status === 'active' ? 
                        <span className="badge bg-success">Active</span> : 
                        p.status === 'completed' ? 
                        <span className="badge bg-primary">Completed</span> : 
                        <span className="badge bg-secondary">{p.status}</span>
                      }
                    </td>
                    <td>
                      <span className="text-muted">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button className="btn btn-outline-info btn-sm" title="View Details">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="btn btn-outline-primary btn-sm" title="Print Individual">
                          <i className="fas fa-print"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {prescriptions.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-3">
                <h4 className="text-primary mb-1">
                  {prescriptions.filter(p => !p.status || p.status === 'active').length}
                </h4>
                <small className="text-muted">Active</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-3">
                <h4 className="text-success mb-1">
                  {prescriptions.filter(p => p.status === 'completed').length}
                </h4>
                <small className="text-muted">Completed</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-3">
                <h4 className="text-warning mb-1">
                  {prescriptions.filter(p => p.priority === 'high').length}
                </h4>
                <small className="text-muted">High Priority</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-3">
                <h4 className="text-info mb-1">
                  {prescriptions.length}
                </h4>
                <small className="text-muted">Total</small>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;
