const express = require('express');
const router = express.Router();
const Prescription = require('../models/prescriptionmodel');

// GET prescriptions by client userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !userId.trim()) return res.json([]);
    const items = await Prescription.find({ userId: userId.trim() }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create a prescription for a client userId
router.post('/', async (req, res) => {
  try {
    const { userId, prescription, formulation, dosage, diseaseName, prescribedBy } = req.body;
    if (!userId || !prescription || !dosage) return res.status(400).json({ message: 'userId, prescription and dosage are required' });
    const created = await Prescription.create({ userId: userId.trim(), prescription, formulation, dosage, diseaseName, prescribedBy });
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


