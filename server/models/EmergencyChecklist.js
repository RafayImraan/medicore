const mongoose = require('mongoose');

const emergencyChecklistSchema = new mongoose.Schema({
  language: { type: String, enum: ['en', 'ur'], required: true },
  items: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('EmergencyChecklist', emergencyChecklistSchema);
