const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 互动记录模型
 * 用于记录用户之间的各种互动，如聊天、礼物、点赞等
 */
const InteractionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['chat', 'gift', 'like', 'comment', 'visit', 'poke', 'other'],
    required: true
  },
  content: {
    type: String,
    maxlength: 500
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    refPath: 'resourceModel'
  },
  resourceModel: {
    type: String,
    enum: ['Moment', 'Chat', 'Gift']
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

// 创建索引以便快速查询用户互动
InteractionSchema.index({ userId: 1, createdAt: -1 });
InteractionSchema.index({ targetId: 1, createdAt: -1 });
InteractionSchema.index({ userId: 1, targetId: 1, type: 1 });

module.exports = mongoose.model('Interaction', InteractionSchema);
