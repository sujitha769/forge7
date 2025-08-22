import React, { useEffect, useState } from 'react';

const MyReports = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newReport, setNewReport] = useState({
    title: '',
    type: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    file: null
  });

  useEffect(() => {
    const load = async () => {
      try {
        const username = localStorage.getItem('username');
        if (!username) throw new Error('Not logged in');
        
        const res = await fetch(`http://localhost:5700/user/profile/${encodeURIComponent(username)}`);
        if (!res.ok) throw new Error('Failed to fetch profile');
        const profile = await res.json();
        setUser(profile);

        // Load reports
        const reportsRes = await fetch(`http://localhost:5700/reports/${encodeURIComponent(profile.userId)}`);
        if (reportsRes.ok) {
          const items = await reportsRes.json();
          setReports(items);
        } else if (reportsRes.status === 404) {
          setReports([]);
        } else {
          throw new Error('Failed to fetch reports');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddReport = async (e) => {
    e.preventDefault();
    
    if (!newReport.title || !newReport.type || !newReport.file) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newReport.title);
      formData.append('type', newReport.type);
      formData.append('description', newReport.description);
      formData.append('date', newReport.date);
      formData.append('file', newReport.file);
      formData.append('userId', user.userId);

      const response = await fetch('http://localhost:5700/reports', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setReports([result.report, ...reports]);
        setShowAddModal(false);
        setNewReport({
          title: '',
          type: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          file: null
        });
        alert('Report added successfully!');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add report');
      }
    } catch (error) {
      alert('Error adding report: ' + error.message);
    }
  };

  const handleDownload = (report) => {
    if (report.fileUrl) {
      try {
        // Construct the full URL for the file - remove any leading slash issues
        const cleanFileUrl = report.fileUrl.startsWith('/') ? report.fileUrl : `/${report.fileUrl}`;
        const fullUrl = `http://localhost:5700${cleanFileUrl}`;
        
        console.log('Downloading from:', fullUrl); // Debug log
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = report.fileName || `${report.title}.pdf`;
        link.target = '_blank';
        
        // Add to DOM, click, and remove
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        alert('Download started! Check your downloads folder.');
      } catch (error) {
        console.error('Download error:', error);
        alert('Download failed. Please try again.');
      }
    } else {
      alert('No file available for download');
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handlePrintReport = (report) => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medical Report - ${report.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { color: #333; margin: 0; }
            .header p { color: #666; margin: 5px 0; }
            .report-details { margin: 20px 0; }
            .detail-row { display: flex; margin: 10px 0; border-bottom: 1px solid #eee; padding: 8px 0; }
            .detail-label { font-weight: bold; width: 150px; color: #333; }
            .detail-value { flex: 1; color: #666; }
            .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Report</h1>
            <p><strong>Patient:</strong> ${user?.name || 'Unknown'}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="report-details">
            <div class="detail-row">
              <div class="detail-label">Report Title:</div>
              <div class="detail-value">${report.title}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Report Type:</div>
              <div class="detail-value">${report.type}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Description:</div>
              <div class="detail-value">${report.description || 'No description provided'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Report Date:</div>
              <div class="detail-value">${report.date ? new Date(report.date).toLocaleDateString() : 'Not specified'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">File Name:</div>
              <div class="detail-value">${report.fileName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">File Size:</div>
              <div class="detail-value">${(report.fileSize / 1024).toFixed(2)} KB</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Status:</div>
              <div class="detail-value">${report.status}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>This report was generated on ${new Date().toLocaleString()}</p>
            <p>Please consult with your healthcare provider for any questions about this report.</p>
          </div>
          
          <div class="no-print" style="margin-top: 20px; text-center;">
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewReport({ ...newReport, file });
    }
  };

  if (loading) {
    return (
      <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading your reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">My Reports</h3>
          <p className="text-muted mb-0">
            Welcome back, {user?.name || 'Patient'}! Manage your medical reports here.
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Add Report
          </button>
          <span className="badge bg-info fs-6">
            {reports.length} Report{reports.length !== 1 ? 's' : ''}
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

      {/* Reports Display */}
      {!loading && reports.length === 0 && (
        <div className="text-center py-5">
          <i className="fas fa-file-medical fa-3x text-muted mb-3"></i>
          <h5 className="text-muted">No reports found</h5>
          <p className="text-muted">
            You don't have any reports yet. Click "Add Report" to upload your first medical report.
          </p>
        </div>
      )}

      {reports.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0">
              <i className="fas fa-list me-2"></i>
              Report Details
            </h5>
          </div>
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>File</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(report => (
                  <tr key={report._id}>
                    <td>
                      <div>
                        <strong>{report.title}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-primary">
                        {report.type}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted">
                        {report.description || '-'}
                      </span>
                    </td>
                    <td>
                      <span className="text-muted">
                        {report.date ? new Date(report.date).toLocaleDateString() : '-'}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {report.fileName}
                      </small>
                    </td>
                    <td>
                      <span className="badge bg-success">Available</span>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-success btn-sm"
                          onClick={() => handleDownload(report)}
                          title="Download Report"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                        <button 
                          className="btn btn-outline-info btn-sm" 
                          onClick={() => handleViewDetails(report)}
                          title="View Details"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-primary btn-sm" 
                          onClick={() => handlePrintReport(report)}
                          title="Print Report"
                        >
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
      {reports.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-3">
                <h4 className="text-primary mb-1">
                  {reports.length}
                </h4>
                <small className="text-muted">Total Reports</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-3">
                <h4 className="text-success mb-1">
                  {reports.filter(r => r.type === 'Blood Test').length}
                </h4>
                <small className="text-muted">Blood Tests</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-3">
                <h4 className="text-warning mb-1">
                  {reports.filter(r => r.type === 'X-Ray').length}
                </h4>
                <small className="text-muted">X-Rays</small>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm text-center">
              <div className="card-body py-3">
                <h4 className="text-info mb-1">
                  {reports.filter(r => r.type === 'Other').length}
                </h4>
                <small className="text-muted">Other Reports</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Report Modal */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-plus me-2"></i>
                  Add New Report
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAddReport}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Report Title *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={newReport.title}
                          onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                          placeholder="e.g., Blood Test Report"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Report Type *</label>
                        <select
                          className="form-select"
                          value={newReport.type}
                          onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                          required
                        >
                          <option value="">Select Type</option>
                          <option value="Blood Test">Blood Test</option>
                          <option value="X-Ray">X-Ray</option>
                          <option value="MRI">MRI</option>
                          <option value="CT Scan">CT Scan</option>
                          <option value="Ultrasound">Ultrasound</option>
                          <option value="ECG">ECG</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={newReport.description}
                      onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                      placeholder="Brief description of the report..."
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Report Date</label>
                        <input
                          type="date"
                          className="form-control"
                          value={newReport.date}
                          onChange={(e) => setNewReport({...newReport, date: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Upload File *</label>
                        <input
                          type="file"
                          className="form-control"
                          onChange={handleFileChange}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          required
                        />
                        <small className="text-muted">
                          Supported formats: PDF, DOC, DOCX, JPG, PNG (Max: 10MB)
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>
                    Add Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View Report Details Modal */}
      {showViewModal && selectedReport && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-eye me-2"></i>
                  Report Details
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Report Title:</label>
                      <p className="form-control-plaintext">{selectedReport.title}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Report Type:</label>
                      <p className="form-control-plaintext">
                        <span className="badge bg-primary">{selectedReport.type}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Description:</label>
                  <p className="form-control-plaintext">
                    {selectedReport.description || 'No description provided'}
                  </p>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Report Date:</label>
                      <p className="form-control-plaintext">
                        {selectedReport.date ? new Date(selectedReport.date).toLocaleDateString() : 'Not specified'}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">Status:</label>
                      <p className="form-control-plaintext">
                        <span className="badge bg-success">{selectedReport.status}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">File Name:</label>
                      <p className="form-control-plaintext">{selectedReport.fileName}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-bold">File Size:</label>
                      <p className="form-control-plaintext">
                        {selectedReport.fileSize ? (selectedReport.fileSize / 1024).toFixed(2) + ' KB' : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold">Created:</label>
                  <p className="form-control-plaintext">
                    {selectedReport.createdAt ? new Date(selectedReport.createdAt).toLocaleString() : 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-outline-primary"
                  onClick={() => handlePrintReport(selectedReport)}
                >
                  <i className="fas fa-print me-2"></i>
                  Print Report
                </button>
                <button 
                  type="button" 
                  className="btn btn-outline-success"
                  onClick={() => handleDownload(selectedReport)}
                >
                  <i className="fas fa-download me-2"></i>
                  Download
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReports;
