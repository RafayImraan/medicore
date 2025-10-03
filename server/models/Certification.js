const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "expired"], required: true },
});

module.exports = mongoose.model("Certification", certificationSchema);
