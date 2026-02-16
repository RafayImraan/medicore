const mongoose = require('mongoose');

const homeHealthcareBlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  excerpt: { type: String, default: '' },
  slug: { type: String, required: true, trim: true, unique: true },
  image: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('HomeHealthcareBlogPost', homeHealthcareBlogPostSchema);
