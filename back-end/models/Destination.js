// back-end/models/Destination.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DestinationSchema = new Schema({
  name: { type: String, required: true },
  title: { type: String }, // 标题字段
  mainImage: { type: String, required: true },
  image: { type: String }, // 图片字段
  country: { type: String, required: true },
  description: { type: String }, // 描述字段
  rating: { type: Number, min: 0, max: 5 }, // 评分字段
  reviewCount: { type: Number, default: 0 }, // 评论数量
  isBookmarked: { type: Boolean, default: false },
  bookmarkedAt: { type: Date }, // 收藏时间
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Destination', DestinationSchema);