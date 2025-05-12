// back-end/models/Activity.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ActivitySchema = new Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  iconBackground: { type: String, default: '#FFEEE6' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', ActivitySchema);