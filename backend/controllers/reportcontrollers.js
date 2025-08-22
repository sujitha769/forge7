const reportmodel = require('../models/reportmodel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'reports');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, JPG, PNG are allowed.'));
    }
  }
}).single('file');

// Create a new report
const createReport = async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { title, type, description, date, userId } = req.body;

      if (!title || !type || !userId) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const report = new reportmodel({
        userId,
        title,
        type,
        description: description || '',
        date: date || new Date(),
        fileName: req.file.originalname,
        fileUrl: `/uploads/reports/${req.file.filename}`,
        fileSize: req.file.size
      });

      await report.save();

      res.status(201).json({
        message: 'Report created successfully',
        report: {
          _id: report._id,
          title: report.title,
          type: report.type,
          description: report.description,
          date: report.date,
          fileName: report.fileName,
          fileUrl: report.fileUrl,
          fileSize: report.fileSize,
          status: report.status,
          createdAt: report.createdAt
        }
      });
    });
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reports by userId
const getReportsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const reports = await reportmodel.find({ 
      userId: userId,
      status: { $ne: 'deleted' }
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const report = await reportmodel.findById(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a report
const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, description, date, status } = req.body;

    const report = await reportmodel.findById(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (title) report.title = title;
    if (type) report.type = type;
    if (description !== undefined) report.description = description;
    if (date) report.date = date;
    if (status) report.status = status;

    await report.save();

    res.json({
      message: 'Report updated successfully',
      report
    });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a report (soft delete)
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const report = await reportmodel.findById(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = 'deleted';
    await report.save();

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createReport,
  getReportsByUserId,
  getReportById,
  updateReport,
  deleteReport
};
