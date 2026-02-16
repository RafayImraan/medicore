const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patient: {
    name: { type: String, required: true },
    phone: String,
    email: String,
    insurance: {
      provider: String,
      number: String
    }
  },
  doctor: {
    id: String,
    name: { type: String, required: true },
    specialization: String,
    experience: Number,
    rating: Number,
    fee: Number,
    languages: [String],
    clinic: String
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  slot: {
    type: Date
  },
  appointmentTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30
  },
  type: {
    type: String,
    enum: ['in-person', 'video', 'phone'],
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  notes: String,
  status: {
    type: String,
    enum: ["pending", "confirmed", "completed", "cancelled", "no-show"],
    default: "pending"
  },
  consultationFee: {
    type: Number,
    required: true
  },
  prescriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
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

// Index for efficient querying
appointmentSchema.index({ "patient.name": 1, appointmentDate: 1 });
appointmentSchema.index({ "doctor.name": 1, appointmentDate: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
module.exports = Appointment;
