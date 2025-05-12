const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 好友关系模型
 * 用于存储用户之间的好友关系
 */
const FriendshipSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  friendId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'accepted'
  },
  tags: [String],
  notes: {
    type: String,
    default: ''
  },
  lastInteractionDate: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// 创建复合索引确保不会有重复的好友关系
FriendshipSchema.index({ userId: 1, friendId: 1 }, { unique: true });

module.exports = mongoose.model('Friendship', FriendshipSchema);
