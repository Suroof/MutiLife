const mongoose = require('mongoose');

const NewsCommentSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  likeCount: {
    type: Number,
    default: 0
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NewsComment',
    default: null
  },
  // 引用的评论
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  },
  avatar: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// 添加索引以提高查询性能
NewsCommentSchema.index({ newsId: 1 });
NewsCommentSchema.index({ userId: 1 });
NewsCommentSchema.index({ parentId: 1 });
NewsCommentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('NewsComment', NewsCommentSchema);
