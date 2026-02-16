const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mood: { type: String, trim: true },
  label: { type: String, trim: true },
  source: { type: String, default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('MoodLog', moodLogSchema);
