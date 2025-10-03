const mongoose = require('mongoose');

const billingIntegrationSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  serviceType: {
    type: String,
    required: true,
    enum: ['consultation', 'lab_test', 'prescription', 'telehealth', 'emergency']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'insurance', 'cash', 'bank_transfer'],
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  insuranceProvider: {
    type: String,
    trim: true
  },
  insurancePolicyNumber: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
billingIntegrationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
billingIntegrationSchema.index({ patientId: 1, status: 1 });
billingIntegrationSchema.index({ appointmentId: 1 });
billingIntegrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('BillingIntegration', billingIntegrationSchema);
