const mongoose = require('mongoose');

const articleReadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  articleId: { type: String, trim: true },
  title: { type: String, trim: true },
  category: { type: String, trim: true },
  source: { type: String, default: 'hero' }
}, { timestamps: true });

module.exports = mongoose.model('ArticleRead', articleReadSchema);
