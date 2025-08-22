const express = require('express');
const router = express.Router();
const reportcontroller = require('../controllers/reportcontrollers');

// Create a new report
router.post('/', reportcontroller.createReport);

// Get reports by userId
router.get('/:userId', reportcontroller.getReportsByUserId);

// Get a single report by ID
router.get('/id/:id', reportcontroller.getReportById);

// Update a report
router.put('/:id', reportcontroller.updateReport);

// Delete a report (soft delete)
router.delete('/:id', reportcontroller.deleteReport);

module.exports = router;
