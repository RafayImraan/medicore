const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  items: [
    {
      medicineId: { type: String, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure only one cart per patient
cartSchema.index({ patientId: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
