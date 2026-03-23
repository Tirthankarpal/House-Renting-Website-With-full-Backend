const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  home: { type: mongoose.Schema.Types.ObjectId, ref: 'Home', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);