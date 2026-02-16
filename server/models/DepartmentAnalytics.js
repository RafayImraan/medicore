const mongoose = require('mongoose');

const departmentAnalyticsSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true, unique: true },
  views: { type: Number, default: 0 },
  compares: { type: Number, default: 0 },
  favorites: { type: Number, default: 0 },
  contacts: { type: Number, default: 0 },
  directions: { type: Number, default: 0 },
  bookings: { type: Number, default: 0 },
  searches: { type: Number, default: 0 },
  chats: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('DepartmentAnalytics', departmentAnalyticsSchema);
