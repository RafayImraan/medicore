const mongoose = require('mongoose');

const departmentChatLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  messages: [{ from: { type: String, required: true }, text: { type: String, required: true } }],
  source: { type: String, default: 'departments' }
}, { timestamps: true });

module.exports = mongoose.model('DepartmentChatLog', departmentChatLogSchema);
