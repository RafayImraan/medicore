const mongoose = require('mongoose');

const reminderLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reminderId: { type: String, trim: true },
  name: { type: String, trim: true },
  taken: { type: Boolean, default: false },
  source: { type: String, default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('ReminderLog', reminderLogSchema);
