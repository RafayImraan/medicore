const mongoose = require('mongoose');

const homeHealthcareStorySchema = new mongoose.Schema({
  patient: { type: String, required: true, trim: true },
  photo: { type: String, default: '' },
  story: { type: String, default: '' },
  outcome: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('HomeHealthcareStory', homeHealthcareStorySchema);
