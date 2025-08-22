const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },
  prescription: {
    type: String,
    required: true,
    trim: true,
  },
  formulation: {
    type: String,
    default: 'Tablet',
    trim: true,
  },
  dosage: {
    type: String,
    required: true,
    trim: true,
  },
  diseaseName: {
    type: String,
    default: null,
    trim: true,
  },
  prescribedBy: {
    type: String,
    default: null,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Prescription', prescriptionSchema);


