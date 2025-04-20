const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  author: {
    type: String,
    default: '系统管理员'
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  category: {
    type: String,
    enum: ['社会', '科技', '娱乐', '体育', '健康', '教育', '其他'],
    default: '其他'
  },
  coverImage: {
    type: String,
    default: '/static/images/news/default-cover.jpg'
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  isRecommended: {
    type: Boolean,
    default: false
  },
  isHot: {
    type: Boolean,
    default: false
  },
  publishDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'archived', 'deleted'],
    default: 'active'
  }
}, { timestamps: true });

// 添加索引以提高搜索性能
NewsSchema.index({ title: 'text', content: 'text', summary: 'text', tags: 'text' });
NewsSchema.index({ category: 1 });
NewsSchema.index({ publishDate: -1 });
NewsSchema.index({ viewCount: -1 });
NewsSchema.index({ isRecommended: 1 });
NewsSchema.index({ isHot: 1 });

module.exports = mongoose.model('News', NewsSchema);
