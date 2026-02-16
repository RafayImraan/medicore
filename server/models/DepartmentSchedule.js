const mongoose = require('mongoose');

const weeklySchema = new mongoose.Schema({
  day: { type: String, required: true },
  startTime: { type: String, trim: true },
  endTime: { type: String, trim: true },
  walkIn: { type: Boolean, default: true },
  telehealth: { type: Boolean, default: false }
}, { _id: false });

const departmentScheduleSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  weekly: [weeklySchema],
  notes: { type: String, trim: true }
}, { timestamps: true });

module.exports = mongoose.model('DepartmentSchedule', departmentScheduleSchema);
