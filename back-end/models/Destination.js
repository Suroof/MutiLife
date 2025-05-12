// back-end/models/Destination.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  name: { type: String, required: true },
  mainImage: { type: String, required: true },
  country: { type: String, required: true },
  isBookmarked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', DestinationSchema);