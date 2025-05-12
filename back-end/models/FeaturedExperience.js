// back-end/models/FeaturedExperience.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeaturedExperienceSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FeaturedExperience', FeaturedExperienceSchema);