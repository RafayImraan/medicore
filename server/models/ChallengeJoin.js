const mongoose = require('mongoose');

const challengeJoinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  challengeId: { type: String, trim: true },
  challengeName: { type: String, trim: true },
  source: { type: String, default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('ChallengeJoin', challengeJoinSchema);
