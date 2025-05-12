// back-end/models/InfoCard.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InfoCardSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  buttonText: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InfoCard', InfoCardSchema);