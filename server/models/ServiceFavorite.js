const mongoose = require('mongoose');

const serviceFavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }
}, { timestamps: true });

module.exports = mongoose.model('ServiceFavorite', serviceFavoriteSchema);
