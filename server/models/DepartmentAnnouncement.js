const mongoose = require('mongoose');

const departmentAnnouncementSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  startAt: { type: Date, default: Date.now },
  endAt: { type: Date },
  tags: [{ type: String, trim: true }]
}, { timestamps: true });

module.exports = mongoose.model('DepartmentAnnouncement', departmentAnnouncementSchema);
